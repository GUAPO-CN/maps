<template>
  <transition name="infofade">
    <bm-overlay
      v-show="infoWindowOpts.show"
      :class="infoWindowOpts.class + ' bm-overlay'"
      :pane="infoWindowOpts.pane"
      @initialize="initialize"
      @draw="draw"
      @mouseover.native="mouseover"
      @mouseleave.native="mouseleave"
    >
      <slot></slot>
      <infoTemplate
        :info-window-opts="infoWindowOpts"
      ></infoTemplate>
    </bm-overlay>
  </transition>
</template>

<script>
import infoTemplate from '../infoTemplate'
export default {
  name: 'TmxBmOverLay',
  components: {
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
        }
      }
    }
  },
  data() {
    return {
      //baidu 
        // infoWindowOpts: {
        //   infoPosition:{lng: 116.404, lat: 39.915},
        //   show: false,
        //   contents: 'this is content',
        //   class:'float-pane',
        //   pane:'floatPane'
        // },
        bMap: null,
        infoMap: null,
        infoEl: null,
    }
  },
  created() {
  },
  methods: {
    //baidu 
      initialize({el, BMap , map}){
        // console.log(el,'init');
        this.infoEl = el
        this.bMap = BMap
        this.infoMap = map
        el.addEventListener('mousedown',(e)=>{
          window.event? window.event.cancelBubble = true : e.stopPropagation();
          return
        })
      },
      draw () {
        var lng = this.infoWindowOpts.infoPosition ? this.infoWindowOpts.infoPosition.lng : 0
        var lat = this.infoWindowOpts.infoPosition ? this.infoWindowOpts.infoPosition.lat : 0
        // var domWidth = this.infoWindowOpts.triggerDomStyle ? this.infoWindowOpts.triggerDomStyle.domWidth : 0
        var domHeight = this.infoWindowOpts.triggerDomStyle ? this.infoWindowOpts.triggerDomStyle.domHeight : 0
        var offsetX = this.infoWindowOpts.type === 'cluster' ? 0 : 0
        var offsetY = this.infoWindowOpts.type === 'cluster' ? -(domHeight/2) - 10 : -(domHeight) - 1


        const pixel = this.infoMap.pointToOverlayPixel(new this.bMap.Point(lng , lat))
        this.infoEl.style.left = pixel.x + offsetX + 'px'
        this.infoEl.style.top = pixel.y + offsetY + 'px'
      },
      infoWindowClose () {
        this.infoWindowOpts.show = false
      },
      infoWindowOpen () {
        this.infoWindowOpts.show = true
      },
      clear () {
        this.infoWindowOpts.contents = ''
      },
      mouseover(e){
        this.$emit('mouseover',e)
      },
      mouseleave(e){
        this.$emit('mouseleave',e)
      }
  },
}
</script>
<style scoped  lang="less">
.bm-overlay{
  position: absolute;
  transform: translate(-50%,-100%);
  user-select: text !important;
  cursor: pointer;
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