<template>
    <div class="navbar">
      <router-link to="/" class="nav-item" exact>Home</router-link>
      <router-link to="/services" class="nav-item">Services</router-link>
      <router-link to="/clients" class="nav-item">Clients</router-link>
      <span class="time">{{ currentTime }}</span>
      <a href="#" class="logout" @click="logout">LOGOUT</a>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        
        currentTime: new Date().toLocaleTimeString()
      };
    },
    methods: {
        logout() {
            localStorage.removeItem('isLoggedIn');
            this.$router.push('/login');
            }
    },
    mounted() {
      setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 1000);
    }
  };
  </script>
  
  <style scoped>
    .navbar {
      overflow: hidden;
      background-color: #333;
    }
  
    .nav-item {
      float: left;
      display: block;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
    }
  
    .nav-item.router-link-exact-active {
      background-color: #4CAF50;
    }
  
    .logout {
      float: right;
      color: #f2f2f2;
      padding: 14px 16px;
      text-decoration: none;
      cursor: pointer;
    }
  
    .time {
      float: right;
      padding: 14px 16px;
      color: #f2f2f2;
    }
  </style>
  