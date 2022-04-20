<template>
<div>
    <UserVue/>
  </div>
</template>

<script>
// @ is an alias to /src
// import Menu from '@/components/TheHeader.vue';
import UserVue from "@/components/user/TheUser.vue";
export default {
  name: 'UserView',
  components: {
    UserVue
},
};
</script>
