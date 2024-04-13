<template>
    <div class="task-page">
      <!-- Aqui iria o teu Navbar se já estiver implementado -->
      <!-- Exemplo de como poderiam ser mostrados os detalhes da tarefa -->
      <div v-if="taskDetails" class="task-details">
        <h1>{{ taskDetails['service-definitionId'].descr }}</h1>
        <p><strong>Vehicle ID:</strong> {{ taskDetails.vehicleId }}</p>
        <p><strong>Estimated Duration:</strong> {{ taskDetails['service-definitionId'].duração }} minutes</p>
        <p><strong>Status:</strong> {{ taskDetails.estado }}</p>
        <p><strong>Description:</strong> {{ taskDetails.descrição }}</p>
        
        <div class="actions">
          <button @click="markAsDone" class="btn-done">Done</button>
          <button @click="suspendTask" class="btn-suspend">Suspend</button>
          <button @click="recommendServices" class="btn-recommend">Recommend Services</button>
        </div>
      </div>
      <div v-else>
        <p>Loading task details...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        taskDetails: null,
      };
    },
    methods: {
      async getTaskDetails() {
        const taskId = this.$route.params.id;
        try {
          const response = await fetch(`http://localhost:3000/services/${taskId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this.taskDetails = data;
        } catch (error) {
          console.error('Could not fetch task details:', error);
        }
      },
      async markAsDone() {
        try {
          const taskId = this.$route.params.id;
          const response = await fetch(`http://localhost:3000/services/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              estado: 'realizado'
            })
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Atualize os detalhes da tarefa após a marcação como concluída
          await this.getTaskDetails();
          console.log('Task marked as done');
        } catch (error) {
          console.error('Could not mark task as done:', error);
        }
      },
      async suspendTask() {
        try {
          // Lógica para suspender a tarefa
        } catch (error) {
          console.error('Could not suspend task:', error);
        }
      },
      async recommendServices() {
        try {
          // Lógica para recomendar serviços
        } catch (error) {
          console.error('Could not recommend services:', error);
        }
      }
    },
    created() {
      this.getTaskDetails();
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