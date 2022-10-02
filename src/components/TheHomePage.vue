<template>
  <div class="home">
    <div style="margin-top: 200px">
      <h1 class="mb-5" v-if="!isAuthenticated">Najpierw się zaloguj...</h1>
      <div v-else class="mb-5">
        <h1>Część już działa. Można używać...</h1>
        <h4>Działa cały moduł PRACOWNICY</h4>
        <h4>Działa Zadania -> Kalendarz</h4>
        <br />
        <p class="text-center">
          ps. Wszelkie uwagi miłe widziane
          <b-icon icon="emoji-smile" scale="1.3" variant="progas"></b-icon>
        </p>
      </div>
      <img src="../assets/under-construction.png" alt="Girl in a jacket" height="343" width="686" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    console.log("created");
    this.isAuthenticated = this.$store.getters.getAuthenticationState;
  },
};
</script>
