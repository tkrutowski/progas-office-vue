<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Menu/>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from '@/components/Menu.vue';

export default {
  name: 'HomeView',
  components: {
    Menu,
  },
};
</script>
