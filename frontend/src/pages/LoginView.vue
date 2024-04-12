<template>
  <div class="split-view">
    <div class="welcome-side">
      <h1 class="welcome-title">Welcome</h1>
      <img src="@/assets/logo.png" alt="E.S.Ideal Logo" class="logo">
      <p class="trust-text">®ESIdeal Company, All Rights Reserved</p>
    </div>
    <div class="login-side">
      <div class="login-card">
        <h2 class="login-card-title"><span class="bold-text">Login</span> to your account</h2>
        <form @submit.prevent="submitLogin">
          <div class="form-group">
            <input type="text" placeholder="Employee Number" v-model="loginForm.employeeNumber" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" v-model="loginForm.password" required>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="error-popup" v-if="loginError">
        <p>Username or password is incorrect</p>
      </div>
    </div>
  </div>
</template>

<script>

import { setUser } from '../models/user';

export default {
  
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        employeeNumber: '',
        password: ''
      },
      loginError: false 
    }
  },
  methods: {
    async submitLogin() {
      try {
        const response = await fetch('http://localhost:3000/mechanics');
        if (!response.ok) {
          throw new Error('Falha ao recuperar dados');
        }
        const mechanics = await response.json();
        const mechanic = mechanics.find(mech =>
          mech.employeeNumber === this.loginForm.employeeNumber &&
          mech.password === this.loginForm.password
        );

        if (mechanic) {
          const mechanicDetails = {
            id: mechanic.id,
            nome: mechanic.nome,
            especialidade: mechanic.especialidade,
            employeeNumber: mechanic.employeeNumber
          };
          setUser(mechanicDetails);
          localStorage.setItem('isLoggedIn', 'true');
          this.$router.push({ path: '/welcome' });
        } else {
          localStorage.removeItem('isLoggedIn');  
          this.loginError = true; 
          
          setTimeout(() => {
            this.loginError = false;
          }, 3000);
        }
      } catch (error) {
        console.error('Erro de autenticação', error);
        localStorage.removeItem('isLoggedIn');  
        this.loginError = true; 
        
        setTimeout(() => {
          this.loginError = false;
        }, 3000);
      }
    }
  }
}
</script>


<style scoped>
.split-view {
  display: flex;
  width: 100%;
  height: 100vh;
}

.welcome-side, .login-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-side {
  background-image: url('@/assets/loginl.png');
  background-size: cover;
  background-position: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.login-side {
  backdrop-filter: blur(5px);
  background-image: url('@/assets/loginr.png');
  background-size: cover;
  background-position: center;
  color: white;
}

.logo {
  width: 700px;
  margin-bottom: 20px;
  border-radius: 100px;
  margin-top: auto;
  margin-bottom: auto;
}

.welcome-title {
  font-size: 50px;
  font-weight: 300;
  margin-top: 50px;
}

.trust-text {
  margin-top: auto;
}

.login-card {
  background-color: #100e1c;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 450px;
  text-align: center;
  padding-bottom: 70px;
}

.login-card-title {
  color: white;
  font-weight: 300;
  font-size: 28px;
}

.bold-text {
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

input, button {
  width: calc(100% - 20px);
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}


.error-popup {
  position: fixed;
  top: 20px; 
  right: 20px; 
  background-color: rgba(255, 0, 0, 0.7); 
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: opacity 0.5s ease-in-out; 
  opacity: 1; 
}

.error-popup p {
  margin: 0;
}


.error-popup.hidden {
  opacity: 0;
}
</style>