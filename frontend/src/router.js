import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './pages/LoginView.vue';
import Welcome from './pages/Welcome.vue';
import authGuard from './authGuard';
import Task from './pages/Task.vue';

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
      component: LoginView
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
    }
  ]
});

export default router;