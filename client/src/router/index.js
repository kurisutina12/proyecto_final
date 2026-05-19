// src/router.js (Vue CLI 1.x & 2.x) or src/router/index.js (Vue CLI 3.x or newer)

import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import About from "../views/AboutView.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/About",
      name: "login",
      component: About
    }
  ]
});