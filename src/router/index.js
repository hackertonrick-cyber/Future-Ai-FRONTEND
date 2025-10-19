import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

// Lazy imports for performance
const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const SignupView = () => import('@/views/SignupView.vue')
const NotificationsView = () => import('@/views/NotificationsView.vue')
import PatientsView from '../views/PatientsView.vue'
import AppointmentView from '../views/AppointmentView.vue'
import AccessRequestView from '../views/AccessRequestView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import PatientsProfileView from '../views/PatientsProfileView.vue'
import WhoCanViewMyDataView from '../views/WhoCanViewMyDataView.vue'
import TheCompanyRegistrationView from '../components/TheCompanyRegistrationView.vue'
import OrgUserRegistrationView from '../components/User/OrgUserRegistrationView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { requireAuth: false } },
  { path: '/about', name: 'About', component: AboutView, meta: { requireAuth: false } },
  { path: '/login', name: 'Login', component: LoginView, meta: { requireAuth: false, redirect: '/' } },
  { path: '/signup', name: 'Signup', component: SignupView, meta: { requireAuth: false, redirect: '/' } },
  { path: '/notifications', name: 'Notifications', component: NotificationsView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/patients', name: 'Patients', component: PatientsView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/appointment', name: 'Appointment', component: AppointmentView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/accessRequest', name: 'AccessRequest', component: AccessRequestView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/userProfile', name: 'UserProfile', component: UserProfileView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/patientProfile', name: 'PatientProfile', component: PatientsProfileView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/wc-vd', name: 'WC-VD', component: WhoCanViewMyDataView, meta: { requireAuth: true, redirect: '/login' } },
  { path: '/org/registration', name: 'TheCompanyRegistration', component: TheCompanyRegistrationView, meta: { requireAuth: false } },
  { path: '/org/new-user', name: 'OrgUserRegistration', component: OrgUserRegistrationView, meta: { requireAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// ✅ Unified Navigation Guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  const redirectTarget = to.meta.redirect || '/login'

  // Handle external links
  if (to.meta.external) {
    if (to.meta.newWindow) window.open(to.fullPath)
    else window.location.replace(to.fullPath)
    return
  }

  // Handle auth-required routes
  if (to.meta.requireAuth && !isLoggedIn) {
    return next({ path: redirectTarget })
  }

  // Prevent logged-in users from visiting login/signup again
  if (isLoggedIn && ['Login', 'Signup'].includes(to.name)) {
    return next({ path: redirectTarget })
  }

  next()
})

export default router
