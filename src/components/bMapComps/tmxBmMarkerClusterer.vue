<template>
  <span>
    <slot></slot>
  </span>
</template>

<script>
/* eslint-disable */
import MarkerClusterer from './bMapLibs/markerclusterer'
import {createSize} from 'vue-baidu-map/components/base/factory.js'
import commonMixin from './base/mixins/common.js'
import '@/assets/less/map.less'

export default {
  name: 'BmlMarkerClusterer',
  mixins: [commonMixin('markerClusterer')],
  data(){
    return{
      num:0,
    }
  },
  props: {
    gridSize: {
      type: Object
    },
    maxZoom: {
      type: Number,
    },
    minClusterSize: {
      type: Number,
    },
    styles: {
      type: Array,
      default () {
        return []
      }
    },
    averageCenter: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    gridSize: {
      handler (val) {
        const {BMap, originInstance} = this
        originInstance.setGridSize(BMap, val.map)
      },
      deep: true
    },
    maxZoom (val) {
      const {originInstance} = this
      originInstance.setMaxZoom(val)
    },
    minClusterSize: {
      handler (val) {
        const {BMap, originInstance} = this
        originInstance.setMinClusterSize(createSize(BMap, val))
      },
      deep: true
    },
    styles: {
      handler (val) {
        const {BMap, originInstance} = this
        const obj = JSON.parse(JSON.stringify(val)).map(item => {
          item.size = item.size && createSize(BMap, item.size)
          return item
        })
        originInstance.setStyles(obj)
      },
      deep: true
    },
    averageCenter (val) {
      this.reload()
    }
  },
  created()  {
    const _vmthis = this
    // MarkerClusterer.prototype._redraw = function () {
    //   this._clearLastClusters()
    //   this._createClusters()
    //   this.setVm(_vmthis)
    // };
  },
  beforeCreate () {
    this.preventChildrenRender = true
  },
  methods: {
    load () {
      console.log(this.num,'num');
      if(this.num <1){
        this.num++
        const {BMap, map, gridSize, minClusterSize, maxZoom, styles, averageCenter} = this
        this.originInstance = new MarkerClusterer(map, {
          gridSize: gridSize && createSize(BMap, gridSize),
          maxZoom,
          minClusterSize: minClusterSize && createSize(BMap, minClusterSize),
          styles: styles.map(item => {
            item.size = createSize(BMap, item.size)
            return item
          }),
          isAverageCenter: averageCenter
        })
        // console.log(this.originInstance);
        this.originInstance.setVm(this)
        this.$nextTick(() => {
          const markers = this.$children.map(inst => inst.originInstance).filter(marker => marker instanceof BMap.Marker)
          // const markers = this.$children.map(inst => inst.originInstance).filter(marker => marker instanceof BMap.divMarker)
          this.originInstance.addMarkers(markers)
        })
      }
    }
  }
}
</script>