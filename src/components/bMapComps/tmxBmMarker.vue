<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */
import commonMixin from './base/mixins/common.js'
import bindEvents from 'vue-baidu-map/components/base/bindEvent.js'
import {createLabel, createIcon, createPoint} from 'vue-baidu-map/components/base/factory.js'

export default {
  name: 'bm-marker',
  mixins: [commonMixin('overlay')],
  props: {
    position: {},
    offset: {},
    icon: {},
    massClear: {
      type: Boolean,
      default: true
    },
    dragging: {
      type: Boolean,
      default: false
    },
    clicking: {
      type: Boolean,
      default: true
    },
    raiseOnDrag: {
      type: Boolean,
      default: false
    },
    draggingCursor: {
      type: String
    },
    rotation: {
      type: Number
    },
    shadow: {
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: Object
    },
    animation: {
      type: String
    },
    top: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 0
    },
    mKey: {
      type: String
    },
    mStatus: {
      type: Number
    },
  },
  watch: {
    'position.lng' (val, oldVal) {
      const {BMap, originInstance, position, renderByParent, $parent} = this
      if (val !== oldVal && val >= -180 && val <= 180) {
        originInstance.setPosition(createPoint(BMap, {lng: val, lat: position.lat}))
      }
      renderByParent && $parent.reload()
    },
    'position.lat' (val, oldVal) {
      const {BMap, originInstance, position, renderByParent, $parent} = this
      if (val !== oldVal && val >= -74 && val <= 74) {
        originInstance.setPosition(createPoint(BMap, {lng: position.lng, lat: val}))
      }
      renderByParent && $parent.reload()
    },
    'offset.width' (val, oldVal) {
      const {BMap, originInstance} = this
      if (val !== oldVal) {
        originInstance.setOffset(new BMap.Size(val, this.offset.height))
      }
    },
    'offset.height' (val, oldVal) {
      const {BMap, originInstance} = this
      if (val !== oldVal) {
        originInstance.setOffset(new BMap.Size(this.offset.width, val))
      }
    },
    icon: {
      deep: true,
      handler (val) {
        const {BMap, originInstance, rotation} = this
        originInstance && originInstance.setIcon(createIcon(BMap, val))
        rotation && originInstance && originInstance.setRotation(rotation)
      }
    },
    massClear (val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    dragging (val) {
      val ? this.originInstance.enableDragging() : this.originInstance.disableDragging()
    },
    clicking () {
      this.reload()
    },
    raiseOnDrag () {
      this.reload()
    },
    draggingCursor (val) {
      this.originInstance.setDraggingCursor(val)
    },
    rotation (val) {
      this.originInstance.setRotation(val)
    },
    shadow (val) {
      this.originInstance.setShadow(val)
    },
    title (val) {
      this.originInstance.setTitle(val)
    },
    label (val) {
      this.reload()
    },
    animation (val) {
      this.originInstance.setAnimation(global[val])
    },
    top (val) {
      this.originInstance.setTop(val)
    },
    zIndex (val) {
      this.originInstance.setZIndex(val)
    },
    mKey (val) {
      this.originInstance.setMarkerKey(val)
    },
    mStatus (val) {
      this.originInstance.setMarkerStatus(val)
    },
  },
  mounted(){
    console.log('bindinParent');
    this.$emit('bindinParent','parms')
  },
  methods: {
    load () {
      console.log('load marker');
      const {BMap, map, position, offset, icon, massClear, dragging, clicking, raiseOnDrag, draggingCursor, rotation, shadow, title, label, animation, top, renderByParent, $parent, zIndex} = this
      //增加marker的key方法 start
      BMap.Marker.prototype.setMarkerKey = function(val){
        this.sn = val
      }
      BMap.Marker.prototype.getMarkerKey = function(){
        return this.sn
      }
      BMap.Marker.prototype.setMarkerStatus = function(val){
        this.mStatus = val
      }
      BMap.Marker.prototype.getMarkerStatus = function(){
        return this.mStatuss
      }
      //增加marker的key方法 end
      const overlay = new BMap.Marker(new BMap.Point(position.lng, position.lat), {
        offset,
        icon: icon && createIcon(BMap, icon),
        enableMassClear: massClear,
        enableDragging: dragging,
        enableClicking: clicking,
        raiseOnDrag,
        draggingCursor,
        rotation,
        shadow,
        title
      })
      //设置marker的key
      overlay.setMarkerKey(this.mKey)
      overlay.setMarkerStatus(this.mStatus)

      this.originInstance = overlay
      label && overlay && overlay.setLabel(createLabel(BMap, label))
      overlay.setTop(top)
      overlay.setZIndex(zIndex)
      bindEvents.call(this, overlay)
      if (renderByParent) {
        console.log('marker renderByParent reload');
        $parent.reload()
      } else {
        map.addOverlay(overlay)
      }
      overlay.setAnimation(global[animation])
    }
  }
}
</script>
