<template>
  <div class="hello">
    <!-- baidu -->
    <baidu-map 
      class="bm-view" 
      :center="mapOpts.center" 
      :zoom="mapOpts.zoom"
      :scroll-wheel-zoom="mapOpts['scroll-wheel-zoom']"
      :mapStyle="{style : 'dark'}"
      @click="mapClick"
      @moveend="(e) => syncCenterAndZoom(e)"
    >
      <tmx-bml-marker-clusterer 
        ref="cluster"
        :averageCenter="clustererOpts.averageCenter" 
        :styles="clustererOpts.styles"
        @contextmenu="contextmenu"
        @mouseover="infoWindowOpen($event,'cluster')"
        @mouseout="infoWindowClose"
        @click="infoWindowClose"
        >
        <tmx-bm-marker 
          v-for="(marker,index) of markers" 
          :key="index"
          :position="{lng: marker.lng, lat: marker.lat}"
          :clicking='true'
          @mouseover="infoWindowOpen(marker,'marker')"
          @mouseout="infoWindowClose"
        >
          <!-- <tmx-bm-label 
            :content="labelOpts.content" 
            :labelStyle="labelOpts.labelStyle" 
            :offset="labelOpts.offset"
          /> -->
        </tmx-bm-marker>
      </tmx-bml-marker-clusterer>

      <!-- <tmx-bml-marker-clusterer 
        ref="cluster"
        :averageCenter="clustererOpts.averageCenter" 
        :styles="clustererOpts.styles"
        @contextmenu="contextmenu"
        @mouseover="infoWindowOpen($event,'cluster')"
        @mouseout="infoWindowClose"
        @click="infoWindowClose"
        >
          <myMarker
            v-for="(marker,index) of markers" 
            :key="index"
            :position="{lng: marker.lng, lat: marker.lat}"
          >
          </myMarker>
      </tmx-bml-marker-clusterer> -->


      <!-- <tmx-bml-over-lay
        :ref="infoWindowOpts.ref"
        :infoWindowOpts = 'infoWindowOpts'
      ></tmx-bml-over-lay> -->
      <!-- <tmxBmPolyLine
        :path="path"
        stroke-color="black"
        :stroke-opacity="0.3"
        :stroke-weight="3"
      ></tmxBmPolyLine>
      <bm-marker 
        v-for="(marker,index) of path" 
        :key="index"
        :position="{lng: marker.lng, lat: marker.lat}"
        :clicking='true'
        @mouseover="infoWindowOpen(marker,'marker')"
        @mouseout="infoWindowClose"
      >
        <tmx-bm-label 
          :content="labelOpts.content" 
          :labelStyle="labelOpts.labelStyle" 
          :offset="labelOpts.offset"
        />
      </bm-marker> -->
    </baidu-map>
  </div>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'
//baidu
//方案一 自建 bmc。vue文件
import myMarker from './bMapComps/divMarker/myMarker'
import tmxBmlMarkerClusterer from './bMapComps/tmxBmMarkerClusterer'
import tmxBmLabel from './bMapComps/tmxBmLabel'
import tmxBmlOverLay from './bMapComps/tmxBmOverLay'
import tmxBmMarker from './bMapComps/tmxBmMarker'
import baiduMap from './bMapComps/map/Map'
// import tmxBmlMarkerClusterer from './baiduComp/tmxBmlMarkerClusterer'
// import tmxBmLabel from './baiduComp/tmxBmLabel'
// import tmxBmlOverLay from './baiduComp/tmxBmlOverLay'
// import tmxBmPolyLine from './baiduComp/tmxBmPolyLine'

