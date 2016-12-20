import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'
import VueResource from 'vue-resource'
Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
/*new Vue({
  el: 'body',
  components: { App }
})
*/
let app = Vue.extend(App)

var router = new VueRouter();
router.map({
    '/goods': {
        component: goods
    },
    '/ratings': {
        component: ratings
    },
    '/seller': {
        component: seller
    }
})
router.start(app, '#app')

//默认去哪页  这句话写了会有问题，要不切换路由的时候 better-scroll会有问题，应该注释了
//给用户的链接应该是默认带了哈希值的
router.go('/goods')