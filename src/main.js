import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'

import Access from './components/Acces.vue'
import Forbidden from './components/Forbidden.vue'

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Vuelidate);

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
  {
    path: '/',
    beforeEnter: (to, from , next) =>
    {
      if (to.query.param)
      {
        Access._param = to.query.param
        next({
          path: '/access'
        })
      }
      else
      {
        next({path: '/forbidden'});
      }
    }
  },
  {
    path: '/access',
    component: Access,
    props: route => {
      return {
        param: Access._param
      }
    }
  },
  {
    path: '/forbidden',
    component: Forbidden
  },
  {
    path: '*',
    redirect: '/forbidden'
  }
]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//https://router.vuejs.org/guide/#html