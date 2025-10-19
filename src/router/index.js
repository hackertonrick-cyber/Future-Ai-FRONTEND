import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import PatientsView from '../views/PatientsView.vue'
import AppointmentView from '../views/AppointmentView.vue'
import AccessRequestView from '../views/AccessRequestView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import PatientsProfileView from '../views/PatientsProfileView.vue'

const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const SignupView = () => import('@/views/SignupView.vue')
const NotificationsView = () => import('@/views/NotificationsView.vue')

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
    path: '/patients',
    name: 'Patients',
    component: PatientsView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: AppointmentView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/accessRequest',
    name: 'AccessRequest',
    component: AccessRequestView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
  {
    path: '/userProfile',
    name: 'UserProfile',
    component: UserProfileView,
    meta: {
      requireAuth: true,
      redirect: '/login',
      enterClass: 'animate__animated animate__fadeInUpBig',
      leaveClass: 'animate__animated animate__fadeOutDown',
    },
  },
   {
    path: '/patientProfile',
    name: 'PatientProfile',
    component: PatientsProfileView,
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
