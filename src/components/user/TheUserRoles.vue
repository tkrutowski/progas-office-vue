<template>
  <div class="container">

        <h3 class="mt-2">Uprawnienia użytkownika</h3>
        <!--                    User-->
        <div>
          <label class="form-label mt-3 max-width" for="select-user">
            Wybierz użytkownika:
            <b-form-select  v-model="selectedUserID" :options="optionsUsers" class="mb-5 " id="select-user"
              @change="onUserChange" required>
            </b-form-select>
          </label>
        </div>

        <!-- ------------------- CARD ROLES ------------------------>
        <b-card-group deck class="roles-group">
          <b-card header-tag="header" footer-tag="footer"  bg-variant="dark" >
            <template #header>
              <h4 class="mb-0 text-progas">Role</h4>
            </template>
            <b-card-text class="text-progas">Wybierz role do edycji lub dodaj nową.</b-card-text>
            <div >
              <b-form-select id="select-role" v-model="selectedRole" :options="optionsUserRoles" :select-size="20"
              
                @change="onRoleChange"></b-form-select>
              <div class="mt-3"></div>
            </div>

            <template #footer>

              <b-button class="mr-2 text-dark" :disabled="selectedRole > 0 ? false : true" variant="danger" @click="deleteRoleFromUser">Usuń
                role</b-button>
              <b-button class="button-my" :disabled="selectedUserID > 0 ? false : true" variant="progas"
                @click="showRoleModal">Dodaj role</b-button>
            </template>
          </b-card>

          <!-- ------------------- CARD PRIVILEGES ------------------------>
          <b-card header-tag="header" footer-tag="footer"  bg-variant="dark" class="text-progas">
            <template #header>
              <h4 class="mb-0">Uprawnienia dla roli</h4>
            </template>
            <b-card-text >
              <h3>Odczyt</h3>
            </b-card-text>
            <!-- <b-card-text>Uprawnienia do odczytu</b-card-text> -->
            <b-form-group label="Uprawnienia do odczytu">
              <b-form-radio v-model="selectedRead" value="NULL" :disabled="selectedRole > 0 ? false : true">None</b-form-radio>
              <b-form-radio v-model="selectedRead" value="READ" :disabled="selectedRole > 0 ? false : true">Read</b-form-radio>
              <b-form-radio v-model="selectedRead" value="READ_ALL" :disabled="selectedRole > 0 ? false : true">Read all</b-form-radio>
            </b-form-group>
            <hr />
            <!-- <b-card-text>Uprawnienia do zapisu</b-card-text> -->
            <b-card-text>
              <h3>Zapis</h3>
            </b-card-text>
            <b-form-group label="Uprawnienia do odczytu">
              <b-form-radio v-model="selectedWrite" value="NULL" :disabled="selectedRole > 0 ? false : true">None</b-form-radio>
              <b-form-radio v-model="selectedWrite" value="WRITE" :disabled="selectedRole > 0 ? false : true">Write</b-form-radio>
              <b-form-radio v-model="selectedWrite" value="WRITE_ALL" :disabled="selectedRole > 0 ? false : true">Write all</b-form-radio>
            </b-form-group>
            <hr />

            <!-- <b-card-text>Uprawnienia do usuwania</b-card-text> -->
            <b-card-text>
              <h3>Usuwanie</h3>
            </b-card-text>
            <b-form-group label="Uprawnienia do usuwania">
              <b-form-radio v-model="selectedDelete" value="NULL" :disabled="selectedRole > 0 ? false : true">None</b-form-radio>
              <b-form-radio v-model="selectedDelete" value="DELETE" :disabled="selectedRole > 0 ? false : true">Delete</b-form-radio>
              <b-form-radio v-model="selectedDelete" value="DELETE_ALL" :disabled="selectedRole > 0 ? false : true">Delete all</b-form-radio>
            </b-form-group>

            <div class="mt-3"></div>

            <template #footer>
              <b-button variant="progas" :disabled="selectedRole > 0 ? false : true" @click="updatePrivilegeToUserRole">
                Zapisz zmiany</b-button>
            </template>
          </b-card>
          <!-- </b-form> -->
        </b-card-group>

    <b-modal ref="roleModal" centered title="Dodaj nową rolę" @ok="addRoleToUser"
    header-bg-variant="dark" header-text-variant="progas"
    body-bg-variant="dark" body-text-variant="progas"
    footer-bg-variant="dark" footer-text-variant="progas"
    ok-title="Dodaj" ok-variant="progas"
    cancel-title="Anuluj">
      <div>
        <b-form-select id="select-new-role" v-model="selectedRemainingRole" :options="optionsRemainingRoles" required>
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
import router from "@/router";
export default {
  name: "UserRoles",
  data() {
    return {
      url: "http://localhost:8089",
      // url: "http://localhost:8082",
      // url: "https://docker.focikhome.synology.me",
  
  
      idUser: 0,
      users: [],

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

    };
  },

  created() {
    // this.idUser = this.$store.getters.getUserId;
    // this.getUserFromDb(this.idUser);
    this.getUsersFromDb();
    this.getAllRolesFromDb();
  },
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

    //-----------------------------------         ROLE  -------------------------------------
    //
    //otwiera okno w którym można wybrać nową rolę
    //
    showRoleModal() {
      this.getRemainingRoles();
      if (this.optionsRemainingRoles.length > 0) {
        this.$refs["roleModal"].show();
      } else {
        this.displayLargeMessage("warning", "W chwili obecnej nie ma więcej ról do dodania.");
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
      this.updatePrivilegeToUserRoleDB(this.selectedUserID, this.selectedRole, privileges);
    },
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
        'Authorization': "Bearer "+ this.$store.getters.getToken
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
        'Authorization': "Bearer "+ this.$store.getters.getToken
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
        .then((response) => this.displaySmallMessage("success", "Zapisano uprawnienia dla roli."))
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
       'Authorization': "Bearer "+ this.$store.getters.getToken
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
          'Authorization': "Bearer "+ this.$store.getters.getToken
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
         this.validateError(e);
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
          'Authorization': "Bearer "+ this.$store.getters.getToken
        },
      };
      axios
        .get(this.url + `/api/user/role/` + userID, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getUserRolesFromDb(): " + response.data.length);
          if (response.data.length > 0)
            console.log("convert " + response.data.length + " roles to options...");
          response.data.forEach((e) => {
            let opt = {
              value: e.id,
              text: e.name,
            };
            this.optionsUserRoles.push(opt);
          });
        })
        .catch((e) => {
         this.validateError(e);
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
       'Authorization': "Bearer "+ this.$store.getters.getToken
      };

      const params = {
        userID: userID,
        roleID: roleID,
      };
      axios
        .post(this.url + `/api/user/role/add`, null, { params, headers })
        .then((response) => this.displaySmallMessage("success", "Dodano rolę do użytkownika."))
        .catch((e) => {
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
    //get users from DB
    //
    getUsersFromDb() {
      console.log("getUsersFromDb() - start");
      console.log("token: "+ this.$store.getters.getToken);
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           'Authorization': "Bearer "+ this.$store.getters.getToken
        },
      };
      axios
        .get(this.url + `/api/user/`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.users = response.data;
          console.log("getUserFromDb(), znaleziono: " + this.optionsUsers.length);

          if (this.users.length > 0) {
            this.convertToOptionsUsers();
          }
        })
        .catch((e) => {
          this.validateError(e);
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
     validateError(e) {
      console.log(
        "validating error: " +
        e.response.status +
        ", status: " +
        e.response.data.httpStatus +
        ", message: " +
        e.response.data.message
      );

      let msgError =
        "error: " + e.response.status + ";    " + e.response.data.message;
       this.displayLargeMessage("danger", msgError);
      if(e.response.status == 401){
        router.push('/login');
      }
    },


  },   
};
</script>

<style scoped>
@import "@/assets/css/main.css";
#select-role {
    color: rgba(255, 245, 0, 0.8);
    background-color:#343a40;
}

#select-user {
    color: rgba(255, 245, 0, 0.8);
     background-color:#343a40;
}

#select-new-role {
    color: rgba(255, 245, 0, 0.8);
    background-color:#343a40;
}

</style>
