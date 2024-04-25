<template>
    <div class="profile-page">
        <div class="profile-card">
        <div class="profile-photo-wrapper">
            <img :src="employee.photo" alt="Employee" class="profile-photo">
        </div>
        <div class="profile-details">
            <h1>{{ employee.nome }}</h1>
            <p>{{ employee.especialidade }}</p>
            <p>Employee number: {{ employee.employeeNumber }}</p>
        </div>
        </div>
    </div>
</template>
  
<script>
import { getUser } from '../models/user';

export default {
data() {
    return {
    employee: {},
    };
},
async created() {
    try {
    const user = await getUser();
    if (user.isLoggedIn && user.mechanic) {
        const employeeNumber = user.mechanic.employeeNumber;
        const photoPath = `src/assets/userphotos/${employeeNumber}.png`;
        this.employee = {
        photo: photoPath,
        nome: user.mechanic.nome,
        especialidade: user.mechanic.especialidade,
        employeeNumber: user.mechanic.employeeNumber
        };
    } else {
        this.$router.push('/login');
    }
    } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    }
}
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.profile-card {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 350px;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  background-color: white;
}

.profile-photo-wrapper {
  height: 350px;
  width: 350px;
  overflow: hidden;
}

.profile-photo {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.profile-details {
  padding: 20px;
}

.profile-details h1 {
  margin-top: 0;
  color: #22638A;
}

.profile-details p {
  color: #555;
  font-size: 16px;
  margin: 5px 0;
}
</style>
