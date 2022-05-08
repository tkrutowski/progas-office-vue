<template>
  <div>
    <Login/>
    <!-- <router-link to="/login">hhh</router-link> -->
  </div>
</template>

<script>
import Login from "@/components/TheLogin.vue";
import router from "@/router";
import LoginView from "@/views/LoginView.vue";
export default {
  name: "Error401",
  components: { Login, LoginView },
  created() {
    
  },
}
</script>

<style>
</style>