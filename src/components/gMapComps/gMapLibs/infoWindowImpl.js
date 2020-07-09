import mapElementFactory from './mapElementFactory.js'

const props = {
  options: {
    type: Object,
    required: false,
    default () {
      return {}
    }
  },
  position: {
    type: Object,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  }
}

const events = [
  'domready',
  'closeclick',
  'content_changed',
  'mouseover',
  'mouseout'
]

export default mapElementFactory({
  mappedProps: props,
  events,
  name: 'infoWindow',
  ctr: () => google.maps.InfoWindow,
  props: {
    opened: {
      type: Boolean,
      default: true,
    },
  },
  render(h) {
    return h('div',this.$slots.default)
  },
  inject: {
    '$markerPromise': {
      default: null,
    }
  },

  mounted () {
    const el = this.$refs.flyaway ? this.$refs.flyaway : this.$parent.$refs.flyaway
    el.parentNode.removeChild(el)
  },

  beforeCreate (options) {
    options.content = this.$refs.flyaway ? this.$refs.flyaway : this.$parent.$refs.flyaway

    if (this.$markerPromise) {
      delete options.position
      return this.$markerPromise.then(mo => {
        this.$markerObject = mo
        return mo
      })
    }
  },

  methods: {
    _openInfoWindow () {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindowObject.open(this.$map, this.$markerObject)
        } else {
          this.$infoWindowObject.open(this.$map)
        }
      } else {
        this.$infoWindowObject.close()
      }
    },
  },

  afterCreate (inst) {
    let vmthis = this
    this._openInfoWindow()
    this.$watch('opened', () => {
      this._openInfoWindow()
    })
    google.maps.event.addDomListener(inst.content,'mouseover',function(e) {
      vmthis.$emit('mouseover',e)
    });
    google.maps.event.addDomListener(inst.content,'mouseout',function(e) {
      vmthis.$emit('mouseout',e)
    });
  }
})
