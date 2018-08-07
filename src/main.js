import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue);
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

//https://router.vuejs.org/guide/#html