<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <Menu/> -->
<!-- <h1>login</h1> -->
    <TheLogin/>

  </div>
</template>

<script>
import TheLogin from "@/components/TheLogin.vue";
// @ is an alias to /src
// import Menu from '@/components/TheHeader.vue';

export default {
  name: 'LoginView',
  components: {
    TheLogin
},
};
</script>
