<template>
<span>
  <slot></slot>
</span>
</template>

<script>
import MarkerClusterer from './markerclusterer'
import {createSize} from 'vue-baidu-map/components/base/factory.js'
import commonMixin from 'vue-baidu-map/components/base/mixins/common.js'

export default {
  name: 'bml-marker-clusterer',
  mixins: [commonMixin('markerClusterer')],
  props: {
    gridSize: {
      type: Object
    },
    maxZoom: {
      type: Number
    },
    minClusterSize: {
      type: Number
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
    // console.log(MarkerClusterer,'MarkerClusterer ---> user plugin');
    const _vmthis = this
    MarkerClusterer.prototype._redraw = function () {
      this._clearLastClusters();
      this._createClusters();
      var map = this._map;
      for (let index = 0,cluster; cluster = this._clusters[index]; index++) {
        // console.log(cluster._clusterMarker,'cluster._clusterMarker');
        cluster._clusterMarker.oncontextmenu= function(){
          _vmthis.$emit('contextmenu',cluster._center)
        }
        cluster._clusterMarker.onmouseover= function(){
          _vmthis.$emit('mouseover',cluster._center)
        }
        cluster._clusterMarker.onmouseout= function(){
          _vmthis.$emit('mouseout')
        }
      }
    };
  },
  methods: {
    load () {
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
      this.$nextTick(() => {
        const markers = this.$children.map(inst => inst.originInstance).filter(marker => marker instanceof BMap.Marker)
        this.originInstance.addMarkers(markers)
      })
    }
  },
  beforeCreate () {
    this.preventChildrenRender = true
  }
}
</script>
<style lang="less">
.cluster_class{
  height: 20px ;
  line-height: 20px ;
  color: #fff ;
  font-size: 20px ;
  font-family: SFProText-Medium,SFProText ;
  font-weight:500 ;
  background: #FAAD14 ;
  border-radius:40px ;
  border:2px solid #FFFFFF ;
  padding: 6px 13px;
  transform: translate(-50%,-50%);
}
</style>