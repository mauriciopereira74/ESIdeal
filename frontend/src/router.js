import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './pages/LoginView.vue';
import Welcome from './pages/Welcome.vue';
import authGuard from './authGuard';

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
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;