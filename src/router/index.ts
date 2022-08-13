import { h, resolveComponent } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"

import DefaultLayout from "@/layouts/DefaultLayout.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: DefaultLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue"),
      },
      {
        path: "/base",
        name: "Base",
        component: {
          render() {
            return h(resolveComponent("router-view"))
          },
        },
        redirect: "/base/breadcrumbs",
        children: [],
      }
    ],
  },
  {
    path: "/pages",
    redirect: "/pages/404",
    name: "Pages",
    component: {
      render() {
        return h(resolveComponent("router-view"))
      },
    },
    children: [
      {
        path: "404",
        name: "Page404",
        component: () => import("@/views/pages/Page404"),
      },
      {
        path: "500",
        name: "Page500",
        component: () => import("@/views/pages/Page500"),
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/pages/Login"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/pages/Register"),
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
  // [
  //   {
  //     path: "/",
  //     name: "home",
  //     component: HomeView
  //   },
  //   {
  //     path: "/about",
  //     name: "about",
  //     // route level code-splitting
  //     // this generates a separate chunk (About.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import("@/views/AboutView.vue")
  //   }
  // ]
})

export default router
