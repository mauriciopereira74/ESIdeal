import './assets/main.css';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
    components,
    directives,
  })
const app = createApp(App).use(vuetify).use(router).mount('#app');