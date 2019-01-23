<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700&subset=cyrillic');

.application {
  font-family: 'Open Sans', sans-serif;
}

html {
  overflow-y: hidden; // temp
}

.v-btn {
  text-transform: initial;
}
</style>
