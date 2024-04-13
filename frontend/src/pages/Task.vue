<template>
  <div class="task-page">
    <div class="service-name">
      <h1>{{ serviceName }}</h1>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Search tasks" @input="filterTasks" />
      <i class="fas fa-search"></i> 
    </div>
    <div class="tasks-table">
      <v-table>
        <thead style="background-color: #22638A; color: white; text-align: center;">
          <tr>
            <th @click="sortTasks('id')">Time <span>⇅</span></th>
            <th @click="sortTasks('service.descr')">Task <span>⇅</span></th>
            <th @click="sortTasks('descrição')">Duration <span>⇅</span></th>
            <th @click="sortTasks('deadline')">Observation <span>⇅</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredAndSortedTasks" :key="task.id" @click="goToTaskPage(task.id)">
            <td>{{ task.time }}</td>
            <td>{{ task.descr }}</td>
            <td>{{ task.duração }}</td>
            <td>{{ task.observation }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import { getUser } from '../models/user';

export default {
  data() {
    return {
      serviceName: '', // Para armazenar o nome do serviço
      searchTerm: '',
      tasks: [],
      sortColumn: '',
      sortOrder: 'ascending',
    };
  },
  computed: {
    filteredAndSortedTasks() {
      return this.tasks
        .filter(task => {
          const searchLower = this.searchTerm.toLowerCase();
          return (
            task.descr.toLowerCase().includes(searchLower) ||
            task.observation.toLowerCase().includes(searchLower) || 
            task.time.toLowerCase().includes(searchLower) ||
            task.duração.toLowerCase().includes(searchLower)
          );
        })
        .sort((a, b) => {
          let mod = this.sortOrder === 'ascending' ? 1 : -1;
          return a[this.sortColumn] < b[this.sortColumn] ? -1 * mod : 1 * mod;
        });
    },
  },
  methods: {
    async fetchServiceName(serviceDefinitionId) {
      try {
        const response = await fetch(`http://localhost:3000/service-definitions?id=${serviceDefinitionId}`);
        const serviceDefinition = await response.json();
        if (serviceDefinition.length > 0) {
          this.serviceName = serviceDefinition[0].descr;
        }
      } catch (error) {
        console.error('Error fetching service name:', error);
      }
    },
    async fetchTaskDetailsByServiceId(serviceId) {
      try {
        const response = await fetch(`http://localhost:3000/service-description?serviceId=${serviceId}`);
        const taskDetails = await response.json();
        return taskDetails;
      } catch (error) {
        console.error('Error fetching task details:', error);
        return [];
      }
    },
    async fetchTasksByServiceId(serviceId) {
      try {
        const taskDetails = await this.fetchTaskDetailsByServiceId(serviceId);
        this.tasks = taskDetails.map(task => ({
          time: task.date,
          descr: task.descr,
          observation: task.observation,
          duração: `${task.duração} minutes`
        }));
        console.log(this.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    sortTasks(column) {
      this.sortOrder = (this.sortColumn === column && this.sortOrder === 'ascending') ? 'descending' : 'ascending';
      this.sortColumn = column;
    },
  },
  async created() {
    try {
      const user = await getUser();
      if (user.isLoggedIn) {
        const serviceId = this.$route.params.id;
        await this.fetchTasksByServiceId(serviceId);
        if (this.tasks.length > 0) {
          const serviceDefinitionId = this.tasks[0].serviceDefinitionId;
          await this.fetchServiceName(serviceDefinitionId);
        }
      } else {
        this.$router.push('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
};
</script>


<style scoped>

.task-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  max-width: 900px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: #fff;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.vehicle-details, .task-details {
  background: #F6F7F9;
  padding: 15px;
  border-radius: 8px;
}

.vehicle-details {
  display: flex;
  align-items: center;
}

.vehicle-details img {
  max-width: 100px;
  margin-right: 20px;
  border-radius: 4px;
}

.vehicle-details .vehicle-info {
  flex-grow: 1;
}

.task-details {
  margin-top: 20px;
}

.task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.task-row:last-child {
  border-bottom: none;
}

.task-row > div {
  flex: 1;
  padding: 0 10px;
}

.task-row .task-time {
  flex: 0 0 100px;
}

.task-row .task-name {
  flex: 2;
}

.task-row .task-duration {
  flex: 1;
  text-align: center;
}

.task-row .task-description {
  flex: 3;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}

button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  color: white; /* Aqui estava faltando um valor para a propriedade color */
  background-color: #4CAF50; /* Adiciona uma cor de fundo para o botão */
}

/* Outros estilos do botão que podem estar faltando */
.btn-done {
  background-color: #4CAF50; /* Green */
}

.btn-suspend {
  background-color: #f0ad4e; /* Orange */
}

.btn-recommend {
  background-color: #5bc0de; /* Light Blue */
}

</style>