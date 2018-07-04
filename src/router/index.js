import Vue from 'vue'
import Router from 'vue-router'
import ls from 'local-storage'
import { STORAGE_AUTH_TOKEN } from 'src/constants'

Vue.use(Router)

const routes = [
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('src/views/Wallet'),
    beforeEnter: (to, from, next)=> {!!ls.get(STORAGE_AUTH_TOKEN) ? next() : next('/')}
  },
  {
    // path: '/sign-in',
    path: '/',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "sign-in" */ 'src/views/SignIn'),
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "sign-in" */ 'src/views/App/404'),
  },
]

const router = new Router({
  mode: 'history',
  routes: routes,
})

export default router
