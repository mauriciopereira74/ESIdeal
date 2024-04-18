<template>
  <div class="vehicle-page">
    <div class="top-section">
      <div class="vehicle-section">
        <div class="vehicle-photo-wrapper">
          <img :src="vehicle.photo" alt="Vehicle" class="vehicle-photo">
        </div>
        <div class="vehicle-details">
          <p :style="{ fontSize: '1.5em', color: '#22638A' }">{{ vehicle.modelo }}</p>
          <p :style="{ fontSize: '0.8em', color: '#22638A' }">{{ vehicle.cilindrada }} cc</p>
          <p>{{ vehicle.vehicleTypeId }}</p>
          <p>{{ vehicle.kms }} kms</p>
        </div>
      </div>
      <h1 class="vehicle-id">{{ vehicle.id }}</h1>
      <div class="owner-details">
        <h1>Owner</h1>
        <h1 class="owner-name">{{vehicle.owner?.nome}}</h1>
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
            <th @click="sortTasks('date')">Date <span>⇅</span></th>
            <th @click="sortTasks('mechanic')">Mechanic<span>⇅</span></th>
            <th @click="sortTasks('status')">Status <span>⇅</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.service.descr }}</td>
            <td>{{ task.descrição }}</td>
            <td>{{ task.date }}</td>
            <td>{{ task.mechanic.nome }}</td>
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
  export default {
    data() {
      return {
        searchTerm: '',
        vehicle: {},
        owner: {},
        tasks: [],
        serviceDefinitions: {},
        mechanics: {},
        sortColumn: '',
        sortOrder: 'ascending',
      };
    },
    // Restante das propriedades computadas e métodos conforme necessário
    async created() {
      const vehicleId = this.$route.params.id;
      await this.fetchServiceDefinitions();
      await this.fetchMechanics();
      await this.fetchVehicleData(vehicleId);
      await this.fetchTasks(vehicleId);
    },
    methods: {
        formatDate(data) {
            if (!data) return '---';
            const date = new Date(data.ano, data.mes - 1, data.dia, data.hora, data.minutos);
            // Você pode alterar a string de formato abaixo para atender ao formato desejado.
            return date.toLocaleString('pt-PT', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
            });
        },
        async fetchMechanics() {
            try {
                const response = await fetch(`http://localhost:3000/mechanics`);
                if (!response.ok) {
                throw new Error('Network response was not ok for mechanics');
                }
                const mechanicsData = await response.json();
                mechanicsData.forEach(mechanic => {
                this.mechanics[mechanic.employeeNumber] = mechanic;
                });
            } catch (error) {
                console.error('There was an error fetching the mechanics:', error);
            }
        },
        async fetchServiceDefinitions() {
            try {
                const response = await fetch(`http://localhost:3000/service-definitions`);
                if (!response.ok) {
                throw new Error('Network response was not ok for service definitions');
                }
                const definitions = await response.json();
                definitions.forEach(def => {
                this.serviceDefinitions[def.id] = def;
                });
            } catch (error) {
                console.error('There was an error fetching the service definitions:', error);
            }
        },
        async fetchVehicleData(vehicleId) {
            try {
            const response = await fetch(`http://localhost:3000/vehicles/${vehicleId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            this.vehicle = await response.json();
            this.vehicle.photo = `/src/assets/vehicles/${vehicleId}.png`;
            await this.fetchClientData(this.vehicle.clientId);
            this.vehicle.owner = this.owner;
            
            } catch (error) {
            console.error('There was an error fetching the vehicle data:', error);
            }
        },
        async fetchClientData(clientId) {
            const response = await fetch(`http://localhost:3000/clients/${clientId}`);
            // ... tratamento de erros ...
            const client = await response.json();
            this.owner = client;
        },
        async fetchTasks(vehicleId) {
            try {
                const response = await fetch(`http://localhost:3000/services?vehicleId=${vehicleId}`);
                if (!response.ok) {
                throw new Error('Network response was not ok for services');
                }
                const services = await response.json();
                this.tasks = services.map(service => ({
                ...service,
                date: service.data ? this.formatDate(service.data) : '---',
                service: this.serviceDefinitions[service['service-definitionId']],
                mechanic: this.mechanics[service.employeeNumber],
                }));
                
            } catch (error) {
                console.error('There was an error fetching the tasks:', error);
            }
        },
        formatStatus(estado) {
            // Mapeia os estados para os valores de exibição
            const statusMapping = {
                nafila: 'Waiting',
                programado: 'Scheduled',
                parado: 'Stopped',
                realizado: 'Done',
            };
            return statusMapping[estado] || 'Unknown';
        },
    },
  };
  </script>
  
  <style scoped>

.vehicle-page {
  padding: 20px;
}

.vehicle-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.vehicle-photo-wrapper {
  border-radius: 50%;
  overflow: hidden;
  width: 250px;
  height: 250px;
  margin-right: 20px;
  margin-left: 100px;
  margin-top: 35px;
}
  
.vehicle-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
  
.vehicle-details {
  margin-left: 20px;
}
  
.vehicle-attributes {
  flex-grow: 1;
}

.vehicle-id {
  text-align: right;
}
.vehicle-id{
  color:#22638A;
}

.owner-details {
  color:#22638A;
  margin-left: 20px;
}


.owner-name{
  font-size: large;
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
  </style>
  