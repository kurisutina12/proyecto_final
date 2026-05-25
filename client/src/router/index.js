import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProductsView from '../views/ProductsView.vue'
import CartView from '../views/CartView.vue'
import OrdersView from '../views/OrdersView.vue'
import AdminProductsView from '../views/AdminProductsView.vue'

Vue.use(VueRouter)

const routes = [

{
path:'/login',
component:LoginView
},

{
path:'/register',
component:RegisterView
},

{
path:'/products',
component:ProductsView
},

{
path:'/cart',
component:CartView
},

{
path:'/orders',
component:OrdersView
},

{
path:'*',
redirect:'/login'
},
{
path:'/admin/products',
component:AdminProductsView,
beforeEnter:(to,from,next)=>{
const role =
  localStorage.getItem('role_id')

if(role == 1){

  next()

}else{

  alert('Solo admin')

  next('/products')

}

}
},
,

]

const router = new VueRouter({

mode:'history',
routes

})

export default router
