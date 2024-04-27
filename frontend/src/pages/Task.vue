<template>
  <div class="task-page">
    <div class="top-section">
      <div class="vehicle-section" :style="{ cursor: 'pointer' }">
        <div class="vehicle-photo-wrapper">
          <img :src="`/src/assets/vehicles/${service.vehicleId}.png`" alt="Vehicle" class="vehicle-photo">
        </div>
        <div class="vehicle-details" @click="goTo(service.vehicleId)">
          <p class="vehicle-model">{{ service.vehicle?.modelo }}</p>
          <p :style="{ fontSize: '0.8em', color: '#22638A' }">{{ service.vehicle?.cilindrada }} cc</p>
          <p>{{ service.vehicle?.vehicleTypeId }}</p>
          <p>{{ service.vehicle?.kms }} kms</p>
        </div>
      </div>
      <h1 class="service-type">{{ service.tipo }}</h1>
      <div class="status-button-wrapper">
        <button :class="statusClass" class="status-button">{{ formatStatus(service.estado) }}</button>
      </div>
    </div>

    <div class="description-and-button">
      <div class="service-name">
        <h1>{{ service.definition?.descr }}</h1>
      </div>
      <div class="change-state-button" v-if="formatStatus(service.estado) !== 'DONE'">
        <v-btn color="primary" @click="toggleStatusForm">Change State</v-btn>
      </div>
    </div>

    <v-dialog v-model="showStatusForm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Change Status</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="newStatus"
                  :items="statusOptions.map(option => option.text)"
                  item-text="text"
                  class="status-select"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showStatusForm = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="changeStatus">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Search tasks" @input="filterTasks" />
      <img src="@/assets/icons/search.png" alt="Search" style="width: 35px;"> 
    </div>

    <div class="tasks-table">
      <v-table>
        <thead style="background-color: #22638A; color: white; text-align: center;">
          <tr>
            <th @click="sortTasks('time')">Time <span>⇅</span></th>
            <th @click="sortTasks('descr')">Task <span>⇅</span></th>
            <th @click="sortTasks('duração')">Duration <span>⇅</span></th>
            <th @click="sortTasks('observation')">Observation <span>⇅</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredAndSortedTasks" :key="task.id" @click="goToTaskPage(task.id)">
            <td>{{ task.time }}</td>
            <td>{{ task.descr }}</td>
            <td>{{ task.duração }} minutes</td>
            <td>{{ task.observation }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <v-btn color="primary" class="mb-2" @click="toggleAddTaskForm" v-if="formatStatus(service.estado) !== 'DONE'">Add Task</v-btn>

    <v-dialog v-model="showAddTaskForm" persistent max-width="600px">
      <v-form v-model="valid" ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">Add Task</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newTask.descr"
                    label="Description"
                    :rules="descrRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newTask.date"
                    label="Date & Time"
                    type="datetime-local"
                    :rules="dateRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="newTask.duração"
                    label="Duration (minutes)"
                    type="number"
                    :rules="durationRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newTask.observation"
                    label="Observation"
                    :rules="observationRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showAddTaskForm = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="addTask">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
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
      showAddTaskForm: false,
      showStatusForm: false,
      newTask: {
        id: null,
        serviceId: "",
        descr: "",
        date: "",
        observation: "",
        duração: null
      },
      descrRules: [
        v => !!v || 'Description is required',
        v => (v && v.length <= 20) || 'Description must be less than 20 characters'
      ],
      dateRules: [
        v => !!v || 'Date and time are required'
      ],
      durationRules: [
        v => !!v || 'Duration is required',
        v => !isNaN(parseFloat(v)) && v > 0 || 'Duration must be a positive number'
      ],
      statusOptions: [
        { value: "nafila", text: "Waiting" },
        { value: "programado", text: "Scheduled" },
        { value: "parado", text: "Stopped" },
        { value: "realizado", text: "Done" }
      ],
      newStatus: ''
    };
  },
  computed: {
    filteredAndSortedTasks() {
      return this.tasks.filter(task => {
        const searchLower = this.searchTerm.toLowerCase();
        return task.descr.toLowerCase().includes(searchLower) ||
              task.observation.toLowerCase().includes(searchLower) || 
              task.time.toLowerCase().includes(searchLower) ||
              this.formatStatus(this.service.estado).toLowerCase().includes(searchLower); // Filtrar pelo status do serviço
      }).sort((a, b) => {
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

        // Corrigindo o formato dos dados de estado
        const estado = this.service.estado;
        if (estado === "nafila" || estado === "programado" || estado === "parado" || estado === "realizado") {
          this.newStatus = estado;
        } else {
          console.error("Estado inválido:", estado);
        }

        const definitionResponse = await fetch(`http://localhost:3000/service-definitions?id=${this.service['service-definitionId']}`);
        const definitionData = await definitionResponse.json();
        this.service.definition = definitionData[0];

        await this.fetchVehicleTypes();
        await this.fetchVehicle(this.service.vehicleId);
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
    async fetchVehicle(vehicleId) {
      try {
        const response = await fetch(`http://localhost:3000/vehicles?id=${vehicleId}`);
        const vehicle = await response.json();
        this.service.vehicle = vehicle[0];
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      }
    },
    async fetchTasksByServiceId(serviceId) {
      try {
        const taskDetails = await this.fetchTaskDetailsByServiceId(serviceId);
        this.tasks = taskDetails.map(task => ({
          id: task.id,
          serviceId: task.serviceId,
          time: task.date,
          descr: task.descr,
          observation: task.observation,
          duração: task.duração
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

    goTo(vehicleId) {
      this.$router.push(`/vehicle/${vehicleId}`);
    },

    async addTask() {
      if (this.$refs.form.validate()) {
        const maxId = this.tasks
          .filter(task => task.serviceId === this.service.id)
          .reduce((max, task) => Math.max(max, task.id), 0);

        if (this.newTask.descr && this.newTask.date && this.newTask.duração) {
          const res = {
            id: maxId + 1,
            serviceId: this.service.id,
            descr: this.newTask.descr,
            date: this.newTask.date,
            observation: this.newTask.observation,
            duração: this.newTask.duração
          };

          try {
            const response = await fetch('http://localhost:3000/service-description', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(res)
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            await this.fetchTasksByServiceId(this.service.id);

            this.newTask = { serviceId: this.newTask.serviceId, descr: '', date: '', observation: '', duração: 0 };

          } catch (error) {
            console.error('Error adding new task:', error);
            alert('Failed to add new task.');
          }
        } else {
          alert('Please fill in all fields for the task.');
        }
        this.showAddTaskForm = false;
      }
    },
    toggleAddTaskForm() {
      this.showAddTaskForm = !this.showAddTaskForm;
    },

    toggleStatusForm() {
      const selectedStatus = this.statusOptions.find(option => option.value === this.service.estado);

      if (!selectedStatus) {
        console.error('Selected status not found in statusOptions:', this.service.estado);
        return;
      }

      this.newStatus = selectedStatus.text;
      this.showStatusForm = !this.showStatusForm;
    },


    async changeStatus() {
      try {
        const selectedStatus = this.statusOptions.find(option => option.text === this.newStatus);

        if (!selectedStatus) {
          console.error('Selected status not found in statusOptions:', this.newStatus);
          return;
        }

        const response = await fetch(`http://localhost:3000/services/${this.service.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ estado: selectedStatus.value })
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        this.service.estado = selectedStatus.value;
        this.newStatus = selectedStatus.text;
        this.showStatusForm = false;
      } catch (error) {
        console.error('Error changing status:', error);
        alert('Failed to change status.');
      }
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
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
};
</script>


<style scoped>

.task-page {
  padding: 20px;
  padding-left: 60px;
}

.service-name{
  color:#22638A;
  padding-top: 20px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.vehicle-section {
  display: flex;
  align-items: center;
}

.vehicle-photo-wrapper {
  border-radius: 50%;
  overflow: hidden;
  width: 250px;
  height: 250px;
  margin-right: 20px;
  margin-left: auto;
  margin-top: 35px;
}

.vehicle-photo {
  width: 250px;
  height: 250px;
  object-fit: cover;
}

.vehicle-details {
  margin-left: 20px;
}

.service-type-and-status {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description-and-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; 
}

.change-state-button {
  padding-right: 25px;
}

.status-button-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}

.service-type {
  font-size: 2.5em;
  color:#22638A;
  text-align: center;
  margin-right: 20px;
}

.status-button {
  padding: 20px 120px;
  border: none;
  border-radius: 5px;
  color: black;
  cursor: default;
  font-size: 1.2em;
}

button.status-waiting {
  background-color: #90caf9;
}

button.status-scheduled {
  background-color: #ffb74d;
}

button.status-stopped {
  background-color: #ef5350;
}

button.status-done {
  background-color: #c8e6c9;
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

.search-bar input {
  flex-grow: 1;
  border: none;
  padding: 8px;
  border-radius: 5px;
}

.tasks-table {
  margin-top: 20px;
}

.status-select {
  width: 100%;
}

.v-list-item:hover {
  background-color: #E0E0E0;
}

.v-list-item--active {
  background-color: #22638A !important;
}

.vehicle-model{
  font-size: 1.5em;
  color: #22638A;
}

.vehicle-details:hover .vehicle-model {
  font-size: 1.8em;
  transition: font-size 0.3s ease;
}



</style>
