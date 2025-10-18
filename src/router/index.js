import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const SignupView = () => import('@/views/SignupView.vue')
const KYCView = () => import('@/views/KYCView.vue')
const NotificationsView = () => import('@/views/NotificationsView.vue')
const KYCAdmin = () => import('@/views/KYCAdminView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requireAuth: false,
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requireAuth: false,
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/kyc-admin',
    name: 'KYCAdmin',
    component: KYCAdmin,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/kyc',
    name: 'KYC',
    component: KYCView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requireAuth: false,
      redirect: '/',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationsView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
    meta: {
      requireAuth: false,
      redirect: '/',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requireAuth && !userStore.isLoggedIn) {
    return next({ path: to.meta.redirect }) // Redirect to login if not authenticated
  }

  if (to.meta.requiresVerification) {
    if (!userStore.user.emailVerified || !userStore.user.paxumVerified) {
      const useSnackbarStore = await import('@/stores/snackbar.js')
      const snackStore = useSnackbarStore.useSnackbarStore()
      snackStore.DISPLAY_SNACK({
        text: 'NO CHILDREN ALLOWED!! Please, you must validate your paxum, and pass the kyc to continue.',
        type: 'warning',
      })
      return next({ path: '/profile' })
    }
  }

  if (to.meta.external) {
    if (to.meta.newWindow) {
      window.open(to.fullPath)
    } else {
      window.location.replace(to.fullPath)
    }
    return next(false)
  }

  if (to.name === 'Login' || to.name === 'Signup') {
    userStore.isLoggedIn ? next(to.meta.redirect) : next() // login route is always  okay (we could use the requires auth flag below). prevent a redirect
  } else if (to.meta && to.meta.requiresAuth === false) {
    next() // requires auth is explicitly set to false
  } else if (userStore.isLoggedIn) {
    next() // i'm logged in. carry on
  } else {
    next(to.meta.redirect)
  }
})

export default router
