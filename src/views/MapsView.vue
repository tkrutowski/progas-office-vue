<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Menu/>
    <Maps/>
  </div>
</template>

<script>
// @ is an alias to /src
import Maps from '@/components/tasks/Maps.vue';
import Menu from '@/components/Menu.vue';

export default {
  name: 'MapsView',
  components: {
    Menu,
    Maps
}
};
</script>
