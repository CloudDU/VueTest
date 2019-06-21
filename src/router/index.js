import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: () => import('@/view/shop/index6')
      // component: HelloWorld
    }
    // ,
    // {
    //   path: '/shop',
    //   name: '店铺管理',
    //   redirect: '/shop/set',
    //   meta: {title: '店铺管理', icon: 'example'},
    //   component: () => import('@/view/shop/index')
    // }
  ]
})
