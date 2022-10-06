import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import { useAuthStore } from "@/stores/auth"
import HomeView from "@/views/HomeView.vue"
import LoginView from "@/views/auth/LoginView.vue"
import SignupView from "@/views/auth/SignupView.vue"
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue"
import Ga2faView from "@/views/auth/Ga2faView.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
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
          // this generates a separate chunk (dashboard.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("@/views/Dashboard.vue")
        }
      ]
    },
    { path: '/login',           component: LoginView },
    { path: '/signup',          component: SignupView },
    { path: '/forgot-password', component: ForgotPasswordView },
    { path: '/2fa',             component: Ga2faView }
  ]
});
router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/signup', '/forgot-password'];
  const authRequired = !publicPages.includes(to.path);
  const auth: any = useAuthStore();
  console.log(auth)
  if (!localStorage.getItem('user'))
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
});
export default router