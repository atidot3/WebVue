<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/mooz.png" height="200" width="200">
    <Acces msg="Welcome to MooZ"/>
  </div>
</template>

<script>
import Acces from './components/Acces.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'app',
  components: {
    Acces
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
