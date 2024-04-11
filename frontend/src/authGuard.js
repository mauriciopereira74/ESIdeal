export default function authGuard(to, from, next) {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  }