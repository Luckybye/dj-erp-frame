<template>
  <dj-frame></dj-frame>
</template>

<script>
import DjFrame from '@/layout/Frame'
import init from './init'
export default {
  name: 'Main',
  mixins: [init],
  components: {
    DjFrame
  },
  watch: {
  },
  created () {
  }
}
</script>
