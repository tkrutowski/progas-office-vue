<template>
  <div>
    <div id="logo-back">
      <img id="logo" alt="Vue logo" src="../assets/logo.png" />
      <h1 id="name" class="d-none d-md-block">ProgasOffice</h1>
    </div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">Home</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="test">
          <b-nav-item-dropdown text="Pracownicy" right>
            <b-dropdown-item href="/hr/employee/all" :disabled="!hasAccessReadEmployees">Lista pracowników</b-dropdown-item>
            <b-dropdown-item href="/hr/AddWorkTime" :disabled="!hasAccessAddWorktime">Wpisywanie godzin</b-dropdown-item>
            <b-dropdown-item href="/hr/AddSalaryAdditions" :disabled="!hasAccessHrAddition">Wpisywanie dodatków</b-dropdown-item>
            <b-dropdown-item href="/hr/AddAdvance" :disabled="!hasAccessHrAdvance">Wpisywanie zaliczek</b-dropdown-item>
            <!-- <b-dropdown-item href="/hr/employee/all">Lista pracowników</b-dropdown-item> -->
            <!-- <b-dropdown-item href="/hr/AddWorkTime">Wpisywanie godzin</b-dropdown-item> -->
            <!-- <b-dropdown-item href="/hr/AddAdditions">Wpisywanie dodatków</b-dropdown-item> -->
            <!-- <b-dropdown-item href="/hr/AddAdvances" >Wpisywanie zaliczek</b-dropdown-item> -->
            <b-dropdown-item href="#" disabled>Wpisywanie pożyczek</b-dropdown-item>
            <b-dropdown-item href="/hr/CalculateSalary" :disabled="!hasAccessCalculateSalary"
              >Oblicznie wypłat</b-dropdown-item
            >
            <b-dropdown-item href="#" disabled>Lista pożyczek</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item href="#" disabled>Klienci</b-nav-item>
          <b-nav-item href="#" disabled>Finanse</b-nav-item>

          <b-nav-item-dropdown text="Zadania" right>
            <b-dropdown-item href="#" disabled>Gazociąg</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Przyłącze</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Wewnętrzna</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Terminarz</b-dropdown-item>
            <b-dropdown-item href="/tasks/TaskCalendar" :disabled="!hasAccessTaskCalendar"
              >Kalendarz</b-dropdown-item
            >
            <b-dropdown-item href="#" disabled>Koordynator</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Geodeta</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Projektant</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Projektant org. ruchu</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Inspektor</b-dropdown-item>
            <b-dropdown-item href="#" disabled>Dane adresowe</b-dropdown-item>
          </b-nav-item-dropdown>

          <!--                    <b-nav-item href="#" :active="isTaskActive">Zadania</b-nav-item>-->
          <b-nav-item href="#" disabled>Pojazdy</b-nav-item>
          <b-nav-item href="#" disabled>Ustawienia</b-nav-item>

          <!-- ADMINISTRACJA -->
          <b-nav-item-dropdown text="Administracja" v-if="isAdmin">
            <b-dropdown-item href="/user/all">Użytkownicy</b-dropdown-item>
            <b-dropdown-item href="/user/roles">Uprawnienia</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <div v-if="!getAuthenticationState">
            <router-link :to="{ name: 'Login' }">
              <b-button size="sm" class="my-2 ml-2 my-sm-0 btn-login"> Zaloguj się </b-button>
            </router-link>
          </div>

          <b-nav-item-dropdown right v-else>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ getUserFirstName }}</em>
            </template>
            <b-dropdown-item href="/user/profile">Profil użytkownika</b-dropdown-item>
            <b-dropdown-item @click="logout" href="/">Wyloguj</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
export default {
  name: "TheHeader",
  data() {
    return {
      isHrActive: false,
      isCustomerActive: false,
      isFinanceActive: false,
      isTaskActive: false,
      isVehiclesActive: false,
      isSettingActive: false,

      isAuthenticated: null,
      userName: "",
      userFirstName: "",
    };
  },

  computed: {
    ...mapGetters(["getAuthenticationState", "getUserFirstName", "getToken"]),
    isAdmin() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_ADMIN: " + token2.authorities.includes('ROLE_ADMIN'))
        return token2.authorities.includes("ROLE_ADMIN");
      } catch (error) {
        return false;
      }
    },
    hasAccessTaskCalendar() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_TASK_CALEDAR: " + token2.authorities.includes('ROLE_TASK_CALENDAR'))
        return (
          token2.authorities.includes("ROLE_TASK_CALENDAR") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    hasAccessReadEmployees() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_EMPLOYEE: " + token2.authorities.includes('ROLE_HR_EMPLOYEE'))
        return (
          token2.authorities.includes("ROLE_HR_EMPLOYEE") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    hasAccessAddWorktime() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return (
          token2.authorities.includes("ROLE_HR_WORKTIME") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    hasAccessCalculateSalary() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_SALARIES: " + token2.authorities.includes('ROLE_HR_SALARIES'))
        return (
          token2.authorities.includes("ROLE_HR_SALARIES") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    hasAccessHrAddition() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_ADDITION: " + token2.authorities.includes('ROLE_HR_ADDITION'))
        return (
          token2.authorities.includes("ROLE_HR_ADDITION") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
       hasAccessHrAdvance() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_ADVANCE: " + token2.authorities.includes('ROLE_HR_ADVANCE'))
        return (
          token2.authorities.includes("ROLE_HR_ADVANCE") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
  },
  created() {
    //  this.isAuthenticated = this.$store.getters.getAuthenticationState;
  },
  methods: {
    changeHrActive() {
      this.isHrActive = true;
      this.isCustomerActive = false;
      this.isFinanceActive = false;
      this.isTaskActive = false;
      this.isVehiclesActive = false;
      this.isSettingActive = false;
    },
    logout() {
      this.$store.commit("updateToken", "");
      this.$store.commit("updateAuthenticateState", false);
      this.$store.commit("updateUser", {});
      this.userFirstName = "";
      this.isAuthenticated = false;
      console.log("Po wylogowaniu store: " + this.$store.getters.getAuthenticationState);
      // this.$router.push("/");
    },
  },
};
</script>

<style scoped>
#logo {
  /*display: block;*/
  width: 150px;
  margin-left: 50px;
  /*float: left;*/
}

#logo-back {
  display: flex;
  justify-content: space-between;
  /*float: left;*/
  height: 150px;
  width: auto;
  background-color: rgb(97, 93, 92);
}

#name {
  color: rgba(255, 245, 0, 0.8);
  padding-top: 50px;
  padding-right: 50px;
}

.btn-login {
  background-color: rgba(255, 245, 0, 0.8);
  color: #252525;
}
</style>
