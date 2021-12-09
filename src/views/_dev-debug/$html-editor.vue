<template>
  <div class="html-editor">
    <x-code value="I am html"></x-code>
    <x-code value="I am disabled" disabled></x-code>
  </div>
</template>
<script>
export default {
  options: {title: 'HTML 编辑器'},
  data() {
    return {
      html: 'html editor'
    }
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped></style>
