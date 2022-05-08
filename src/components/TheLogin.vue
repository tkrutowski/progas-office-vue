<template>
  <div id="container">
    <form class="login-form" @submit.prevent="login">
      <!-- <h3>Logowanie</h3> -->
      <h2 class="mb-5">Logowanie</h2>

      <!-- ERROR -->
      <div v-if="error">
        <p id="error">Niestety podałeś niewłaściwy login lub hasło.</p>
      </div>

      <!-- LOGIN id="form-group-login"-->
      <div class="form-group" >
        <label for="login">Login</label>
        <input
          type="text"
          id="login"
          class="form-control form-control-lg"
          placeholder="Nazwa użytkownika"
          autocomplete="username"
          required
          v-model="username"
        />
        <!-- <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small> -->
      </div>

      <!-- PASSWORD -->
      <div class="form-group">
        <label for="password">Hasło</label>
        <input
          type="password"
          id="password"
          class="form-control form-control-lg"
          placeholder="Hasło"
          autocomplete="current-password"
          required
          v-model="password"
        />
      </div>

      <!-- BUTTON -->
         <b-button class="mt-3" style="width: 100px" variant="progas" type="submit"
              >Zaloguj
            </b-button>
      <p class="forgot-password text-right mt-2 mb-4">
        <!-- <router-link to="/forgot-password">Nie pamiętam hasła</router-link> -->
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {errorMixin} from "@/mixins/error"
import {userMixin} from "@/mixins/user"
export default {
  name: "TheLogin",
  mixins : [errorMixin, userMixin],
  data() {
    return {
      error: false,

      user: {
        id: 0,
        username: "",
        userFirstName: "",
      },
      username: "",
      // username: "tomkru",
      // password: "pass",
      password: "",
      heder: {},
      resp: {},
    };
  },
  computed: {
    // jeżeli coś sięzmieni w tych polach to strona się odświerzy
  },
  created() {
    // console.log("Czy zalogowano: " + this.userStateLogin.isAuthenticated);
    // this.userStateLogin = this.$store.getters.getAuthenticationState;
    // console.log("Czy zalogowano: " + this.userStateLogin.isAuthenticated);
    // this.isAuthenticated = this.state.userState.isAuthenticated;
     this.$store.commit("updateToken", "null");
      this.$store.commit("updateAuthenticateState", false);
      this.$store.commit("updateUser", {});
  },
  methods: {
    // async login() {
    login() {
      console.log("login() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          // "Access-Control-Allow-Origin": "*"
        },
      };
      axios
        .post(
          this.urlUser + `/api/auth/login`,
          {
            username: this.username,
            password: this.password,
          },
          header
        )
        .then((response) => this.loginSuccessful(response))
        .catch((e) => this.loginFailed(e));
    },

    loginSuccessful(res) {
      console.log("loginSuccessful() - start" + res);
      // console.log("data: " + JSON.stringify(res.headers));
      this.resp = res;
      // console.log("header token: " + res.headers["jwt-token"]);
      this.user = res.data;
      let data = res.data;
      // console.log("data: " + JSON.stringify(data));

      if (!res.headers["jwt-token"] && res.status != 200) {
        this.loginFailed();
        return;
      }

      this.$store.commit("updateToken", res.headers["jwt-token"]);
      this.$store.commit("updateAuthenticateState", true);
      this.$store.commit("updateUser", res.data);

      this.$router.replace(this.$route.query.redirect || "/");
    },
    loginFailed(e) {
      console.log("loginFaild() - start");
      this.error = true;

      this.$store.commit("updateToken", "null");
      this.$store.commit("updateAuthenticateState", false);
      this.$store.commit("updateUser", {});

      this.validateError(e)
    }
  },
};
</script>

<style>
#error {
  color: red;
}
#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

.login-form {
  max-width: 400px;
  margin: auto;
  margin-top: 200px;
}
</style>
