<template>
  <div class="container">
    <h4 class="font-weight-bold py-3 mb-4 mt-5">
      Profil użytkownika {{ user.firstName }} {{ user.lastName }}
    </h4>

      <b-tabs content-class="mt-3" class="text-progas"
      active-nav-item-class="bg-progas font-weight-bold text-uppercase text-progas" 
      >
      <!-- ZAKŁADKA OGÓLNE -->
      <b-tab title="Ogólne" active title-link-class="text-progas">
        <h4 class="mt-4">Informacje o użytkowniku</h4>
        <b-form @submit.prevent="updateUser">
          <!-- IMIE -->
          <b-form-group id="input-group-firstname" label="Imię:" label-for="input-firstname" description="">
            <b-form-input id="input-firstname" autocomplete="first-name" v-model="user.firstName" type="text"
              placeholder="wprowadź imię" required></b-form-input>
          </b-form-group>

          <!-- NAZWISKO -->
          <b-form-group id="input-group-lastname" label="Nazwisko:" label-for="input-lastname" description="">
            <b-form-input id="input-lastname" autocomplete="last-name" v-model="user.lastName" type="text"
              placeholder="wprowadź nazwisako" required></b-form-input>
          </b-form-group>

          <!-- LOGIN / USERNAME -->
          <b-form-group id="input-group-username" label="Nazwa użytkownika (login):" label-for="input-username"
            description="">
            <b-form-input id="input-username" v-model="user.username" autocomplete="username" type="text"
              placeholder="wprowadź login" required></b-form-input>
          </b-form-group>

          <!-- EMAIL -->
          <b-form-group id="input-group-email" label="E-mail:" label-for="input-email" description="">
            <b-form-input id="input-email" autocomplete="email" v-model="user.email" type="email"
              placeholder="example@org.com" required></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="progas">Zapisz zmiany</b-button>
        </b-form>
      </b-tab>

      <!-- ZAKŁADKA ZMIANA HASŁA -->
      <b-tab title="Zmiana hasła" title-link-class="text-progas">
        <h4 class="mt-4">Zmiana hasła</h4>
        <b-form @submit.prevent="updatePassword">
            <b-form-input  autocomplete="username" hidden>{{user.username}}</b-form-input>
            <!-- OLD PASSWORD -->
          <b-form-group  label="Stare hasło:" label-for="old-pass">
            <b-form-input id="old-pass" v-model="oldPassword" autocomplete="current-password" placeholder=""
              type="password" required></b-form-input>
          </b-form-group>

          <!-- NEW PASSWORD -->
          <b-form-group  label="Nowe hasło:" label-for="input-pass">
            <b-form-input id="input-pass" v-model="newPassword" :state="validationPassword" placeholder=""
              type="password" required autocomplete="new-password"></b-form-input>
            <b-form-invalid-feedback :state="validationPassword">
              Hasło musi mieć powyżej 8 znaków.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationPassword">
              OK.
            </b-form-valid-feedback>
          </b-form-group>

          <!-- CONFIRM PASSWORD -->
          <b-form-group  label="Potwierdź nowe hasło:" label-for="input-pass-confirm">
            <b-form-input id="input-pass-confirm" v-model="confirmPassword" :state="validationConfirmPassword"
              placeholder="" type="password" required autocomplete="new-password"></b-form-input>
            <b-form-invalid-feedback :state="validationConfirmPassword">
              Hasła muszą być identyczne.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationConfirmPassword">
              OK.
            </b-form-valid-feedback>
          </b-form-group>

          <b-button type="submit" variant="progas">Zapisz zmiany</b-button>
        </b-form>
      </b-tab>

      <b-tab title="Disabled" disabled >
        <p>I'm a disabled tab!</p>
      </b-tab>
    </b-tabs>
  
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import router from "@/router";
import {errorMixin} from "@/mixins/error"
import {userMixin} from "@/mixins/user"
export default {
  name: "UserProfile",
    mixins : [errorMixin, userMixin],
  data() {
    return {
      user: {},
      idUser: 0,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },

  created() {
    this.idUser = this.$store.getters.getUserId;
    this.getUserFromDb(this.idUser);
  },
  computed: {
    validationPassword() {
      return this.newPassword.length > 7 && this.newPassword.length < 250;
    },
    validationConfirmPassword() {
      return (
        this.newPassword === this.confirmPassword &&
        this.confirmPassword.length > 0
      );
    },
  },
  methods: {
     
    //------------------------------   USER  ------------------------------------------------
     updatePassword() {     
        if (this.validationPassword && this.validationConfirmPassword) {
          this.updatePasswordDB();
        } else {
          this.displaySmallMessage("warning", "Niepoprawne dane użytkownika.");
        }
    },
    //------------------------------   DB  ------------------------------------------------
    updatePasswordDB() {
        console.log("updatePassword() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           Authorization: "Bearer "+ this.$store.getters.getToken
        },
      };
      const params = {
        oldPass: this.oldPassword,
        newPass: this.newPassword,
      };
      axios
        .put(this.urlUser + `/api/user/changepass/` + this.idUser, null, {
          params,
          header,
        })
        .then((response) => {
          this.displaySmallMessage("success", "Zaaktualizowano hasło użytkownika.");
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
        })
        .catch((e) => {
          this.validateError(e);
        });
     },
   
    //
    //update user
    //
    updateUserDb() {
      // alert(JSON.stringify(this.user))
      console.log("updateUser() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .put(this.urlUser + `/api/user/update`, this.user, header)
        .then((response) => {
          this.user = response.data;
          this.msgSuccess = "Zaaktualizowano profil użytkownika";
          console.log("Odpowiedz HTTP: " + response.status + ", " + response.statusText);
          console.log("after updateUser(): " + this.user);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //get user from DB
    //
    getUserFromDb(userID) {
      console.log("getUserFromDb() - start, ID = " + userID);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Authorization': "Bearer "+ this.$store.getters.getToken
        },
      };
      axios
        .get(this.urlUser + `/api/user/` + userID, header)
        .then((response) => {
          this.user = response.data;
          console.log("Odpowiedz HTTP: "+response.status+", "+response.statusText);
          console.log("getUserFromDb(): " + this.user);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
      
  },
};
</script>

<style>
@import "@/assets/css/main.css";

#select-role {
    color: rgba(255, 245, 0, 0.8);
    background-color:#343a40;
}
.roles-group {
  color: #000;
}

.col-form-label {
  text-align-last: center;
}

.form-group {
  text-align-last: left;
}

.btn {
  cursor: pointer;
}
</style>
