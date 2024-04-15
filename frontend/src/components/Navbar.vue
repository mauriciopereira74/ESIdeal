<template>
  <nav v-if="!isLoginPage" class="navbar">
    <div class="logo">
      <img src='../assets/logo.png' alt="E.S.Ideal Logo" />
    </div>
    <div class="clock">
      {{ currentTime }}
    </div>
    <div class="logout">
      <button @click="logout">LOGOUT</button>
    </div>
  </nav>
</template>

<script>

import { getUser } from '../models/user';

export default {
  name: 'Navbar',
  data() {
    return {
      currentTime: this.getCurrentTime(),
      isLoginPage: false,
      user: getUser()
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn');
      this.user.logout();
      this.$router.push('/login');
    },
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    updateTime() {
      this.currentTime = this.getCurrentTime();
    },
    checkIsLoginPage() {
      this.isLoginPage = this.$route.path === '/login';
    }
  },
  mounted() {
    this.timer = setInterval(this.updateTime, 1000);
    this.checkIsLoginPage();
  },
  watch: {
    '$route'(to, from) {
      this.checkIsLoginPage();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #22638A;
  padding: 0.5rem;
  color: white;
}

.logo img {
  height: 70px;
}

.clock {
  font-size: 2rem;
}

.logout button {
  background-color: #d9534f;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
}

.logout button:hover {
  background-color: #c9302c;
}
</style>
