<template>
  <GmapMap
    ref="mapRef"
    :center="center"
    :zoom="zoom"
    :options="{
      styles:gMapStyle,
      minZoom:3,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: false,
      clickableIcons:false,
      restriction: {
        latLngBounds: { east: 180, north: 85, south: -85, west: -179.99 },
        strictBounds: true
      },
      scrollwheel:true
    }"
    style="width: 100%; height: 100%;"
    @idle="e => readyMap(e)"
    @resize="e => syncCenterAndZoom(e)"
    @rightclick="gMapRightClick"
    @tilesloaded="tilesloaded()"
  >
    <TmxGmapCluster
      v-if="pathFilter && pathFilter.length <= 20000 && isHomeMap"
      ref="tmxclusterer"
      :minimum-cluster-size="clustererOpts.minimumClusterSize"
      :grid-size="clustererOpts.gridSize"
      :average-center="clustererOpts.averageCenter"
      :max-zoom="clustererOpts.maxZoom"
      :cluster-class="clustererOpts.clusterClass"
      :styles="clustererOpts.styles"
      :zoom-on-click="clustererOpts.zoomOnClick"
      @click="infoWindowClose"
      @rightclick="contextmenu"
      @mouseover="infoWindowOpenCluster($event, 'cluster')"
      @mouseout="infoWindowClose"
    >
      <!-- :styles="[{url:require('@/assets/images/home/cluster_icon.png'),textSize: 20,textColor:'white',width:60,height:60}]" -->
      <TmxGmapMarker
        v-for="(marker3, index) in pathFilter"
        :key="index"
        :icon="marker3.iconComp"
        :label="labelFilter(marker3)"
        :position="{ lng: marker3.lng, lat: marker3.lat }"
        :m-key="marker3.sn"
        @mouseover="infoWindowOpenMarker($event, 'marker', marker3, index)"
        @mouseout="infoWindowClose"
        @click="markerClick($event, index)"
      ></TmxGmapMarker>
      <!-- @click="markerClicked(marker3)"
        :label="label(marker3)"
        label-text="dddddddddd"
        :icon="icon(marker3.status,marker3.gpsLocating,marker3)"
        :shape="{
            coord: [marker3.lat, marker3.lng, marker3.lat+10,marker3.lng+10],  
            type: 'rect'
        }"
        :attribution="{ attribution :'attribution'}"
      :title="marker3.time+marker3.sn+'\n'+marker3.lng+','+marker3.lat"-->
    </TmxGmapCluster>
    <!-- infowindow 信息弹框 -->
    <TmxGmapInfoWindow
      :ref="infoWindowOpts.ref"
      :info-window-opts="infoWindowOpts"
      @mouseover="infoWindowHover"
      @mouseout="infoWindowClose"
    ></TmxGmapInfoWindow>
    <!-- device list status 使用 -->
    <TmxGmapMarker
      v-if="mark"
      :position="marker"
      :draggable="false"
      :icon="icon(marker.status, marker.gpsLocating, marker)"
      @mouseover="infoWindowOpenMarker($event, 'marker', marker)"
      @mouseout="infoWindowClose"
    ></TmxGmapMarker>
    <!-- device list path路径 使用 -->
    <div v-if="isPathMap && pathFilterCloseSame && pathFilterCloseSame.length">
      <TmxGmapMarker
        v-for="(marker2, index) in pathFilterCloseSame"
        :key="index"
        :label="labelFilter(marker2)"
        :position="{ lng: marker2.lng, lat: marker2.lat }"
        :icon="marker2.iconComp"
        @mouseover="infoWindowOpenMarkerPath($event,'path',marker2,index)"
        @mouseout="infoWindowClosePath(index)"
        @contextmenu="contextMenuOpen"
      ></TmxGmapMarker>
      <GmapPolyline
        v-if="isPathMap"
        :path="pathFilterCloseSame"
        :draggable="false"
        :editable="false"
        :options="{
          strokeColor: '#2D8CF0',
          strokeOpacity: 1,
          strokeWeight: 3
        }"
      ></GmapPolyline>
    </div>
    <!-- 设置中心点 -->
    <TmxGmapMarker
      v-if="locationActive"
      :position="targetPosition"
      :draggable="false"
      :icon="targetIcon()"
      @rightclick="$emit('deleteTarget')"
    ></TmxGmapMarker>
  </GmapMap>
