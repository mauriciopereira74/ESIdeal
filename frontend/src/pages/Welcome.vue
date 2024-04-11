<template>
    <div class="welcome-page">
      <!-- Employee Information -->
      <div class="employee-info">
        <img :src="employee.photo" alt="Employee" class="employee-photo">
        <h1>{{ employee.name }}</h1>
        <p>{{ employee.role }}</p>
        <p>Employee number: {{ employee.number }}</p>
      </div>
  
      <!-- Search Field -->
      <div class="search-field">
        <input v-model="searchTerm" type="search" placeholder="Search:">
        <button @click="performSearch">🔍</button>
      </div>
  
      <!-- Tasks Table -->
      <table class="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Deadline</th>
            <th>Estimated Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.deadline }}</td>
            <td>{{ task.duration }}</td>
            <td>
              <span :class="{'status': true, 'waiting': task.status === 'WAITING', 'done': task.status === 'DONE'}">{{ task.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchTerm: '',
        employee: {
          photo: 'path-to-employee-photo.jpg', // The path to the employee's photo
          name: 'Antônio da Silva',
          role: 'Electric Motor Expert',
          number: 'P0844'
        },
        tasks: [
          { id: 's4503', name: 'Tire change', deadline: '16:27', duration: '30 minutes', status: 'WAITING' },
          { id: 's2034', name: 'Battery replacement', deadline: '16:45', duration: '40 minutes', status: 'DONE' },
          // ... other tasks
        ]
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
        // Logic to perform search
        console.log('Search for:', this.searchTerm);
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
  