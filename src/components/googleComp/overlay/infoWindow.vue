/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div>
    <div ref="flyaway"  class="my-info"> <!-- so named because it will fly away to another component -->
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default (function (x) { return x.default || x })(require('./infoWindowImpl.js'))
</script>

<style lang="less">
.gm-style{
  // .gm-style-iw-c{
  //   // background: #000!important;  
  // }
  // .gm-style-iw-d{
  //   background: blue!important;  
  // }
  // .gm-style-iw-d::-webkit-scrollbar-track, .gm-style-iw-d::-webkit-scrollbar-track-piece {
  //   background: blue;
  // }
}
</style>
