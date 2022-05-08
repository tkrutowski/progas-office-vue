<template>
  <div class="mt-5 pt-5">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div v-if="error == 401">
      <!-- {{error}} -->
      <e401 />
    </div>
    <div v-if="error == 503">
       <!-- {{error}} -->
      <e503 />
    </div>

  </div>
</template>

<script>
import e401 from "@/components/error/error401.vue";
import e503 from "@/components/error/error503.vue";
// @ is an alias to /src
// import Menu from '@/components/TheHeader.vue';

export default {
  name: 'ErrorView',
  props: {
    error: Number
  },
  data() {

    return {
      // error: 10
    }
  },
  components: {
    e401,
    e503
  },
};
</script>
