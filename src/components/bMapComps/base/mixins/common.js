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
      readyaa (val) {
        console.log('ready被触发 ',prop.type,val);
        const $parent = getParent(this.$parent)
        const BMap = this.BMap = $parent.BMap
        const map = this.map = $parent.map
        this.load()
        console.log(this ,'this '+prop.type);
        // this.$emit('ready', {
        //   BMap,
        //   map,
        //   whoEmit:this.$vnode.tag
        // })
      },
      transmitEvent (e) {
        this.$emit(e.type.replace(/^on/, ''), e)
      },
      reload () {
        console.log('reload ',prop.type);
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
      console.log('mounted ',prop.type);
      const $parent = getParent(this.$parent)
      const map = $parent.map
      const {readyaa} = this
      console.log(map,'map');
      if(map){
        console.log('self ready',prop.type);
        // ready()
      }else{
        console.log( $parent,' 给父级 '+$parent.$vnode.tag+' 添加ready事件 ');
        $parent.$on('readyaa', readyaa)
      }
      // map ? ready() : $parent.$on('ready', ready)
    }
    this.destroyed = destroyInstance
    this.beforeDestroy = destroyInstance
  }
}

export default type => new Mixin({type})
