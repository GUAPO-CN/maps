<template>
    <!-- <bm-overlay
      pane="floatPane"
      :class="{sample: true, active}"
      @draw="draw($event,marker)"
      @mouseover.native="active = true"
      @mouseleave.native="active = false">
      <div>我爱北京天安门</div>
    </bm-overlay> -->
    <!-- <bm-overlay
      v-show="infoWindowOpts.show"
      class="float-pane"
      pane="floatPane"
      @initialize	="initialize"
      @draw="draw"
      >
      <p v-text="infoWindowOpts.contents">xxxxxxx</p>
      <button @click="clear">Clear</button>
    </bm-overlay> -->
    <bm-overlay
      class="tmx-bm-overlay"
      v-show="infoWindowOpts.show"
      :class="infoWindowOpts.class"
      :pane="infoWindowOpts.pane"
      @initialize	="initialize"
      @draw="draw"
      >
      <slot></slot>
      <div v-if="infoWindowOpts.type === 'cluster'" class="tmx-bm-overlay-cluster">
        <div class="title" v-if="infoWindowOpts.info&&infoWindowOpts.info.title">{{infoWindowOpts.info.title}}: </div>
        <div class="number" v-if="infoWindowOpts.info&&infoWindowOpts.info.number">{{infoWindowOpts.info.number}}</div>
        <div class="list" v-if="infoWindowOpts.info&&infoWindowOpts.info.list&&infoWindowOpts.info.list.length>0">
          <div class="li" v-for="(item,index) in infoWindowOpts.info.list" :key="item.status">
            <span :class="'icon '+ item.status"></span>
            <span class="status">{{item.status}}:</span>
            <span class="content">{{item.content}}</span>
          </div>
        </div>
      </div>
      <div v-if="infoWindowOpts.type === 'marker'" class="tmx-bm-overlay-cluster">
        <div class="list" v-if="infoWindowOpts.info&&infoWindowOpts.info.list&&infoWindowOpts.info.list.length>0">
          <div class="li" v-for="(item,index) in infoWindowOpts.info.list" :key="item.status">
            <span :class="'icon '+ item.status"></span>
            <span class="status">{{item.status}}:</span>
            <span class="content">{{item.content}}</span>
          </div>
        </div>
        <div class="localtion" v-if="infoWindowOpts.info&&infoWindowOpts.info.localtion">{{infoWindowOpts.info.localtion}}</div>
      </div>
    </bm-overlay>
</template>

<script>
export default {
  name: 'tmxBmOverLay',
  props: {
    infoWindowOpts:{
      type:Object,
      default :() => {
        return {
          infoPosition:{lng: 0, lat: 0},
          show: false,
          type: 'marker',
        }
      }
    }
  },
  components: {
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
        bMap:null,
        infoMap:null,
        infoEl:null,
    }
  },
  created() {
  },
  methods: {
    //baidu 
      initialize({el, BMap , map}){
        console.log(el,'init');
        this.infoEl = el
        this.bMap = BMap
        this.infoMap = map
      },
      draw () {
        // console.log({el, BMap, map, overlay},'{el, BMap, map, overlay}');
        var lng = this.infoWindowOpts.infoPosition ? this.infoWindowOpts.infoPosition.lng : 0
        var lat = this.infoWindowOpts.infoPosition ? this.infoWindowOpts.infoPosition.lat : 0
        // console.log(this.infoEl.offsetHeight,'ste');
        console.log(this.infoMap,'ste');
        // var domHeight = this.infoEl.offsetHeight ? this.infoEl.offsetHeight : 140
        var offsetY = this.infoWindowOpts.type === 'cluster' ? -160 : -130
        var offsetX = this.infoWindowOpts.type === 'cluster' ? 20 : 10
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
      }
  },
}
</script>
<style scoped  lang="less">
.tmx-bm-overlay{
  position: absolute;
  .tmx-bm-overlay-cluster{
    width:288px;
    background:rgba(255,255,255,1);
    box-shadow:0px 12px 48px 16px rgba(0,0,0,0.03),0px 9px 28px 0px rgba(0,0,0,0.05),0px 6px 16px -8px rgba(0,0,0,0.08);
    border-radius:4px;
    padding: 5px 12px;
    .title{
      height:24px;
      font-size:12px;
      font-family:SFProText-Regular,SFProText;
      font-weight:400;
      color:rgba(151,156,168,1);
      line-height:14px;
    }
    .number{
      height:30px;
      font-size:18px;
      font-family:SFProText-Semibold,SFProText;
      font-weight:600;
      color:rgba(70,76,91,1);
      line-height:21px;
    }
    .list{
      .icon{
        display: inline-block;
        width:8px;
        height:8px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .status{
        height:14px;
        font-size:12px;
        font-family:SFProText-Medium,SFProText;
        font-weight:500;
        color:rgba(70,76,91,1);
        line-height:14px;
        padding-right: 8px;
      }
      .content{
        height:14px;
        font-size:12px;
        font-family:SFProText-Regular,SFProText;
        font-weight:400;
        color:rgba(151,156,168,1);
        line-height:14px;
      }
    }
    .localtion{
      height:20px;
      font-size:12px;
      font-family:SFProText-Regular,SFProText;
      font-weight:400;
      color:rgba(151,156,168,1);
      line-height:20px;
    }
  }
  .blue{
    background: #2D8CF0;
  }
  .green{
    background: #19BE6B;
  }
  .red{
    background: #ED4014;
  }
  .gray{
    background: #C5C8CE;
  }
}
</style>
