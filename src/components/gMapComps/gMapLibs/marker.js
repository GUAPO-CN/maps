import mapElementFactory from './mapElementFactory.js'
const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true,
    // default:()=>{
    //   return {
    //     anchor:new google.maps.Point(0, 0),
    //     labelOrigin:new google.maps.Point(-8, -8),
    //     path: google.maps.SymbolPath.CIRCLE,
    //     scale: 6,
    //     fillColor: '#3BC881',
    //     fillOpacity: 1,
    //     strokeColor: '#FFFFFF',
    //     strokeWeight: 2
    //   }
    // }
  },
  position: {
    type: Object,
    twoWay: true,
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true,
  },
  mKey: {
    type: String
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
export default mapElementFactory({
  mappedProps: props,
  events,
  // name: 'LabelMarker',
  name: 'marker',
  ctr: () => {
    //增加marker的key方法 start
    // google.maps.Marker.prototype.setLabel = function(val){
    //   console.log(this);
    //   console.log(this.getPosition());
    //   console.log(val);
    // }
    // require('./labelMarker')
    google.maps.Marker.prototype.setMKey = function(val){
      this.sn = val
    }
    google.maps.Marker.prototype.getMKey = function(){
      return this.sn
    }
    return google.maps.Marker
    // return google.maps.LabelMarker
  },

  inject: {
    '$clusterPromise': {
      default: null,
    },
  },

  render (h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
        'div',
        this.$slots.default
      )
    }
  },

  destroyed () {
    if (!this.$markerObject) { return }
    // if (!this.$LabelMarkerObject) { return }
    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      // this.$clusterObject.removeMarker(this.$LabelMarkerObject, true)
      this.$clusterObject.removeMarker(this.$markerObject, true)
    } else {
      // this.$LabelMarkerObject.setMap(null)
      this.$markerObject.setMap(null)
    }
  },

  beforeCreate (options) {
    console.warn('beforeCreate marker');
    if (this.$clusterPromise) { //如果marker点被cluster包裹，清除options.map达到轻量化options对象
      options.map = null
    }
    
    return this.$clusterPromise
  },
  
  afterCreate (inst) {
    console.warn('afterCreate marker');
    let vmthis = this
    google.maps.event.addListener(inst,'click',function() {
      vmthis.$emit('click',inst)
    });
    google.maps.event.addListener(inst,'mouseover',function(e) {
      vmthis.$emit('mouseover',{e,inst})
    });
    google.maps.event.addListener(inst,'rightclick',function(e) {
      vmthis.$emit('contextmenu',e)
    });
    if (this.$clusterPromise) {
      this.$clusterPromise.then((co) => {
        // console.log(co,'co');
        co.addMarker(inst)
        this.$clusterObject = co
      })
    }
  },
  mounted() {
    console.warn('mounted marker')
  },
})