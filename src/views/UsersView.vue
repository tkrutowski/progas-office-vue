<template>
<div>
    <TheUsers/>
  </div>
</template>

<script>
import TheUsers from "@/components/user/TheUsers.vue";
// @ is an alias to /src
// import Menu from '@/components/TheHeader.vue';

export default {
  name: 'UserView',
  components: {
    TheUsers
},
};
</script>
