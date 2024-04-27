import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';
import Welcome from './pages/Welcome.vue';
import authGuard from './authGuard';
import Task from './pages/Task.vue';
import Vehicle from './pages/Vehicle.vue';
import WaitingTasks from './pages/WaitingTasks.vue';
import ScheduledTasks from './pages/ScheduledTasks.vue';
import StoppedTasks from './pages/StoppedTasks.vue';
import Profile from './pages/Profile.vue';
import CompletedTasks from './pages/CompletedTasks.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/task/:id',
      component: Task,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/vehicle/:id',
      component: Vehicle,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/waiting',
      component: WaitingTasks,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/scheduled',
      component: ScheduledTasks,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/stopped',
      component: StoppedTasks,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/profile',
      component: Profile,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    },
    {
      path: '/completed',
      component: CompletedTasks,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    }
  ]
});

export default router;