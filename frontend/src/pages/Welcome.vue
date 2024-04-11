<template>
  <div class="welcome-page">
    <div class="employee-info">
      <img :src="employee.photo" alt="Employee" class="employee-photo">
      <h1>{{ employee.nome}}</h1>
      <p>{{ employee.especialidade }}</p>
      <p>Employee number: {{ employee.employeeNumber }}</p>
    </div>
  </div>
</template>

<script>
import { getUser } from '../models/user';

export default {
  data() {
    return {
      searchTerm: '',
      employee: {},
      tasks: []
    };
  },
  computed: {
    filteredTasks() {
      if (this.searchTerm) {
        return this.tasks.filter(task => task.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }
      return this.tasks;
    }
  },
  methods: {
    performSearch() {
      // Lógica para realizar a busca
      console.log('Pesquisar por:', this.searchTerm);
    }
  },
  async created() {
    try {
      const user = await getUser();
      console.log('Usuário:', user);
      if (user.isLoggedIn && user.mechanic) {
        this.employee = {
          photo: 'path-to-employee-photo.jpg',
          nome: user.mechanic.nome,
          especialidade: user.mechanic.especialidade,
          employeeNumber: user.mechanic.employeeNumber
        };
      } else {
        // Se o usuário não estiver logado ou se não houver detalhes do mecânico, redirecione para a página de login
        this.$router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }
};
</script>

<style scoped>
.employee-info {
  /* Styles for the employee info section */
}
.employee-photo {
  /* Styles for the employee photo */
}
.search-field input {
  /* Styles for the search input */
}
.tasks-table {
  /* Styles for the tasks table */
}
.status {
  /* Base styles for status */
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
}
.waiting {
  background-color: #f0ad4e; /* Bootstrap 'warning' color */
}
.done {
  background-color: #5cb85c; /* Bootstrap 'success' color */
}
</style>