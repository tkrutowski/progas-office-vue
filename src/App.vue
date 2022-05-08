<template>
  <div id="app">
    <TheHeader/>
    <router-view/>
    <TheFooter/>
  </div>
</template>

<script>
import TheFooter from "./components/TheFooter.vue"
import TheHeader from "./components/TheHeader.vue"
export default {
  name: 'App',
  components: {
    TheFooter,
    TheHeader
}
}
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* background-color: rgb(29,29,29); */
  background-color: #252525;
  /* color: #2c3e50; */
  color: rgba(255, 245, 0, 0.8);
  /* margin-top: 60px; */
}

</style>
