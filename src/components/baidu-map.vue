<template>
  <baidu-map
    :map-style="bMapStyle"
    :center="center"
    :zoom="zoom"
    :max-zoom="18"
    :scroll-wheel-zoom="true"
    :map-click="false"
    class="bm-view"
    @moveend="(e) => syncCenterAndZoom(e)"
    @zoomend="(e) => syncCenterAndZoom(e)"
    @resize="(e) => syncCenterAndZoom(e)"
    @click="(e) => clickMap(e)"
    @ready="readyMap()"
    @tilesloaded="tilesloaded()"
  >
    <!--小于2000个点时，显示点聚合效果，否则显示海量点效果 -->
    <tmx-bm-marker-clusterer
      v-if="pathFilter && pathFilter.length <= 20000 && isHomeMap"
      ref="tmxclusterer"
      :average-center="clustererOpts.averageCenter"
      :styles="clustererOpts.styles"
      :max-zoom="clustererOpts.maxZoom"
      :minimum-cluster-size="clustererOpts.minimumClusterSize"
      @contextmenu="contextmenu"
      @mouseover="infoWindowOpenCluster($event, 'cluster')"
      @mouseout="infoWindowClose"
      @click="infoWindowClose"
    >
      <tmx-bm-marker
        v-for="(marker1, index) in pathFilter"
        ref="tmxmarker"
        :key="index"
        :position="marker1"
        :icon="marker1.iconComp"
        :m-key="marker1.sn"
        :m-status="marker1.status"
        :z-index="marker1.zIndex"
        @mouseover="infoWindowOpenMarker($event, 'marker', marker1, index)"
        @mouseout="infoWindowClose"
        @click="markerClick($event, index)"
      >
        <!-- @click="markerClicked(marker1)" -->
        <!-- :title="marker1.time+marker1.sn+'\n'+marker1.lng+','+marker1.lat" -->
        <tmx-bm-label
          v-if="marker1.field && marker1.field.name"
          :content="labelFilter(marker1)"
          :label-style="labelOpts.labelStyle"
          :offset="marker1.iconComp.labelOpts.offset"
        />
      </tmx-bm-marker>
    </tmx-bm-marker-clusterer>
    <!-- infowindow 信息弹框 -->
    <tmx-bm-over-lay
      :ref="infoWindowOpts.ref"
      :info-window-opts="infoWindowOpts"
      @mouseover="infoWindowHover"
      @mouseleave="infoWindowClose"
    ></tmx-bm-over-lay>
    <!-- 海量点  -->
    <!-- <bm-point-collection
      v-if="path && path.length>2000 && isHomeMap"
      :points="path"
      shape="BMAP_POINT_SHAPE_STAR"
      color="red"
      size="BMAP_POINT_SIZE_SMALL"
      @click="handlePointCollection"
    ></bm-point-collection>-->

    <!-- device list status 使用 -->
    <tmx-bm-marker
      v-if="mark"
      :position="marker"
      :draggable="false"
      :icon="icon(marker.status, marker.gpsLocating, marker)"
      @mouseover="infoWindowOpenMarker($event, 'marker', marker)"
      @mouseout="infoWindowClose"
    ></tmx-bm-marker>

    <!-- device list path路径 使用 -->
    <div v-if="isPathMap && pathFilterCloseSame && pathFilterCloseSame.length">
      <tmx-bm-marker
        v-for="(marker2, index) in pathFilterCloseSame"
        :key="index"
        :position="marker2"
        :icon="marker2.iconComp"
        @mouseover="infoWindowOpenMarkerPath($event, 'path', marker2, index)"
        @mouseout="infoWindowClosePath(index)"
      >
        <tmx-bm-label
          v-if="marker2.field && marker2.field.name"
          :content="labelFilter(marker2)"
          :label-style="labelOpts.labelStyle"
          :offset="marker2.iconComp.labelOpts.offset"
        />
        <bm-context-menu :width="180">
          <bm-context-menu-item
            :callback="goToOtherMap"
            :text="$t('view_on_baidu_map')"
          ></bm-context-menu-item>
        </bm-context-menu>
      </tmx-bm-marker>
      <bm-polyline
        :path="pathFilterCloseSame"
        stroke-color="#2D8CF0"
        :stroke-opacity="1"
        :stroke-weight="3"
      ></bm-polyline>
    </div>
    <!-- 设置中心点 右键-->
    <bm-context-menu :width="180">
      <bm-context-menu-item
        v-if="isHomeMap"
        :callback="baiduMapSetPointFn"
        :text="$t('target_setting')"
      ></bm-context-menu-item>
    </bm-context-menu>
    <!-- 设置中心点 显示-->
    <tmx-bm-marker
      v-if="locationActive"
      :position="targetPosition"
      :icon="targetIcon()"
      @rightclick="$emit('deleteTarget')"
    ></tmx-bm-marker>
    <!-- 其它配置 -->
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
      anchor="BMAP_ANCHOR_BOTTOM_LEFT"
    ></bm-map-type>
    <bm-navigation
      anchor="BMAP_ANCHOR_TOP_LEFT"
      type="BMAP_NAVIGATION_CONTROL_ZOOM"
    ></bm-navigation>
  </baidu-map>
