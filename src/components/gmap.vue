<template>
  <div class="hello">
    <!-- google -->
    <GmapMap ref="mapRef" 
      class="bm-view" 
      :center="{lng: 116.404, lat: 39.915}"
      :zoom="15"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false,
        scrollwheel: true
      }"
    >
      <TmxGmapCluster
        clusterClass="cluster_style"
        :minimum-cluster-size="2"
        :grid-size="60"
        :average-center="true"
        :max-zoom="18"
        :styles="[{textSize: 20,textColor:'white',width:30,height:30}]"
        :zoomOnClick='true'
      >
        <!-- @click="gooclick"
        @mouseover="goomouseover"
        @mouseout="goomouseout"
        @rightclick="goorightclick" -->
        <TmxGmapMarker
          v-for="(marker,index) of markers" 
          :key="index"
          :position="{lng: marker.lng, lat: marker.lat}"
          :title="marker.time+marker.sn+'\n'+marker.lng+','+marker.lat"
          :icon="marker.icon"
          :label="label(marker)"
        >
          <!-- @click="toggleInfoWindow(marker,index)" -->
        </TmxGmapMarker>
      </TmxGmapCluster>
      <!-- <mGmapInfoWindow 
        ref="infowindow"
        v-for="(marker,index) of markers"
        :key="index"
        :options="goinfo_Options" 
        :position="{lng: marker.lng, lat: marker.lat}"
        :opened="true" 
        >
        <div >
          (Your content here)
        </div>
      </mGmapInfoWindow> -->
      <!-- <mGmapInfoWindow 
        ref="infowindow"
        :options="goinfo_Options" 
        :position="goinfo_Position" 
        :opened="goinfo_IsOpened" 
        @closeclick="goinfo_IsOpened=false"
        >
        <div class="google-info-window" >
          (Your content here)
        </div>
      </mGmapInfoWindow> -->
    </GmapMap>
  </div>
</template>

<script>
//google
import GmapCluster from './googleComp/cluster' 
import GmapMarkerWithLabel from './googleComp/marker' 
import mGmapInfoWindow from './googleComp/overlay/infoWindow' 
import TmxGmapCluster from '././gMapComps/gMapLibs/cluster'
import TmxGmapMarker from './gMapComps/gMapLibs/marker'
import GmapMap from './gMapComps/components/map'

export default {
  name: 'gmap',
  props: {
    msg: String
  },
  components: {
    GmapCluster,
    GmapMarkerWithLabel,
    mGmapInfoWindow,
    TmxGmapCluster,
    TmxGmapMarker,
    GmapMap
  },
  data() {
    // 插入 10 个随机点
    const markers = []
    for (let i = 0; i < 3; i++) {
      const position = {lng: Math.random()*0.04 + 116.404, lat: Math.random()*0.04 + 39.915}
      // position.icon = {
      //   // path: 'M22 10.5c0 .895-.13 1.76-.35 2.588C20.025 20.723 13.137 28.032 11 28 9.05 28 3.2 21.28.926 14.71.334 13.42 0 11.997 0 10.5c0-.104.013-.206.017-.31C.014 10.117 0 10.04 0 9.967c-.005-.67.065-1.112.194-1.398C1.144 3.692 5.617 0 11 0c5.416 0 9.906 3.74 10.82 8.657.112.29.18.696.18 1.31 0 .083-.013.167-.015.25.003.095.015.188.015.283zM11 5.833c-2.705 0-4.898 2.09-4.898 4.667S8.295 15.167 11 15.167s4.898-2.09 4.898-4.667c0-2.578-2.193-4.667-4.898-4.667z',
      //   path: google.maps.SymbolPath.CIRCLE,
      //   fillColor: '#E84643',
      //   fillOpacity: 1,
      //   strokeColor: 'blue',
      // }
      markers.push(position)
    }
    return {
      //google
        goinfo_Position: null,
        goinfo_IsOpened: false,
        currentMidx: null,
        goinfo_Options: {
          // content: 'sdfasf',
          //optional: offset infowindow so it visually sits nicely on top of our marker
          pixelOffset: {
            width: 0,
            height: -20
          }
        },
        markers:markers
    }
  },
  created() {
  },
  methods: {
    //google
      icon(marker){
        let labelOpts = {
          url:'c'
        }
        return labelOpts
      },
      label(marker){
        let labelOpts = {
          color : 'red',
          fontFamily : 'Avenir, Helvetica, Arial, sans-serif',
          fontSize : '18px',
          fontWeight : '2',
          text: '这个是个lab el，类属label',
          backgroundColor: 'red',
        }
        return labelOpts
      },
      toggleInfoWindow: function(marker, idx) {
        console.log(this.$refs.infowindow.$refs.flyaway.parentNode,'ppppppppppp');
        console.log(marker, idx,'xxx');

        var icon2 = {
          anchor:new google.maps.Point(0, 0),
          labelOrigin:new google.maps.Point(1.5, 1.5),
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: 'green',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3
        }

        this.markers[idx].icon = icon2
        // this.markers[idx].anchorPoint = anchorPoint2
        this.setInfoPosition({lng: marker.lng, lat: marker.lat})
        this.goinfo_Options.content = 'ddddddddddd';

        //check if its the same marker that was selected if yes toggle
        if (this.currentMidx == idx) {
          this.goinfo_IsOpened = !this.goinfo_IsOpened;
        }
        //if different marker set infowindow to open and reset current marker index
        else {
          this.goinfo_IsOpened = true;
          this.currentMidx = idx;
        }
      },
      setInfoPosition(pt = {lng: '', lat: ''}){
        this.goinfo_Position = {lng: pt.lng, lat: pt.lat};
      },
      gooclick(){
        console.log('gooclick')
        this.goinfo_IsOpened = true
      },
      goomouseover(marker){
        if(this.goinfo_IsOpened) {
          return
        }
        let lat = marker.lat || marker.center_.lat()  
        let lng = marker.lng || marker.center_.lng() 
        this.setInfoPosition({lng: lng, lat: lat})
        this.goinfo_IsOpened = true;
        console.log(marker,lat,lng,'goomouseover')
      },
      goomouseout(){
        console.log('goomouseout')
        this.goinfo_IsOpened = false;
      },
      goorightclick(){
        console.log('goorightclick')
        alert('goorightclick')
      },
  },
}
</script>
<style lang="less">
  .cluster_style{
    .cluster_text{
      padding: 10px;
      background: blue;
    }
  }
</style>
<style scoped  lang="less">
.bm-view {
  width: 100%;
  height: 800px;
}
.my-info{
  background: blue;
  width: 200px;
  height: 300px;
}
.google-info-window{
  width: 300px;
  height: 200px;
  background: red;
  color: #fff;
}
.float-pane{
  position: absolute;
  width: 300px;
  height: 200px;
  background: #000;
  color: #fff;
}
</style>
