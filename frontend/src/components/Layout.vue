<template>
    <v-app>
      <!-- Barra de aplicativo -->
      <v-app-bar app fixed :elevation="isCollapsed ? 0 : 2" color="#22638A" dark :class="{'collapsed-app-bar': isCollapsed}">
        <div v-if="!isCollapsed" class="back-button-container">
          <v-list-item class="back-button" @click="goBack">
            <v-list-item-icon>
              <img src="@/assets/icons/back.png" alt="Back">
            </v-list-item-icon>
          </v-list-item>
        </div>

        <div class="logo-container" :class="{ 'collapsed': isCollapsed }" @click="toggleCollapsed">
          <div v-if="!isCollapsed">
            <img src="../assets/logo2.png" alt="E.S.Ideal Logo" />
          </div>
          <div v-else>
            <img src="../assets/logo.png" alt="E.S.Ideal Logo" />
          </div>
        </div>

        <v-spacer></v-spacer>

        <v-toolbar-title class="toolbar-title">
          {{ currentTime }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="logout">
          <button @click="logout">LOGOUT</button>
        </div>
      </v-app-bar>

      <v-navigation-drawer v-model="isCollapsed" app absolute color="#22638A" :mini-variant.sync="isCollapsed" class="custom-drawer">
        <v-list>
          <v-list-item class="back-button" @click="goBack">
            <v-list-item-icon>
              <img src="@/assets/icons/back.png" alt="Back">
            </v-list-item-icon>
          </v-list-item>
          <v-list-item to="/welcome">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/casa.png">
              <v-list-item-title>Welcome</v-list-item-title>
            </div>
          </v-list-item>
        </v-list>
       </v-navigation-drawer>
  
      <v-main>
        <router-view></router-view>
      </v-main>

    </v-app>
  </template>
  
  <script>
  import { getUser } from '../models/user';
  
  export default {
    name: 'AppLayout',
    data() {
      return {
        isCollapsed: true,
        currentTime: this.getCurrentTime(),
        user: getUser()
      };
    },
    methods: {
      toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
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
      goBack() {
        if (this.$route.path !== '/welcome') this.$router.go(-1);
      }
    },
    mounted() {
      this.timer = setInterval(this.updateTime, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  };
  </script>
  
  <style scoped>
.collapsed-app-bar {
  width: calc(100% - 56px);
}

.logo-container {
  display: flex;
  align-items: center;
  height: 64px;
}

.logo-container.collapsed img {
  max-height: 100%;
  max-width: 100%;
  padding-left: 30px;
}

.logo-container img {
  padding-top: 5px;
  height: 67px;
}

.back-button-container {
  display: flex;
  align-items: center;
}

.back-button {
  margin-right: 10px; /* Space between back button and logo */
}

.collapsed-app-bar {
  width: calc(100% - 56px);
}

.logout {
  margin-right: 20px;
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

.fixed-time {
  position: fixed;
  top: 0;
  right: 0;
  padding: 0.5rem;
  color: white;
  font-weight: bold;
  background-color: #22638A;
}

.toolbar-title {
  font-size: 2em;
  flex: 1;
  text-align: center;
}

.list-item-content {
  display: flex;
  align-items: center;
}

.home-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.custom-drawer {
  width: 56px;
}

.custom-drawer .v-list-item {
  padding: 12px 0;
}

.custom-drawer .v-list-item__content {
  padding-left: 20px;
}

.custom-drawer .v-list-item__title {
  margin-left: -20px;
}

.back-button {
  width: 100%;
  height: 48px; /* Adjust height as needed */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #22638A; /* Match the sidebar color */
  cursor: pointer;
  border: none;
  outline: none;
}

.back-button:hover {
  background-color: #1e5065; /* Slightly darker on hover for better interaction */
}

.back-button img {
  width: 24px; /* Icon size */
  height: 24px;
}

/* Optionally, style the v-list-item-icon if needed */
.v-list-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

  