</template>

<script>
import MapMixin from '../mixins/map'

//v2.5.1
import tmxBmMarkerClusterer from './bMapComps/tmxBmMarkerClusterer'
import tmxBmLabel from './bMapComps/tmxBmLabel'
import tmxBmMarker from './bMapComps/tmxBmMarker'
import tmxBmOverLay from './bMapComps/tmxBmOverLay'
import { deviceStatus } from '@/utils/field'
import { bMapStyle } from '../config/bMapStyle'

let coordtransform = require('coordtransform')

export default {
  name: 'BaiduMapBox',
  components: {
    //v2.5.1
    tmxBmMarkerClusterer,
    tmxBmLabel,
    tmxBmMarker,
    tmxBmOverLay
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
      rPointCache: {},
      bMapStyle,
      //v2.5.1 start
      clustererOpts: {
        styles: [
          {
            isClassUse: true,
            class: 'cluster_text'
            // url:'https://www.baidu.com/img/flexible/logo/pc/result.png',
            // size: { width:10,height:10},
          }
        ],
        averageCenter: true,
        gridSize: null,
        maxZoom: 18,
        minClusterSize: 2
      },

      labelOpts: {
        content: '--',
        labelStyle: {
          color: '#464C5B',
          fontSize: '12px',
          lineHeight: '12px',
          border: '1px solid rgba(220,222,226,1)',
          borderRadius: '2px',
          padding: '7px 6px',
          transform: 'translate(-50%, -100%)'
        },
        offset: { width: 8 , height: 0 }
      },

      infoWindowOpts: {
        ref: 'tmxBmOverLay',
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
        info: {}
      }
      //v2.5.1 end
    }
  },
  watch: {
    activePoint(listClickObj) {
      //列表点击 marker点 或 聚合点 高亮
      let clusters = [],
        listClickSn = listClickObj.sn
      // console.log(listClickSn, '列表点击sn')
      this.listClickReset()
      let timer = setTimeout(() => {
        this.pathFilter.forEach((item, pindex) => {
          if (item.sn === listClickSn) {
            clusters = this.$refs['tmxclusterer'].originInstance._clusters //拿到可视区域所有cluster，单个marker也会添加到cluster里
            try {
              clusters.forEach(clusterItem => {
                try {
                  clusterItem._markers.forEach(markerItem => {
                    if (markerItem.sn == listClickSn) {
                      // console.log(clusterItem, markerItem, '匹配上了')
                      if (clusterItem._clusterMarker._text === 0) {
                        //单个marker点
                        this.markerClick(markerItem, pindex, false)
                        clearTimeout(timer)
                        throw ''
                        // eslint-disable-next-line
                        return
                      } else {
                        //聚合点
                        clusterItem._clusterMarker._updateCssClass(
                          'cluster_text_big'
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
    },
  },
  methods: {
    //v2.5.1 start
    infoWindowOpenMarker(markerEvents, type, marker, index) {
      let infos = this.pathFilter[index] || marker
      this.$set(this.infoWindowOpts, 'info', {
        Alias: infos.alias,
        SN: infos.sn,
        Status: deviceStatus[infos.status].name,
        localtion: '--'
      })
      let obj = {
        lng:
          markerEvents && markerEvents.currentTarget
            ? markerEvents.currentTarget.point.lng
            : 0,
        lat:
          markerEvents && markerEvents.currentTarget
            ? markerEvents.currentTarget.point.lat
            : 0,
        domWidth: markerEvents
          ? markerEvents.currentTarget['Zc'].offsetWidth
          : 16,
        domHeight: markerEvents
          ? markerEvents.currentTarget['Zc'].offsetHeight
          : 16
      }
      this.infoWindowOpen(obj, type)
      //根据坐标转详细地址
      this.latLngToDetailAddress(infos)
    },
    infoWindowOpenCluster(clusterEvents, type) {
      // console.log(clusterEvents.events.srcElement.offsetWidth,type,'clusterEvents ----> my clusterEvents');
      let infoObjData = this.infoContentFn(clusterEvents.cluster)
      this.$set(this.infoWindowOpts, 'info', infoObjData)
      let obj = {
        lng: clusterEvents ? clusterEvents.point.lng : 0,
        lat: clusterEvents ? clusterEvents.point.lat : 0,
        domWidth: clusterEvents
          ? clusterEvents.events.srcElement.offsetWidth
          : 50,
        domHeight: clusterEvents
          ? clusterEvents.events.srcElement.offsetHeight
          : 36
      }
      this.infoWindowOpen(obj, type)
    },
    infoWindowOpenMarkerPath(markerEvents, type, marker, index) {
      this.markerClickPath(markerEvents, index, BMAP_ANIMATION_BOUNCE)
      let infos = this.pathFilterCloseSame[index] || marker
      this.$set(this.infoWindowOpts, 'info', {
        Time: infos.time,
        localtion: '--'
      })
      this.pathMarkInfoTimer = setTimeout(() => {
        let obj = {
          lng:
            markerEvents && markerEvents.currentTarget
              ? markerEvents.currentTarget.point.lng
              : 0,
          lat:
            markerEvents && markerEvents.currentTarget
              ? markerEvents.currentTarget.point.lat
              : 0,
          domWidth: markerEvents
            ? markerEvents.currentTarget['Zc'].offsetWidth
            : 16,
          domHeight: markerEvents
            ? markerEvents.currentTarget['Zc'].offsetHeight
            : 16
        }
        this.infoWindowOpen(obj, type)
      }, 500)
      //根据坐标转详细地址
      this.latLngToDetailAddress(infos)
    },
    //v2.5.1 end

    syncCenterAndZoom(e) {
      if (!this.isHomeMap) {
        return
      }
      this.syncCenter = e.target.getCenter()
      let swPoint = e.target.getBounds().getSouthWest() // 南-西//左下角
      let nePoint = e.target.getBounds().getNorthEast() // 北-东//右上角
      let wnpoint = new BMap.Point(swPoint.lng, nePoint.lat) // 西-北//左上角
      let sepoint = new BMap.Point(nePoint.lng, swPoint.lat) // 南-东//右下角

      let r1 = e.target.getDistance(sepoint, swPoint) / 2
      let r2 = e.target.getDistance(wnpoint, swPoint) / 2
      this.r = Math.sqrt(r1 * r1 + r2 * r2)
      let format = coordtransform.bd09togcj02(
        this.syncCenter.lng,
        this.syncCenter.lat
      )
      if (this.coordType == 'wgs84') {
        format = coordtransform.gcj02towgs84(format1[0], format1[1])
      }
      this.syncCenter = { lng: format[0], lat: format[1] }
      this.swPoint = {
        lng: coordtransform.bd09togcj02(swPoint.lng, swPoint.lat)[0],
        lat: coordtransform.bd09togcj02(swPoint.lng, swPoint.lat)[1]
      }
      this.nePoint = {
        lng: coordtransform.bd09togcj02(nePoint.lng, nePoint.lat)[0],
        lat: coordtransform.bd09togcj02(nePoint.lng, nePoint.lat)[1]
      }
      this.changeMap(this.syncCenter, this.r, this.swPoint, this.nePoint)
    },
    // 确认中心点
    baiduMapSetPointFn(setTargetData) {
      this.rPointCache = {
        longitude: setTargetData.point.lng,
        latitude: setTargetData.point.lat
      }
    },
    // 海量点点击
    handlePointCollection(e) {
      this.markerClicked(e.point)
    },
    // 地图点击, 获取具体位置
    clickMap(){},
    readyMap() {
      this.inited = true
      this.readyCenter = this.center
      // let geocoder = new BMap.Geocoder()
      // geocoder.getLocation(e.point, function(res) {
      //   // console.log(res)
      // })
      // 百度地图API功能
      // var geoc = new BMap.Geocoder();
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //       console.log(r.point)
      //     var pt = r.point;
      //     geoc.getLocation(pt, function(rs){
      //       var addComp = rs.addressComponents;
      //       console.log(rs);
      //       alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
      //     });
      //   }
      //   else {
      //       alert('failed'+this.getStatus());
      //   }
      // })
    }
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100;
  height: 100%;
}
.anchorBL img {
  display: none;
}
.BMap_cpyCtrl {
  display: none !important;
}
.BMap_stdMpCtrl {
  top: auto !important;
  bottom: 110px !important;
}
.BMap_contextMenu {
  height: 40px;
  span {
    line-height: 36px;
  }
}
.anchorBL div {
  width: 60px;
  height: 30px;
  > div {
    font-size: 15px !important;
    line-height: 25px !important;
  }
}
</style>