</template>

<script>
import TmxGmapCluster from '././gMapComps/gMapLibs/cluster'
import TmxGmapMarker from './gMapComps/gMapLibs/marker'
import TmxGmapInfoWindow from './gMapComps/infoWindow'
import MapMixin from '../mixins/map'
import { gMapStyle } from '../config/gMapStyle'
import { deviceStatus } from '@/utils/field'

export default {
  name: 'GoogleMap',
  components: {
    TmxGmapCluster,
    TmxGmapMarker,
    TmxGmapInfoWindow
  },
  mixins: [MapMixin],
  props: {
    activePoint: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      readyCenter: false,
      rPointCache: {},
      gMapStyle,
      
      //v2.5.1 start
      clustererOpts: {
        styles: [
          {
            // url: require('@/assets/images/home/cluster_icon.png'),
            textSize: 14,
            textColor: 'white',
            width: 30, //必填用于计算cluster位置
            height: 32
          }
        ],
        averageCenter: true,
        zoomOnClick: true,
        gridSize: 60,
        maxZoom: 22,
        minimumClusterSize: 2,
        clusterClass: 'cluster_style'
      },

      infoWindowOpts: {
        ref: 'TmxGmapOverLay',
        infoPosition: { lng: 0, lat: 0 },
        show: false,
        contents: 'this is content',
        class: 'float-pane',
        pane: 'floatPane',
        type: '', //cluster / marker
        triggerDomStyle: {
          domWidth: 50,
          domHeight: 36
        },
        styleOptions: {
          // content: 'sdfasf',
          pixelOffset: {
            width: 0,
            height: 0
          }
        },
        info: {}
      },
      //v2.5.1 end
    }
  },
  watch: {
    activePoint(listClickObj) {
      //列表点击 marker点 或 聚合点 高亮
      let clusters = [],
        listClickSn = listClickObj.sn
      this.listClickReset()
      let timer = setTimeout(() => {
        this.pathFilter.forEach((item, pindex) => {
          if (item.sn === listClickSn) {
            clusters = this.$refs['tmxclusterer'].$clusterObject.clusters_
            try {
              clusters.forEach(clusterItem => {
                try {
                  clusterItem.markers_.forEach(markerItem => {
                    if (markerItem.sn == listClickSn) {
                      if (clusterItem.clusterIcon_.sums_ === null) {
                        this.markerClick(markerItem, pindex, false)
                        clearTimeout(timer)
                        throw ''
                        // eslint-disable-next-line
                        return
                      } else {
                        clusterItem.clusterIcon_.updateIconClass(
                          'cluster_style_big'
                        )
                        this.clusterHasBigEle = clusterItem
                        clearTimeout(timer)
                        throw ''
                        // eslint-disable-next-line
                        return
                      }
                    }
                  })
                } catch (e) {
                  throw ''
                  // eslint-disable-next-line
                  return
                }
              })
            } catch (e) {
              return
            }
          }
        })
      }, 0)
    }
  },
  methods: {
    //v2.5.1 start
    infoWindowOpenMarker(markerEvent, type, marker, index) {
      let infos = this.pathFilter[index] || marker
      let markerEvents = markerEvent.e
      if (!markerEvents) {
        return
      }
      this.$set(this.infoWindowOpts, 'info', {
        Alias: infos.alias,
        SN: infos.sn,
        Status: deviceStatus[infos.status].name,
        localtion: '--'
      })
      let obj = {
        lng:
          markerEvents && markerEvents.latLng ? markerEvents.latLng.lng() : 0,
        lat:
          markerEvents && markerEvents.latLng ? markerEvents.latLng.lat() : 0,
        domWidth: 0,
        domHeight:
          markerEvents && markerEvents['tb']
            ? markerEvents['tb'].target.offsetHeight / 2
            : 16
        // domWidth: markerEvents&&markerEvents['tb'] ? markerEvents['tb'].target.offsetWidth : 16,
      }
      this.infoWindowOpen(obj, type)

      //根据坐标转详细地址
      this.latLngToDetailAddress(infos)
    },
    infoWindowOpenCluster(clusterEvents, type) {
      if (!this.infoWindowOpts.show) {
        let infoObjData = this.infoContentFn(clusterEvents)
        this.$set(this.infoWindowOpts, 'info', infoObjData)
        let obj = {
          lng: clusterEvents ? clusterEvents.center_.lng() : 0,
          lat: clusterEvents ? clusterEvents.center_.lat() : 0,
          domWidth: clusterEvents
            ? clusterEvents.clusterIcon_.getClusterDom().firstChild.offsetWidth/2 - 15
            : 0,
          domHeight: clusterEvents
            ? clusterEvents.clusterIcon_.getClusterDom().offsetHeight /2 + 1
            : 32
        }
        this.infoWindowOpen(obj, type)
      }
    },
    infoWindowOpenMarkerPath(markerEvent, type, marker, index) {
      let markerEvents = markerEvent.inst
      if (!markerEvents) {
        return
      }
      this.markerClickPath(markerEvents, index, google.maps.Animation.BOUNCE)
      let infos = this.pathFilterCloseSame[index] || marker
      this.$set(this.infoWindowOpts, 'info', {
        Time: infos.time,
        localtion: '--'
      })
      this.pathMarkInfoTimer = setTimeout(() => {
        let obj = {
          lng:
            markerEvents && markerEvents.position
              ? markerEvents.position.lng()
              : 0,
          lat:
            markerEvents && markerEvents.position
              ? markerEvents.position.lat()
              : 0,
          domWidth: 0,
          domHeight:
            markerEvents && markerEvents['tb']
              ? markerEvents['tb'].target.offsetHeight / 2
              : 16
          // domWidth: markerEvents&&markerEvents['tb'] ? markerEvents['tb'].target.offsetWidth : 16,
        }
        this.infoWindowOpen(obj, type)
      }, 500)
      //根据坐标转详细地址
      this.latLngToDetailAddress(infos)
    },
    contextMenuOpen(e){
      this.$emit('markerRightClick',e)
    },
    //v2.5.1 end

    // 地图缩放，获取可视区的中心点、半径、西南、东北的数据(后台)
    readyMap(){
      this.inited = true
      this.readyCenter = this.center
      this.syncCenterAndZoom()
    },
    syncCenterAndZoom() {
      if (this.isHomeMap == false) {
        return
      }
      this.infoWindowClose()
      this.$refs.mapRef.$mapPromise.then(map => {
        let syncCenter = map.getCenter().toJSON()
        let swPoint = map.getBounds().getSouthWest() // 南-西//左下角
        let nePoint = map.getBounds().getNorthEast() // 北-东//右上角
        let distance = google.maps.geometry.spherical.computeDistanceBetween(
          swPoint,
          nePoint
        ) // 获取两点间的距离
        let r
        if (map.getZoom() <= 3) {
          // 解决距离跨越两个半球时，半径计算错误的问题
          r = (40076000 - distance) / 2
        } else {
          r = distance / 2
        }
        this.changeMap(syncCenter, r, swPoint.toJSON(), nePoint.toJSON())
      })
    },
    label(marker) {
      if (marker.devicesArr) {
        let styleObj = {
          text: marker.devicesArr && marker.devicesArr.length.toString(),
          color: 'white',
          fontSize: '20px'
        }
        return styleObj
      }
    },
    // 右键触发
    gMapRightClick(targetData) {
      this.rPointCache = {
        longitude: targetData.latLng.lng(),
        latitude: targetData.latLng.lat()
      }
    }
  }
}
</script>

<style lang="less">
.google-info-window {
  width: 300px;
  height: 200px;
  background: red;
  color: #fff;
}
.gmnoprint,
.gm-style-mtc:nth-child(2) {
  position: absolute !important;
  bottom: 10px !important;
  left: 70px !important;
}
.gmnoprint,
.gm-style-mtc:nth-child(1) {
  position: absolute !important;
  bottom: 10px !important;
  left: 0px !important;
}
.gm-control-active:nth-child(1) {
  margin-top: -140px !important;
}
.gmnoprint .gm-style-cc,.gm-style-cc,.gm-style a,
.gm-style-cc > div {
  display: none !important;
}
div[style*='tmx-marker-label'] {
  line-height: 12px !important;
  border: 1px solid rgba(220, 222, 226, 1);
  border-radius: 2px;
  padding: 5px 6px;
  color: #464c5b !important;
  font-size: 12px !important;
  background: rgba(255, 255, 255, 1);
  // margin-bottom: 17px;
}
.gm-style a img {
  display: none;
}
</style>
