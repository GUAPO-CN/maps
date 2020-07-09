/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div>
    <div 
      ref="flyaway"
    >
      <GmapInfoWindow 
        :options="infoWindowOpts.styleOptions" 
        :position="infoWindowOpts.infoPosition" 
        :opened="infoWindowOpts.show" 
        @closeclick="infoWindowOpts.show=false"
        @mouseover="mouseover"
        @mouseout="mouseout"
      >
        <slot></slot>
        <infoTemplate
          :info-window-opts="infoWindowOpts"
        ></infoTemplate>
      </GmapInfoWindow>
    </div>
  </div>
</template>

<script>
// export default (function (x) { return x.default || x })(require('./infoWindowImpl.js'))
import GmapInfoWindow from './gMapLibs/infoWindowImpl' 
import infoTemplate from '../infoTemplate'
export default {
  name: 'InfoWindow',
  components: {
    GmapInfoWindow,
    infoTemplate
  },
  props: {
    infoWindowOpts: {
      type: Object,
      default: () => {
        return {
          infoPosition: {lng: 0, lat: 0},
          show: false,
          type: 'marker',
          styleOptions: {
          // content: 'sdfasf',
          pixelOffset: {
            width: 0,
            height: 0
          }
        },
        }
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    mouseover(e){
      this.$emit('mouseover',e)
    },
    mouseout(e){
      this.$emit('mouseout',e)
    }
  }
}
</script>

<style lang="less">
@keyframes show
{
	from {opacity: 0;}
	to {opacity: 1;}
}

.gm-style{
  .gm-style-iw.gm-style-iw-c{
    // background: #000!important;  
    padding: 0 !important;
    box-shadow:0px 12px 48px 16px rgba(0,0,0,0.03),0px 9px 28px 0px rgba(0,0,0,0.05),0px 6px 16px -8px rgba(0,0,0,0.08) !important;
    border-radius:4px !important;
    button{
      display: none !important;
    }
    .gm-style-iw-d{
      overflow: hidden !important;
    }
  // .gm-style-iw-d::-webkit-scrollbar-track, .gm-style-iw-d::-webkit-scrollbar-track-piece {
    //   background: blue;
  // }
    animation:show 0.2s ease-in 1 normal forwards;  
  }
}
.gm-style-iw-t::after{
  animation:show 0.2s ease-in 1 normal forwards; 
}
.infofade-enter-active{
  transition: opacity .5s;
}
.infofade-leave-active {
  transition: opacity 0s;
}
.infofade-enter, .infofade-leave-to /* .infofade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
