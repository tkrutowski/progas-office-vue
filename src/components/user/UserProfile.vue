<template>
  <div class="container">
    <h4 class="font-weight-bold py-3 mb-4">
      Profil użytkownika {{ user.firstName }} {{ user.lastName }}
    </h4>

    <b-alert
      :show="dismissCountDownSuccess"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDownSuccess = 0"
      @dismiss-count-down="countDownChangedSuccess"
    >
      {{ msgSuccess }} ({{ dismissCountDownSuccess }}s)...
    </b-alert>

    <b-alert
      :show="dismissCountDownError"
      dismissible
      fade
      variant="danger"
      @dismissed="dismissCountDownError = 0"
      @dismiss-count-down="countDownChangedError"
    >
      {{ msgError }} ({{ dismissCountDownError }}s)...
    </b-alert>

    <b-tabs content-class="mt-3" vertical>
      <!-- ZAKŁADKA OGÓLNE -->
      <b-tab title="Ogólne" active>
        <h4>Informacje o użytkowniku</h4>
        <b-form @submit="updateUser">
          <!-- IMIE -->
          <b-form-group
            id="input-group-firstname"
            label="Imię:"
            label-for="input-firstname"
            description=""
          >
            <b-form-input
              id="input-firstname"
              autocomplete="first-name"
              v-model="user.firstName"
              type="text"
              placeholder="wprowadź imię"
              required
            ></b-form-input>
          </b-form-group>

          <!-- NAZWISKO -->
          <b-form-group
            id="input-group-lastname"
            label="Nazwisko:"
            label-for="input-lastname"
            description=""
          >
            <b-form-input
              id="input-lastname"
              autocomplete="last-name"
              v-model="user.lastName"
              type="text"
              placeholder="wprowadź nazwisako"
              required
            ></b-form-input>
          </b-form-group>

          <!-- LOGIN / USERNAME -->
          <b-form-group
            id="input-group-username"
            label="Nazwa użytkownika (login):"
            label-for="input-username"
            description=""
          >
            <b-form-input
              id="input-username"
              v-model="user.username"
              autocomplete="username"
              type="text"
              placeholder="wprowadź login"
              required
            ></b-form-input>
          </b-form-group>

          <!-- EMAIL -->
          <b-form-group
            id="input-group-email"
            label="E-mail:"
            label-for="input-email"
            description=""
          >
            <b-form-input
              id="input-email"
              autocomplete="email"
              v-model="user.email"
              type="email"
              placeholder="example@org.com"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Zapisz zmiany</b-button>
        </b-form>
      </b-tab>

      <!-- ZAKŁADKA ZMIANA HASŁA -->
      <b-tab title="Zmiana hasła">
        <h4>Zmiana hasła</h4>
        <b-form @submit="updatePassword">
          <div class="form-group">
            <label class="form-label">Bierzące hasło</label>
            <input
              type="password"
              autocomplete="current-password"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Nowe hasło</label>
            <input
              type="password"
              autocomplete="new-password"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Powtórz nowe hasło</label>
            <input
              type="password"
              autocomplete="new-password"
              class="form-control"
            />
          </div>
          <b-button type="submit" variant="primary">Zapisz zmiany</b-button>
        </b-form>
      </b-tab>

      <!-- ZAKŁADKA UPRAWNIENIA -->
      <b-tab title="Uprawnienia">
        <!--                    Pracownik-->
        <div>
          <label class="form-label mt-5 max-width" for="employeeSelect">
            Wybierz pracownika:
            <b-form-select
              v-model="selectedUserID"
              :options="optionsUsers"
              class="mb-5"
              id="employeeSelect"
              @change="onUserChange"
              required
            >
            </b-form-select>
          </label>
        </div>

        <h4>Uprawnienia użytkownika</h4>
        <!-- ------------------- CARD ROLES ------------------------>
        <b-card-group deck class="roles-group">
          <!-- <b-form @submit="addRoleToUser"> -->
          <b-card header-tag="header" footer-tag="footer">
            <template #header>
              <h4 class="mb-0">Role</h4>
            </template>
            <b-card-text>Wybierz role do edycji lub dodaj nową.</b-card-text>
            <div>
              <b-form-select
                v-model="selectedRole"
                :options="optionsUserRoles"
                :select-size="20"
                @change="onRoleChange"
              ></b-form-select>
              <div class="mt-3"></div>
            </div>
            <!-- <b-button @click="showRoleModal" variant="primary">Dodaj role</b-button> -->
            <!-- v-b-modal="'role' + selectedUserID" -->

            <template #footer>
              <!-- <b-form @submit.prevent="deleteRoleFromUser" > -->

              <b-button
                :disabled="selectedRole > 0 ? false : true"
                variant="danger"
                @click="deleteRoleFromUser"
                >Usuń role</b-button
              >
              <!-- @click="deleteRoleFromUser" -->
              <!-- </b-form> -->
              <b-button class="button-my"
                :disabled="selectedUserID > 0 ? false : true"
                variant="warning"
                @click="showRoleModal"
                >Dodaj role</b-button
              >
            </template>
          </b-card>

          <!-- ------------------- CARD PRIVILEGES ------------------------>
          <b-card header-tag="header" footer-tag="footer">
            <template #header>
              <h4 class="mb-0">Uprawnienia dla roli</h4>
            </template>
            <b-card-text><h3>Odczyt</h3></b-card-text>
            <!-- <b-card-text>Uprawnienia do odczytu</b-card-text> -->
            <b-form-group label="Uprawnienia do odczytu">
              <b-form-radio
                v-model="selectedRead"
                value="NULL"
                checked="checkReadNull"
                >None
              </b-form-radio>
              <b-form-radio v-model="selectedRead" value="READ"
                >Read .</b-form-radio
              >
              <b-form-radio v-model="selectedRead" value="READ_ALL"
                >Read all</b-form-radio
              >
            </b-form-group>
            <hr />
            <!-- <b-card-text>Uprawnienia do zapisu</b-card-text> -->
            <b-card-text><h3>Zapis</h3></b-card-text>
            <b-form-group label="Uprawnienia do odczytu">
              <b-form-radio v-model="selectedWrite" value="NULL"
                >None</b-form-radio
              >
              <b-form-radio v-model="selectedWrite" value="WRITE"
                >Write</b-form-radio
              >
              <b-form-radio v-model="selectedWrite" value="WRITE_ALL"
                >Write all</b-form-radio
              >
            </b-form-group>
            <hr />

            <!-- <b-card-text>Uprawnienia do usuwania</b-card-text> -->
            <b-card-text><h3>Usuwanie</h3></b-card-text>
            <b-form-group label="Uprawnienia do usuwania">
              <b-form-radio v-model="selectedDelete" value="NULL"
                >None</b-form-radio
              >
              <b-form-radio v-model="selectedDelete" value="DELETE"
                >Delete</b-form-radio
              >
              <b-form-radio v-model="selectedDelete" value="DELETE_ALL"
                >Delete all</b-form-radio
              >
            </b-form-group>

            <div class="mt-3"></div>

            <template #footer>
              <b-button
                class="button-my"
                :disabled="selectedRole > 0 ? false : true"
                @click="updatePrivilegeToUserRole"
                >Zapisz zmiany</b-button
              >
            </template>
          </b-card>
          <!-- </b-form> -->
        </b-card-group>
      </b-tab>
      <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
    </b-tabs>

    <!-- TEMP////////////////// -->

    <!-- ERROR -->
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key="error.ruleId">
        {{ error.message }}
      </li>
    </ul>

    <!-- The modal  ADD NEW ROLE-->
    <!-- :id="'role' + selectedUserID" -->
    <!-- @show="getRemainingRoles" -->
    <b-modal
      ref="roleModal"
      centered
      title="Dodaj nową rolę"
      @ok="addRoleToUser"
    >
      <!-- <b-textarea id="input-info" v-model="addRoleID"  rows="6" locale="pl" ></b-textarea> -->
      <div>
        <b-form-select
          v-model="selectedRemainingRole"
          :options="optionsRemainingRoles"
          required
        >
        </b-form-select>
        <div class="mt-3">
          Selected: <strong>{{ selectedRemainingRole }}</strong>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "UserProfile",
  data() {
    return {
      url: "http://localhost:8089",
      // url: "http://localhost:8082",
      // url: "https://docker.focikhome.synology.me",
      errors: [],
      user: {},
      idUser: 0,
      users: [],

      // Message
      msgSuccess: "succes",
      msgError: "error",
      dismissSecs: 3,
      dismissCountDownSuccess: 0,
      dismissCountDownError: 0,

      //Profile
      selectedUserID: 0,
      optionsUsers: [],
      userProfileIDTemp: {},
      optionsUserRoles: [],
      roles: [],
      optionsRemainingRoles: [],
      selectedRole: "",
      selectedRemainingRole: 0,
      statusCheckboxRead: false,
      selectedRead: "NULL",
      selectedWrite: "NULL",
      selectedDelete: "NULL",
      displayedPrivleges: [],

      // btn: selectedRole,
      temp: {},
      // checkReadNull: true,
    };
  },

  created() {
    this.idUser = this.$store.getters.getUserId;
    this.getUserFromDb(this.idUser);
    this.getUsersFromDb();
    this.getAllRolesFromDb();
  },
  // watch:{
  //   optionsUserRoles(newOptionsUserRoles, oldOptionsUserRoles){
  //     return this.optionsUserRoles;
  //   }
  // },
  methods: {
    //
    //------------------------------------------ MESSAGE ------------------------------------------
    //
    displaySmallMessage(variant = null, msg) {
      this.$bvToast.toast(`${msg}`, {
        title: "Informacja",
        variant: variant,
        solid: true,
      });
    },
    displayLargeMessage(variant = null, msg) {
      this.$bvToast.toast(`${msg}`, {
        title: "Informacja",
        variant: variant,
        solid: true,
        toaster: "b-toaster-top-full",
      });
    },

    //messages
    countDownChangedSuccess(dismissCountDown) {
      this.dismissCountDownSuccess = dismissCountDown;
    },
    showAlertSuccess(time) {
      this.dismissCountDownSuccess = time;
    },
    countDownChangedError(dismissCountDown) {
      this.dismissCountDownError = dismissCountDown;
    },
    showAlertError(time) {
      // this.dismissSec = time;
      this.dismissCountDownError = time;
    },
    //-----------------------------------         ROLE  -------------------------------------
    //
    //otwiera okno w którym można wybrać nową rolę
    //
    showRoleModal() {
      this.getRemainingRoles();
      if (this.optionsRemainingRoles.length > 0) {
        this.$refs["roleModal"].show();
      } else {
        this.displayLargeMessage(
          "warning",
          "W chwili obecnej nie ma więcej ról do dodania."
        );
      }
    },
    //
    // Pobiera pozostałe role czyli wsszystkie - role które użytkownik już ma
    //
    getRemainingRoles() {
      console.log("getRemainingRoles()");

      this.optionsRemainingRoles = [];

      const mapRoles = new Map();
      let tempRoles = [];

      this.roles.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        mapRoles.set(e.id, opt);
        tempRoles.push(opt);
      });
      //usuwanie posiadanych ról z mapy
      this.optionsUserRoles.forEach((role) => {
        tempRoles.forEach((roleOpt) => {
          if (roleOpt.text == role.text) {
            mapRoles.delete(role.value);
          }
        });
      });

      mapRoles.forEach((values, keys) => {
        this.optionsRemainingRoles.push(values);
      });

      //wybranie pierwszej z brzegu roli
      if (this.optionsRemainingRoles.length > 0) {
        this.selectedRemainingRole = this.optionsRemainingRoles[0].value;
      }
    },
    //
    //podczas zmiany roli odświerza uprawnienia dla roli
    //
    onRoleChange() {
      console.log("onRoleChange()");
      console.log("userID: " + this.selectedUserID);
      console.log("roleID: " + this.selectedRole);
      this.getPrivilegesByUserRoleDB(this.selectedUserID, this.selectedRole);
    },
    //
    //Podczas zmiany uzytkownika pobierane są z bazy jego role
    //
    onUserChange() {
      console.log("onUserChange()");
      if (this.selectedUserID > 0) {
        this.getUserRolesFromDb(this.selectedUserID);
        this.resetToRoleDefault();
      }
    },
    //
    //DOdanie nowej roli do użytkownika
    //
    addRoleToUser() {
      console.log("selectedUserID: " + this.selectedUserID);
      this.addRoleToUserDB(this.selectedUserID, this.selectedRemainingRole);
      //odświerzenie ról
      console.log(
        "ilość ról przed odświerzaniem: " + this.optionsUserRoles.length
      );

      //       this.getUserRolesFromDb(this.selectedUserID);
      console.log("ilość ról po odświerzaniu: " + this.optionsUserRoles.length);
      console.log(
        "ilość optionsRemainingRoles: " + this.optionsRemainingRoles.length
      );

      this.optionsRemainingRoles.forEach((roleOpt) => {
        if (roleOpt.value == this.selectedRemainingRole) {
          this.optionsUserRoles.push(roleOpt);
        }
      });
    },
    //
    //usuwanie roli użytkownika
    //
    deleteRoleFromUser() {
      console.log("deleteRoleFromUser(): start");
      this.deleteRoleFromUserDB(this.selectedUserID, this.selectedRole);
      //odswierzenie
      // this.optionsUserRoles=[];
      // this.onUserChange()
      // this.optionsUserRoles.push({
      //     value: 100,
      //     text: "test",
      //   })
    },
    //
    //aktualizacja uprawnień dla roli
    //
    updatePrivilegeToUserRole() {
      console.log("updatePrivilegeToUserRole(): start");
      let privileges = [
        {
          name: "read",
          value: this.selectedRead,
        },
        {
          name: "write",
          value: this.selectedWrite,
        },
        {
          name: "delete",
          value: this.selectedDelete,
        },
      ];
      this.updatePrivilegeToUserRoleDB(
        this.selectedUserID,
        this.selectedRole,
        privileges
      );
    },
    //------------------------------   USER  ------------------------------------------------
    updatePassword() {},
    ////////////////////////////////////POBIERANIE Z BAZY////////////////////////////////////
    //
    ////////////////////////////////////privileges////////////////////////////////////
    //
    //Pobieranie uprawnień dla konkretnej roli użytkownika
    //
    getPrivilegesByUserRoleDB(userID, roleID) {
      console.log("getPrivilegesByUserRoleDB() - start");
      console.log("userID: " + userID);
      console.log("roleID: " + roleID);
      // const token=this.$store.getters.getToken;
      let displayedPrivleges = [];
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        //   'Authorization': `Bearer ${token}`
      };

      const params = {
        userID: userID,
        roleID: roleID,
      };
      axios
        .get(this.url + `/api/user/role/details`, { params, headers })
        .then((response) => {
          displayedPrivleges = response.data;
          displayedPrivleges.forEach((priv) => {
            if (priv.name == "read") {
              this.selectedRead = priv.value;
            }
            if (priv.name == "write") {
              this.selectedWrite = priv.value;
            }
            if (priv.name == "delete") {
              this.selectedDelete = priv.value;
            }
          });
        })
        .catch((e) => {
          this.errors.push(e);
          this.validateError(e);
        });
    },
    //
    //zmiana uprawnień roli użytkownika
    //
    updatePrivilegeToUserRoleDB(userID, roleID, privileges) {
      console.log("updatePrivilegeToUserRoleDB() - start");
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        //   'Authorization': `Bearer ${token}`
      };

      const params = {
        userID: userID,
        roleID: roleID,
      };
      axios
        .put(this.url + `/api/user/role/details`, privileges, {
          params,
          headers,
        })
        .then((response) =>
          this.displaySmallMessage("success", "Zapisano uprawnienia dla roli.")
        )
        .catch((e) => {
          this.errors.push(e);
          this.validateError(e);
        });
    },
    deleteRoleFromUserDB(userID, roleID) {
      console.log("deleteRoleFromUserDB() - start");
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        //   'Authorization': `Bearer ${token}`
      };

      const params = {
        userID: userID,
        roleID: roleID,
      };
      axios
        .delete(this.url + `/api/user/role`, {
          params,
          headers,
        })
        .then((response) => {
          this.displaySmallMessage("success", "Usunięto rolę użytkownika.");
          this.resetToRoleDefault();
          this.getUserRolesFromDb(userID);
        })
        .catch((e) => {
          this.errors.push(e);
          this.validateError(e);
        });
    },
    //
    //get ALL ROLES from DB
    //
    getAllRolesFromDb() {
      console.log("getAllRolesFromDb() - start");
      // this.roles=[];
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //  'Authorization': `Bearer `+ this.$store.getters.token
        },
      };
      axios
        .get(this.url + `/api/user/role/`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getAllRolesFromDb(): " + response.data.length);
          this.roles = response.data;
          console.log("roles: " + this.roles.length);
        })

        .catch((e) => {
          this.errors.push(e);
        });
    },
    //
    //get user roles DB
    //
    getUserRolesFromDb(userID) {
      console.log("getUserRolesFromDb() - start");
      this.optionsUserRoles = [];
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //  'Authorization': `Bearer `+ this.$store.getters.token
        },
      };
      axios
        .get(this.url + `/api/user/role/` + userID, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getUserRolesFromDb(): " + response.data.length);
          if (response.data.length > 0)
            console.log(
              "convert " + response.data.length + " roles to options..."
            );
          response.data.forEach((e) => {
            let opt = {
              value: e.id,
              text: e.name,
            };
            this.optionsUserRoles.push(opt);
          });
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    //
    //add roles to user
    //
    addRoleToUserDB(userID, roleID) {
      console.log("addRoleToUserDB() - start");
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        //   'Authorization': `Bearer ${token}`
      };

      const params = {
        userID: userID,
        roleID: roleID,
      };
      axios
        .post(this.url + `/api/user/role/add`, null, { params, headers })
        .then((response) =>
          this.displaySmallMessage("success", "Dodano rolę do użytkownika.")
        )
        .catch((e) => {
          this.errors.push(e);
          this.validateError(e);
        });
    },
    resetToRoleDefault() {
      this.selectedRole = "";
      this.selectedRead = "NULL";
      this.selectedWrite = "NULL";
      this.selectedDelete = "NULL";
    },
    /////////////////////////////////UŻYTKOWNIK//////////////////////////////////////
    //
    //update user
    //
    updateUser(event) {
      event.preventDefault();
      // alert(JSON.stringify(this.user))
      console.log("updateUser() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ` + this.$store.getters.getToken,
        },
      };
      axios
        .put(this.url + `/api/user/update`, this.user, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.user = response.data;
          this.msgSuccess = "Zaaktualizowano profil użytkownika";
          this.showAlertSuccess(3);
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          console.log("after updateUser(): " + this.user);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    validateError(e) {
      console.log(
        "validating error: " +
          e.response.status +
          ", status: " +
          e.response.data.httpStatus +
          ", message: " +
          e.response.data.message
      );

      this.msgError =
        "error: " + e.response.status + ";    " + e.response.data.message;
      this.showAlertError(10);
    },

    //
    //get user from DB
    //
    getUserFromDb(userID) {
      console.log("getUserFromDb() - start, ID = " + userID);
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //  'Authorization': `Bearer `+ this.$store.getters.token
        },
      };
      axios
        .get(this.url + `/api/user/` + userID, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.user = response.data;
          console.log(
            "Odpowiedz HTTP: ${response.status}, ${response.statusText}"
          );
          console.log("getUserFromDb(): " + this.user);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    //
    //get users from DB
    //
    getUsersFromDb() {
      console.log("getUsersFromDb() - start");
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //  'Authorization': `Bearer `+ this.$store.getters.token
        },
      };
      axios
        .get(this.url + `/api/user/`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.users = response.data;
          console.log(
            "getUserFromDb(), znaleziono: " + this.optionsUsers.length
          );

          if (this.users.length > 0) {
            this.convertToOptionsUsers();
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    convertToOptionsUsers() {
      console.log("convert users to options...");
      this.users.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsUsers.push(opt);
        console.log(e.id + " " + e.lastName);
      });
    },
  },
};
</script>

<style>
.roles-group {
  color: #000;
}

.col-form-label {
  text-align-last: center;
}
.form-group {
  text-align-last: left;
}

/* .read-group {
  background-color: #26b4ff;
} */

.btn {
  cursor: pointer;
}

.button-my {
     background-color: rgba(255, 245, 0, 0.8) !important;
  color: #2c3e50 !important;
  border-color: rgb(108, 117, 125) !important;
  /* font-weight: bold; */
}

.button-my:hover {
  color: white  ;
  background-color: rgb(108, 117, 125) ;
 background-color: rgba(229, 230, 0, 0.883)!important;
}

.button-my:focus {
  outline: none  !important;
  box-shadow: none  !important;
}
</style>