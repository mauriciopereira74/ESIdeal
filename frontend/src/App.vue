<template>
  <div id="app">
    <div v-if="!isLoginPage">
      <Layout/>
    </div>
    <div v-else>
      <router-view/>
    </div>
  </div>
</template>

<script>
import Layout from './components/Layout.vue';

export default {
  components: {
    Layout
  },
  methods: {
    checkIsLoginPage() {
      this.isLoginPage = this.$route.path === '/login';
    }
  },
  data() {
    return {
      isLoginPage: false
    };
  },
  watch: {
    '$route'(to, from) {
      this.checkIsLoginPage();
    }
  },
  mounted() {
    this.checkIsLoginPage();
  }
};
</script>
