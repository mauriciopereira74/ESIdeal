<template>
    <div class="profile-page">
      <v-sheet class="mx-auto" width="300">
        <v-form disabled> 
          <div class="profile-photo-wrapper">
            <img :src="employee.photo" alt="Employee" class="profile-photo">
          </div>
          <v-text-field
            v-model="employee.nome"
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="employee.employeeNumber"
            label="Number"
          ></v-text-field>
          <v-text-field
            v-model="employee.especialidade"
            label="Category"
          ></v-text-field>
        </v-form>
        <div class="status-button-wrapper">
          <button :class="statusClass" class="status-button" @click="openStateForm">{{ formatStatus(employee.state) }}</button>
        </div>
      </v-sheet>

      <v-dialog v-model="showStateForm" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Change State</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="newState"
                    :items="stateOptions.map(option => option.text)"
                    item-text="text"
                    class="status-select"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showStateForm = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="changeState">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
import { getUser } from '../models/user';

export default {
data() {
    return {
    employee: {},
    showStateForm: false,
    newState: '',
    stateOptions: [
        { text: 'Working', value: 'working' },
        { text: 'Day Off', value: 'dayOff' },
        { text: 'Holidays', value: 'holidays' },
        { text: 'Off', value: 'off' },
    ],
    };
},
computed: {
    statusClass() {
      return {
          'status-button-working': this.employee.state === 'working',
          'status-button-day-off': this.employee.state === 'dayOff',
          'status-button-holidays': this.employee.state === 'holidays',
          'status-button-off': this.employee.state === 'off',
      };
    },
},
methods: {
    async changeState() {
        try {

            const selectedState = this.stateOptions.find(option => option.text === this.newState);
            
            const response = await fetch(`http://localhost:3000/mechanics/${this.employee.id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ state: selectedState.value})
            });

            if (!response.ok) {
                throw new Error('Failed to change employee state');
            }

            this.employee.state = selectedState.value;
            this.newState = selectedState.text;
            this.showStateForm = false;
        } catch (error) {
            console.error('Error changing employee state:', error);
        }
    },
    openStateForm() {
        this.showStateForm = true;
        this.newState = this.stateOptions.find(option => option.value === this.employee.state).text;
    },
    formatStatus(status) {
      switch (status) {
      case 'working':
          return 'Working';
      case 'dayOff':
          return 'Day Off';
      case 'holidays':
          return 'Holidays';
      case 'off':
          return 'Off';
      }
    },
},
async created() {
    try {
      const user = await getUser();
      if (!user.isLoggedIn || !user.mechanic) {
        this.$router.push('/login');
        return;
      }
      const employeeNumber = user.mechanic.employeeNumber;
      const photoPath = `src/assets/userphotos/${employeeNumber}.png`;
      this.employee = {
      id: user.mechanic.id,
      photo: photoPath,
      nome: user.mechanic.nome,
      especialidade: user.mechanic.especialidade,
      employeeNumber: user.mechanic.employeeNumber,
      state: user.mechanic.state,
      };
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
  border-radius: 50%;
  overflow: hidden;
  width: 250px;
  height: 250px;
  margin-top: 100px;
  margin-bottom: 30px;
  margin-left: 25px;
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

.status-button {
  padding: 15px 70px;
  border: none;
  border-radius: 5px;
  color: black;
  cursor: pointer;
  font-size: 1.2em;
}

.status-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  margin-right: 45px;
}

.status-button-working {
  background-color: #4CAF50;
}

.status-button-day-off {
  background-color: #FFC107;
}

.status-button-holidays {
  background-color: #2196F3;
}

.status-done{
  background-color: #FF5722;
}

</style>
