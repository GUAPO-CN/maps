<template>
  <div class="hello">
    <bmap></bmap>
    <!-- <gmap></gmap> -->
  </div>
</template>

<script>
//google
import bmap from './bmap' 
import gmap from './gmap' 

export default {
  name: 'HelloWorld',
  components: {
    bmap,
    gmap
  },
}
</script>