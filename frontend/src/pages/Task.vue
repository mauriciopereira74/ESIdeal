<template>
  <div class="task-page">
    <button class="back-button" @click="goBack">
      <img class="back-icon" src="@/assets/icons/back.png">
    </button>
    <div class="format">
    <div class="service-type">
      <h1>{{ service.tipo }}</h1>
    </div>
    </div>
    <div class="container">
      <div class="service-name">
        <h1>{{ service.definition?.descr }}</h1>
      </div>
    </div>
    <button :class="statusClass">{{ formatStatus(service.estado) }}</button>
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
      service: {},
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
    statusClass() {
      return {
        'status-waiting': this.service.estado === 'nafila',
        'status-scheduled': this.service.estado === 'programado',
        'status-stopped': this.service.estado === 'parado',
        'status-done': this.service.estado === 'realizado'
      };
    },
  },
  methods: {
    async fetchVehicleTypes() {
        try {
          const response = await fetch('http://localhost:3000/vehicle-types');
          const vehicleTypes = await response.json();
          const serviceId = this.service.definition?.id;

          if (!serviceId) {
            console.error('Service definition ID not found.');
            return;
          }

          let serviceCategory = null;
          vehicleTypes.forEach(vehicleType => {
            if (vehicleType.serviços.includes(serviceId)) {
              this.service.tipo = vehicleType.id;
            }
          });

          if (!serviceCategory) {
            console.warn('Service category not found for service definition ID:', serviceId);
            serviceCategory = 'Desconhecido';
          }

          return serviceCategory;
        } catch (error) {
          console.error('Error fetching vehicle types:', error);
        }
    },
    async fetchService(serviceId) {
      try {
        const serviceResponse = await fetch(`http://localhost:3000/services?id=${serviceId}`);
        const serviceData = await serviceResponse.json();
        this.service = serviceData[0]; 
        const definitionResponse = await fetch(`http://localhost:3000/service-definitions?id=${this.service['service-definitionId']}`);
        const definitionData = await definitionResponse.json();
        this.service.definition = definitionData[0];

        await this.fetchVehicleTypes();
      } catch (error) {
        console.error('Error fetching service:', error);
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
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    sortTasks(column) {
      this.sortOrder = (this.sortColumn === column && this.sortOrder === 'ascending') ? 'descending' : 'ascending';
      this.sortColumn = column;
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
    goBack() {
      this.$router.go(-1);
    },
  },
  async created() {
    try {
      const user = await getUser();
      if (user.isLoggedIn) {
        const serviceId = this.$route.params.id;
        await this.fetchTasksByServiceId(serviceId);
        if (this.tasks.length > 0) {
          await this.fetchService(serviceId);
        }
      } else {
        this.$router.push('/login');
      }
      console.log('Tasks:', this.tasks);
      console.log('Service:', this.service);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
};
</script>


<style scoped>

button {
  margin-top: 10px;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: default;
}

.status-waiting {
  background-color: #90caf9;
}

.status-scheduled {
  background-color: #ffb74d;
}

.status-stopped {
  background-color: #ef5350;
}

.status-done {
  background-color: #c8e6c9;
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
  color: white; 
  background-color: #4CAF50; 
  margin-bottom: 40px
}

.back-button {
  position: absolute;
  left: 20px;
  width: 40px;
  height: 40px; 
  border-radius: 50%; 
  background-color: #22638A; 
  border: none; 
  color: white; 
  font-size: 24px; 
  cursor: pointer; 
  display: flex; 
  justify-content: center;
  align-items: center;
}

.back-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.container {
    display: flex;
    justify-content: left;
    align-items: left;
  }

.service-name {
  text-align: center;
}

.service-type {
  text-align: center;
}

.format{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  margin-left: 85px;
}


</style>