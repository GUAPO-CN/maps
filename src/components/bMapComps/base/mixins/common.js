const types = {
  control: {
    unload: 'removeControl'
  },
  layer: {
    unload: 'removeTileLayer'
  },
  overlay: {
    unload: 'removeOverlay'
  },
  contextMenu: {
    unload: 'removeContextMenu'
  }
}

const getParent = $component => ($component.abstract || $component.$el === $component.$children[0].$el) ? getParent($component.$parent) : $component

function destroyInstance () {
  const {unload, renderByParent, $parent} = this
  if (renderByParent) {
    $parent.reload()
  }
  unload()
}

class Mixin {
  constructor (prop) {
    this.methods = {
      ready (val) {
        const $parent = getParent(this.$parent)
        const BMap = this.BMap = $parent.BMap
        const map = this.map = $parent.map
        this.load()
        this.$emit('ready', {
          BMap,
          map,
          whoEmit:this.$vnode.tag
        })
      },
      transmitEvent (e) {
        this.$emit(e.type.replace(/^on/, ''), e)
      },
      reload () {
        // console.log('reload ',prop.type);
        this && this.BMap && this.$nextTick(() => {
          this.unload()
          this.$nextTick(this.load)
        })
      },
      unload () {
        const {map, originInstance} = this
        try {
          switch (prop.type) {
            case 'search':
              return originInstance.clearResults()
            case 'autoComplete':
            case 'lushu':
              return originInstance.dispose()
            case 'markerClusterer':
              return originInstance.clearMarkers()
            default:
              map[types[prop.type].unload](originInstance)
          }
        } catch (e) {}
      }
    }
    this.computed = {
      renderByParent () {
        return this.$parent.preventChildrenRender
      }
    }
    this.mounted = function () {
      const $parent = getParent(this.$parent)
      const map = $parent.map
      const {ready} = this
      if(map){
        ready()
      }else{
        // console.log(prop.type +' 给父级 '+$parent.$vnode.tag+' 添加ready事件 ');
        //此处是将当前（即子组件）的函数绑定提供给父组件使用了。通常我们使用$on $emit是将父组件的函数绑定提供给子组件使用的。但无论哪种情况，$emit所触发的都是当前组件_events中的事件，即（当前组件所拥有的事件）
        //$parent.$on是给父组件添加了个ready事件，当父组件emit ready时会触发它所拥有的ready事件
        $parent.$on('ready', ready)
      }
      // map ? ready() : $parent.$on('ready', ready)
    }
    this.destroyed = destroyInstance
    this.beforeDestroy = destroyInstance
  }
}

export default type => new Mixin({type})
