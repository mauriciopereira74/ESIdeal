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
export default {
  name: 'Navbar',
  data() {
    return {
      currentTime: this.getCurrentTime(),
      isLoginPage: false
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn');
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
      // Verificar se a rota atual é a de login
      this.isLoginPage = this.$route.path === '/login';
    }
  },
  mounted() {
    // Atualizar a hora a cada segundo
    this.timer = setInterval(this.updateTime, 1000);
    // Verificar se é a página de login quando o componente é montado
    this.checkIsLoginPage();
  },
  watch: {
    '$route'(to, from) {
      // Verificar se é a página de login quando a rota é alterada
      this.checkIsLoginPage();
    }
  },
  beforeDestroy() {
    // Limpar o intervalo quando o componente for desmontado para evitar vazamentos de memória
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
  height: 70px; /* Ajuste o tamanho do logotipo conforme necessário */
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