//方案二、三非自建 bmc。vue文件
// import MarkerClusterer from 'bmaplib.markerclusterer'
// import {tmxBmlMarkerClusterer}  from 'vue-baidu-map'
// import tmxBmlMarkerClusterer  from '@/../node_modules/vue-baidu-map/components/extra/MarkerClusterer.vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    tmxBmlMarkerClusterer,
    tmxBmLabel,
    tmxBmlOverLay,
    BmlMarkerClusterer,
    tmxBmMarker,
    baiduMap,
    myMarker
  },
  data() {
    return {
      path:[{lng: 116.404, lat: 39.915},
        {lng: 116.405, lat: 39.920},
        {lng: 116.423493, lat: 39.907445}],
      //baidu 
        markers: [],

        mapOpts:{
          zoom: 14,
          center: '深圳市南山区',
          'scroll-wheel-zoom': true
        },

        clustererOpts:{
          styles:[{
              isClassUse:true,
              // url:'https://www.baidu.com/img/flexible/logo/pc/result.png',
              // size: { width:10,height:10},
              class:'cluster_text'
            }
          ],
          averageCenter:true,
          gridSize:null,
          maxZoom:null,
          minClusterSize:null,
        },

        labelOpts:{
          content:'嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻',
          labelStyle:{color: '#464C5B', fontSize : '12px',lineHeight:'12px',border: '1px solid rgba(220,222,226,1)',
                      borderRadius:'2px',padding:'7px 6px',transform: 'translate(-50%, 0px)'},
          offset:{width: 10, height: -30},
        },

        infoWindowOpts: {
          ref:'TmxBmlOverLay',
          infoPosition:{lng: 0, lat: 0},
          show: false,
          contents: 'this is content',
          class:'float-pane',
          pane:'floatPane',
          type:'marker',
          info:{
            title:'title',
            number:'10000',
            list:[
              {
                status:'blue',
                content:'sdfsafsafsafsd'
              },
              {
                status:'red',
                content:'sdfsafsafsafsd'
              },
              {
                status:'green',
                content:'sdfsafsafsafsd'
              },
              {
                status:'gray',
                content:'sdfsafsafsafsd'
              },
            ],
            localtion:'astAlbertson Oldsile Chevroletxx… ',
          }
        },
    }
  },
  created() {
    //方案二、三非自建 bmc。vue文件
      // console.log(tmxBmlMarkerClusterer,'tmxBmlMarkerClusterer');
      // tmxBmlMarkerClusterer.oldBmlMCCreated = tmxBmlMarkerClusterer.created;
      // tmxBmlMarkerClusterer.created = function(){
      //   tmxBmlMarkerClusterer.oldBmlMCCreated&&tmxBmlMarkerClusterer.oldBmlMCCreated()
      //   const _vmthis = this
      //   console.log(MarkerClusterer.prototype._redraw,'in bmlsss xxxx');
      //   MarkerClusterer.prototype._redraw = function () {
      //     this._clearLastClusters();
      //     this._createClusters();
      //     var map = this._map;
      //     for (let index = 0,cluster; cluster = this._clusters[index]; index++) {
      //       console.log(cluster._clusterMarker,'cluster._clusterMarker');
      //       cluster._clusterMarker.oncontextmenu= function(){
      //         _vmthis.$emit('contextmenu',cluster._center)
      //       }
      //       cluster._clusterMarker.onmouseover= function(){
      //         _vmthis.$emit('mouseover',cluster._center)
      //       }
      //       cluster._clusterMarker.onmouseout= function(){
      //         _vmthis.$emit('mouseout')
      //       }
      //     }
      //   };
    // }
  },
  methods: {
    //baidu 
      contextmenu(marker){
        console.log('点击了右键')
      },
      infoWindowOpen(marker,type){
        // console.log(new BMap.Size(100,100),'tmxBmlMarkerClusterer ----> my extend');
        this.infoWindowOpts.type = type
        this.infoWindowOpts.show = true
        this.infoWindowOpts.infoPosition = {
          lng: marker.lng, 
          lat: marker.lat, 
        }
        this.$refs[this.infoWindowOpts.ref].draw()
      },
      infoWindowClose () {
        this.infoWindowOpts.show = false
      },
      mapClick(){
        },
      syncCenterAndZoom(){
        let _this = this
        //清空markers
        let markers = []
        //请求数据
        setTimeout(() => {
          for (let i = 0; i < 55; i++) {  
            const position = {lng: Math.random()*0.04 + 113.920664, lat: Math.random()*0.04 + 22.503938}
            markers.push(position)
          }
          this.markers = markers
          this.$refs.cluster.num = 0
        }, 1000);
      }
  },
}
</script>
<style scoped  lang="less">
.bm-view {
  width: 100%;
  height: 800px;
  margin-top: -100px;
}
</style>
