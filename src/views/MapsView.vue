<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Maps/>
    
  </div>
</template>

<script>
// @ is an alias to /src
import Maps from '@/components/tasks/Maps.vue';

export default {
  name: 'MapsView',
  components: {
    Maps,
}
};
</script>
