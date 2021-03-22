import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import viewsFilter from '@/filters/views.filter'
import VueAxios from 'vue-axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(Element)

Vue.filter('view', viewsFilter)

firebase.initializeApp({
  apiKey: "AIzaSyANAmxIlxR2lhxgdm1usYL27EmAM12invI",
  authDomain: "ambient-scion-280014.firebaseapp.com",
  projectId: "ambient-scion-280014",
  storageBucket: "ambient-scion-280014.appspot.com",
  messagingSenderId: "845269535306",
  appId: "1:845269535306:web:a6cc9d1fa018d7deaf34b3",
  measurementId: "G-12N7J2L9M5"
})

let app;

firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

