<template>
  <div id="app">
    <Layout/>
    <router-view/>
  </div>
</template>

<script>
import Layout from './components/Layout.vue';

export default {
  components: {
    Layout
  }
};
</script>
