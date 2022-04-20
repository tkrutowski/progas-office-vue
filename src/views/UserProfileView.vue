<template>
<div>
    <UserProfile/>
  </div>
</template>

<script>
import UserProfile from "../components/user/TheUserProfile.vue";
export default {
  name: 'UserProfileView',
  components: {
    UserProfile
},
};
</script>
