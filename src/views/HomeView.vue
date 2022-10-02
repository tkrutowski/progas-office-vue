<template>
  <div>
   <HomePage/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/TheHomePage.vue';

export default {
  name: 'HomeView',
  components: {
    HomePage
  },
};
</script>
