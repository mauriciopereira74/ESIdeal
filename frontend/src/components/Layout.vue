<template>
    <v-app>
      <v-app-bar app fixed :elevation="isCollapsed ? 0 : 2" color="#22638A" dark :class="{'collapsed-app-bar': isCollapsed}">
        <div v-if="!isCollapsed" class="back-button-container">
          <v-list-item class="back-button" @click="goBack">
            <img src="@/assets/icons/back.png" alt="Back">
          </v-list-item>
        </div>

        <div class="logo-container" :class="{ 'collapsed': isCollapsed }">
          <div v-if="!isCollapsed">
            <img src="../assets/logo2.png" alt="E.S.Ideal Logo" />
          </div>
          <div v-else>
            <img src="../assets/logo.png" alt="E.S.Ideal Logo" />
          </div>
        </div>

        <v-app-bar-nav-icon class="toggleCollapse" @click="toggleCollapsed">
            <div v-if="isCollapsed" class="collapsed">
              <img src="@/assets/icons/fold.png" alt="Fold">
            </div>
            <div v-if="!isCollapsed" class="noncollapsed">
              <img src="@/assets/icons/unfold.png" alt="Fold">
            </div>
        </v-app-bar-nav-icon>

        <v-spacer></v-spacer>

        <v-toolbar-title class="toolbar-title">
          {{ currentTime }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-avatar size="36">
          <img :src="user?.photo" alt="Mechanic Photo" style="height: 36px; width: 36px;">
        </v-avatar>

        <v-menu offset-y right>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <img src="../assets/icons/arrow.png" alt="Chevron Down" style="height: 30px; width: 30px;">
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="goToProfile">
              <img src="../assets/icons/profile.png" alt="Logout" style="height: 24px; width: 24px;">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
                <img src="../assets/icons/logout.png" alt="Logout" style="height: 24px; width: 24px;">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer 
          v-model="isCollapsed"
          app
          absolute
          color="#22638A"
          expand-on-hover
          :mini-variant="isCollapsed"
          class="custom-drawer"
      >
        <v-list dense>
          <v-list-item class="back-button" @click="goBack">
            <img src="@/assets/icons/back.png" alt="Back">
          </v-list-item>
          <v-list-item to="/welcome">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/casa.png">
              <v-list-item-title>Welcome</v-list-item-title>
            </div>
          </v-list-item>
          <v-list-item to="/waiting">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/clock.png">
              <v-list-item-title>Waiting Tasks</v-list-item-title>
            </div>
          </v-list-item>
          <v-list-item to="/scheduled" class="logout-button">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/calendar.png">
              <v-list-item-title>Scheduled Tasks</v-list-item-title>
            </div>
          </v-list-item>
          <v-list-item to="/stopped">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/stop.png">
              <v-list-item-title>Stopped Tasks</v-list-item-title>
            </div>
          </v-list-item>
          <v-list-item to="/completed">
            <div class="list-item-content">
              <img class="home-icon" src="@/assets/icons/done.png">
              <v-list-item-title>Completed Tasks</v-list-item-title>
            </div>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout">
              <img src="../assets/icons/logout.png" alt="Logout" style="height: 24px; width: 24px; margin-right: 8px;">
              Logout
            </v-btn>
          </div>
        </template>
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
        user: {},
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
      },
      goToProfile(){
        this.$router.push('/profile');
      }
    },
    mounted() {
      this.timer = setInterval(this.updateTime, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    async created() {
      this.user = await getUser();
      const employeeNumber = this.user.mechanic?.employeeNumber;
      const photoPath = `src/assets/userphotos/${employeeNumber}.png`;
      this.user.photo = photoPath;
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
  margin-right: 10px;
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
  height: 48px; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #22638A; 
  cursor: pointer;
  border: none;
  outline: none;
}

.back-button:hover {
  background-color: #1e5065; 
}

.back-button img {
  width: 24px;
  height: 24px;
}

.toggleCollapse div img {
  width: 30px;
  height: 30px;
}

.toggleCollapse div.noncollapsed {
  margin-left: 20px;
}

.logout-button {
  margin-top: auto;
}


</style>

  