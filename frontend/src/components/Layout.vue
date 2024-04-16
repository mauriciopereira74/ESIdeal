<template>
    <v-app v-if="!isLoginPage">
      <!-- Barra de aplicativo -->
      <v-app-bar app fixed :elevation="isCollapsed ? 0 : 2" color="#22638A" dark :class="{'collapsed-app-bar': isCollapsed}">

        <div class="logo-container" :class="{ 'collapsed': isCollapsed }" @click="toggleCollapsed">
            <img v-if="!isCollapsed" src="../assets/logo2.png" alt="E.S.Ideal Logo" />
            <img v-else src="../assets/logo.png" alt="E.S.Ideal Logo" />
        </div>
  
        <v-toolbar-title class="toolbar-title">
          {{ currentTime }}
        </v-toolbar-title>
  
        <v-spacer></v-spacer> <!-- This component is used to push content to the right -->
  
        <div class="logout">
          <button @click="logout">LOGOUT</button>
        </div>
      </v-app-bar>
  
      <!-- Navegação lateral -->
      <v-navigation-drawer v-model="isCollapsed" app absolute color="#22638A">
        <!-- Conteúdo da navegação lateral -->
        <v-list>
          <v-list-item to="/welcome">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Welcome</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Adicione outros itens de navegação aqui -->
        </v-list>
      </v-navigation-drawer>
  
      <!-- Conteúdo principal -->
      <v-main>
        <router-view v-if="!isLoginPage"></router-view>
      </v-main>
  
      <!-- Hora fixa -->
      <div class="fixed-time">
        {{ currentTime }}
      </div>
    </v-app>
  </template>
  
  <script>
  import { getUser } from '../models/user';
  
  export default {
    name: 'AppLayout',
    data() {
      return {
        isCollapsed: false,
        currentTime: this.getCurrentTime(),
        isLoginPage: false,
        user: getUser(),
        collapseIcon: 'mdi-menu'
      };
    },
    methods: {
      toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
        // Alterne entre os ícones de "fold" e "unfold"
        this.collapseIcon = this.isCollapsed ? 'mdi-menu-down' : 'mdi-menu';
      },
      logout() {
        localStorage.removeItem('isLoggedIn');
        this.user.logout;
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
  };
  </script>
  
  <style scoped>
  /* Adicione estilos CSS aqui, se necessário */
  .collapsed-app-bar {
    width: calc(100% - 56px); /* Ajuste a largura conforme necessário */
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    height: 64px; /* Altura da barra de aplicativo */
  }
  
  .logo-container img {
    max-height: 100%; /* Ajusta a altura da imagem para a altura da barra de aplicativo */
    max-width: 100%;
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
  
  /* Hora fixa */
  .fixed-time {
    position: fixed;
    top: 0;
    right: 0;
    padding: 0.5rem;
    color: white;
    font-weight: bold;
    background-color: #22638A; /* Cor de fundo azul */
  }
  
  /* Centralizar o texto da toolbar title */
  .toolbar-title {
    flex: 1;
    text-align: center;
  }

  .logo-container img {
    padding-left: 30px; 
}

  </style>
  