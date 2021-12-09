<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  --header-height: 50px;
  --tab-height: 41px;
  --top-fixed-height: calc(var(--header-height) + var(--tab-height) + 60px);
  --aside-width: 201px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
