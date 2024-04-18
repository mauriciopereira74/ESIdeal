<template>
  <div class="welcome-page">
    <div class="employee-info">
      <div class="employee-photo-wrapper">
        <img :src="employee.photo" alt="Employee" class="employee-photo">
      </div>
      <div class="employee-details">
        <h1>{{ employee.nome }}</h1>
        <p>{{ employee.especialidade }}</p>
        <p style="color: black;">Employee number: {{ employee.employeeNumber }}</p>
      </div>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Search tasks" @input="filterTasks" />
      <img src="@/assets/icons/search.png" alt="Search" style="width: 35px;"> 
    </div>
    <div class="tasks-table">
      <v-table>
        <thead style="background-color: #22638A; color: white; text-align: center;">
          <tr>
            <th @click="sortTasks('id')">ID <span>⇅</span></th>
            <th @click="sortTasks('service.descr')">Task <span>⇅</span></th>
            <th @click="sortTasks('descrição')">Observation <span>⇅</span></th>
            <th @click="sortTasks('deadline')">Deadline <span>⇅</span></th>
            <th @click="sortTasks('duration')">Estimated Duration <span>⇅</span></th>
            <th @click="sortTasks('status')" class="status-header">Status <span>⇅</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredAndSortedTasks" :key="task.id" @click="goToTaskPage(task.id)">
            <td>{{ task.id }}</td>
            <td>{{ task.service.descr }}</td>
            <td>{{ task.descrição }}</td>
            <td>{{ task.deadline }}</td>
            <td>{{ task.service.duração }}</td>
            <td :class="['status-cell', {
              'status-waiting': task.estado === 'nafila',
              'status-scheduled': task.estado === 'programado',
              'status-stopped': task.estado === 'parado',
              'status-done': task.estado === 'realizado'
            }]">
              <button :class="{
                'status-waiting': task.estado === 'nafila',
                'status-scheduled': task.estado === 'programado',
                'status-stopped': task.estado === 'parado',
                'status-done': task.estado === 'realizado'
              }" disabled>{{ formatStatus(task.estado) }}</button>
            </td>
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
      searchTerm: '',
      employee: {},
      tasks: [],
      serviceDefinitions: {}, 
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
            String(task.service.descr).toLowerCase().includes(searchLower) ||
            String(task.descrição).toLowerCase().includes(searchLower) || 
            String(task.deadline).toLowerCase().includes(searchLower) ||
            String(task.service.duração).toLowerCase().includes(searchLower) || // Usando task.service.duração
            String(this.formatStatus(task.estado)).toLowerCase().includes(searchLower)
          );
        })
        .sort((a, b) => {
          let mod = this.sortOrder === 'ascending' ? 1 : -1;
          return a[this.sortColumn] < b[this.sortColumn] ? -1 * mod : 1 * mod;
        });
    },
  },
  methods: {
    goToTaskPage(taskId) {
      this.$router.push(`/task/${taskId}`);
    },
    mapServiceDefinitions(definitions) {
      definitions.forEach(definition => {
        this.serviceDefinitions[definition.id] = definition;
      });
    },
    async fetchServiceDefinitions() {
      try {
        const response = await fetch('http://localhost:3000/service-definitions');
        const definitions = await response.json();
        this.mapServiceDefinitions(definitions);
      } catch (error) {
        console.error('Erro ao buscar definições de serviço:', error);
      }
    },
    async fetchTasksByEmployeeNumber(employeeNumber) {
      try {
        const response = await fetch(`http://localhost:3000/services?employeeNumber=${employeeNumber}`);
        const tasksFromResponse = await response.json();
        this.tasks = tasksFromResponse.map(task => ({
          ...task,
          deadline: this.formatDeadline(task.data),
          duration: task.duration ? `${task.duration} minutes` : '---',
          service: this.serviceDefinitions[task['service-definitionId']]
        }));
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    },
    formatDeadline(data) {
      if (!data) return '---';
      const date = new Date(data.ano, data.mes - 1, data.dia, data.hora, data.minutos);
      return date.toLocaleString();
    },
    formatStatus(estado) {
      const statusMapping = {
        nafila: 'WAITING',
        realizado: 'DONE',
        programado: 'SCHEDULED',
        parado: 'STOPPED',
      };
      return statusMapping[estado] || 'IN PROGRESS';
    },
    sortTasks(column) {
      this.sortOrder = (this.sortColumn === column && this.sortOrder === 'ascending') ? 'descending' : 'ascending';
      this.sortColumn = column;
    },
  },
  async created() {
    try {
      await this.fetchServiceDefinitions();
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
        await this.fetchTasksByEmployeeNumber(employeeNumber);
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

.employee-info {
  display: flex;
  align-items: center;
  margin-right: 20px; 
  margin-top: 20px; 
}

.employee-photo-wrapper {
  border-radius: 50%;
  overflow: hidden;
  height: 250px;
  margin-right: 20px; 
  margin-left: 100px; 
  margin-top: 35px;
}

.employee-photo {
  width: 250px;
  height: 250px;
}

.employee-details {
  flex-grow: 1;
  color: #22638A;
  padding: 10px;
  margin-top: 70px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 5px;
  margin-right: 20px;
  margin-left: auto; 
  width: fit-content;
}

.tasks-header {
  display: flex;
  justify-content: flex-end; 
  margin-bottom: 10px;
}

.tasks-table th.status-header {
  text-align: center; 
}

.tasks-table .status-cell {
  text-align: center; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  padding: 8px;
  border-radius: 5px;
}

.tasks-table {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px; 
  text-align: center;
  overflow-x: auto;
}

.tasks-table table {
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}

.tasks-table th, .tasks-table td {
  border: none;
  padding: 8px;
  text-align: left;
}

.tasks-table th {
  background-color: #22638A;
  color: white;
}

.tasks-table .status-header, .tasks-table .status-cell {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tasks-table tr:hover {
  background-color: #e0f7fa;
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.tasks-table tr:active {
  background-color: #b2ebf2;
}

.tasks-table tr:focus {
  outline: none; 
  background-color: #b2ebf2; 
}

button {
  border: none;
  padding: 10px 20px;
  cursor: default;
  text-align: center;
  display: block;
  margin: 5px auto;
  width: 80%;
  border-radius: 20px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.2);
  transition: background-color 0.3s;
}

button.status-waiting {
  background-color: #90caf9;
}

button.status-waiting:hover {
  background-color: #64b5f6;
}

button.status-scheduled {
  background-color: #ffb74d;
}

button.status-scheduled:hover {
  background-color: #ffa726;
}

button.status-stopped {
  background-color: #ef5350;
}

button.status-stopped:hover {
  background-color: #e53935;
}

button.status-done {
  background-color: #c8e6c9;
}

button.status-done:hover {
  background-color: #a5d6a7;
}
</style>
