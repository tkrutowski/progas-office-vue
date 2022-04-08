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

        <div class="form-group">
          <label class="form-label">Bierzące hasło</label>
          <input type="password" class="form-control" />
        </div>

        <div class="form-group">
          <label class="form-label">Nowe hasło</label>
          <input type="password" class="form-control" />
        </div>

        <div class="form-group">
          <label class="form-label">Powtórz nowe hasło</label>
          <input type="password" class="form-control" />
        </div>
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
              <!-- This slot appears above the options from 'options' prop -->
              <!-- <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- Wybierz pracownika --
                  </b-form-select-option>
                </template> -->
            </b-form-select>
          </label>
          Selected user: <strong>{{ selectedUserID }}</strong>
        </div>

        <h4>Uprawnienia użytkownika</h4>
        <b-card-group deck class="roles-group">
          <!-- <b-form @submit="addRoleToUser"> -->
          <b-card title="Title" header-tag="header" footer-tag="footer">
            <template #header>
              <h6 class="mb-0">Header Slot</h6>
            </template>
            <b-card-text>Header and footers using slots.</b-card-text>
            <div>
              <b-form-select
                v-model="selectedRole"
                :options="optionsUserRoles"
                :select-size="4"
                @change="onRoleChange"
              ></b-form-select>
              <div class="mt-3">
                Selected: <strong>{{ selectedRole }}</strong>
              </div>
            </div>
            <!-- <b-button @click="showRoleModal" variant="primary">Dodaj role</b-button> -->
              <!-- v-b-modal="'role' + selectedUserID" -->
            <b-button
              :disabled="selectedUserID > 0 ? false : true"
              variant="primary"
               @click="showRoleModal"
              >Dodaj role</b-button
            >
            <template #footer>
              <em>Footer Slot</em>
            </template>
          </b-card>
          <!-- </b-form> -->

          <!-- <b-form @submit="updatePrivilegeToUserRole"> -->
            <!-- CARD READ -->
            <b-card header-tag="header" footer-tag="footer">
              <template #header>
                <h4 class="mb-0">Uprawnienia dla roli ...</h4>
              </template>
              <b-card-text><h3>Odczyt</h3></b-card-text>
              <!-- <b-card-text>Uprawnienia do odczytu</b-card-text> -->
              <b-form-group label="Uprawnienia do odczytu">
                <b-form-radio v-model="selectedRead" value="NULL"
                checked="checkReadNull"
                  >None</b-form-radio
                >
                <b-form-radio v-model="selectedRead" value="READ"
                  >Read</b-form-radio
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

              <!-- <b-card-text>Uprawnienia do zapisu</b-card-text> -->
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
              <hr />

              <div class="mt-3">
                Selected read: <strong>{{ selectedRead }}</strong> Selected
                write: <strong>{{ selectedWrite }}</strong> Selected delete:
                <strong>{{ selectedDelete }}</strong>
              </div>

              <template #footer>
                <em>Footer Slot</em>
                <b-button
                  href="#"
                  :disabled="selectedRole > 0 ? false : true"
                  variant="primary"
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

    <!-- ERROR -->
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key="error.ruleId">
        {{ error.message }}
      </li>
    </ul>

    <div>
      <b-button @click="showAlertSuccess" variant="info" class="m-1">
        Show alert with count-down timer
      </b-button>
    </div>

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
    this.getUserFromDb();
    this.getUsersFromDb();
    this.getAllRolesFromDb();
  },
  methods: {
    //
    //TOAST MESSAGE
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
        toaster: "b-toaster-top-full"
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
    //
    //role
    //
      showRoleModal() {
        this.getRemainingRoles();
        if(this.optionsRemainingRoles.length > 0){
        this.$refs['roleModal'].show()
        }else{
           this.displayLargeMessage("warning", "W chwili obecnej nie ma więcej ról do dodania.")
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
      if( this.optionsRemainingRoles.length >0){
      this.selectedRemainingRole = this.optionsRemainingRoles[0].value;
      }
    },
    //
    //podczas zmiany roli odświerza uprawnienia dla roli
    //
    onRoleChange() {
      console.log("onRoleChange()");
      console.log("userID: "+this.selectedUserID);
      console.log("roleID: "+this.selectedRole);
      this.getPrivilegesByUserRoleDB(this.selectedUserID, this.selectedRole);
    },
    //
    //Podczas zmiany urzytkownika pobierane są z bazy jego role
    //
    onUserChange() {
      console.log("onUserChange()");
      this.getUserRolesFromDb(this.selectedUserID);
    },
    //
    //DOdanie nowej roli do użytkownika
    //
    addRoleToUser() {
       console.log("selectedUserID: "+this.selectedUserID);
      this.addRoleToUserDB(this.selectedUserID, this.selectedRemainingRole);
      //odświerzenie ról
       console.log("ilość ról przed odświerzaniem: "+this.optionsUserRoles.length);

      //       this.getUserRolesFromDb(this.selectedUserID);
       console.log("ilość ról po odświerzaniu: "+this.optionsUserRoles.length);
       console.log("ilość optionsRemainingRoles: "+this.optionsRemainingRoles.length);

 this.optionsRemainingRoles.forEach((roleOpt) => {
          if (roleOpt.value == this.selectedRemainingRole) {
              this.optionsUserRoles.push(roleOpt);
          }
        });
    },
    //
    //aktualizacja uprawnień dla roli
    //
    updatePrivilegeToUserRole(){
             console.log("updatePrivilegeToUserRole(): start");
      let privileges = [
       {
          name : "read",
       value : this.selectedRead
       },
         {
          name : "write",
       value : this.selectedWrite
       },
         {
          name : "delete",
       value : this.selectedDelete
       }
      ]
       this.updatePrivilegeToUserRoleDB(this.selectedUserID, this.selectedRole,privileges)
    },

    ////////////////////////////////////POBIERANIE Z BAZY////////////////////////////////////
    //
    ////////////////////////////////////privileges////////////////////////////////////
    //
    //Pobieranie uprawnień dla konkretnej roli użytkownika
    //
    getPrivilegesByUserRoleDB(userID, roleID) {
        console.log("getPrivilegesByUserRoleDB() - start");
          console.log("userID: "+userID);
      console.log("roleID: "+roleID);
      // const token=this.$store.getters.getToken;
      let displayedPrivleges = [];
      const 
        headers = {
          "Content-type": "application/json; charset=UTF-8",
          //   'Authorization': `Bearer ${token}`
        };
      
        const params = {
          userID: userID,
          roleID: roleID        
        }    ;
      axios
        .get(this.url + `/api/user/role/details`, {params, headers})
        .then((response) => {displayedPrivleges = response.data;
         displayedPrivleges.forEach((priv) => {
          if (priv.name == "read") {
            this.selectedRead=priv.value;
          };
               if (priv.name == "write") {
            this.selectedWrite=priv.value;
          };
               if (priv.name == "delete") {
            this.selectedDelete=priv.value;
          }
        })
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
      const 
        headers = {
          "Content-type": "application/json; charset=UTF-8",
          //   'Authorization': `Bearer ${token}`
        };
      
      const params = 
         {
          userID: userID,
          roleID: roleID,
      };
      axios
        .put(this.url + `/api/user/role/details`, privileges, {params, headers})
        .then((response) => this.displaySmallMessage('success', "Zapisano uprawnienia dla roli."))
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
            console.log("convert "+response.data.length+" roles to options...");
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
      const 
        headers = {
          "Content-type": "application/json; charset=UTF-8",
          //   'Authorization': `Bearer ${token}`
        };
      
      const params = 
         {
          userID: userID,
          roleID: roleID,
        
      };
      axios
        .post(this.url + `/api/user/role/add`, null, {params, headers})
        .then((response) => this.displaySmallMessage('success', "Dodano rolę do użytkownika."))
        .catch((e) => {
             this.errors.push(e);
             this.validateError(e);
        });
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
    getUserFromDb() {
      console.log("getUserFromDb() - start");
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          //  'Authorization': `Bearer `+ this.$store.getters.token
        },
      };
      axios
        .get(this.url + `/api/user/` + this.idUser, header)
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

.read-group {
  background-color: #26b4ff;
}

.read-chb-group {
  border-style: solid;
  color: #000;
}

body {
  background: #f5f5f5;
  margin-top: 20px;
}

.ui-w-80 {
  width: 80px !important;
  height: auto;
}

.btn-default {
  border-color: rgba(24, 28, 33, 0.1);
  background: rgba(0, 0, 0, 0);
  color: #4e5155;
}

label.btn {
  margin-bottom: 0;
}

.btn-outline-primary {
  border-color: #26b4ff;
  background: transparent;
  color: #26b4ff;
}

.btn {
  cursor: pointer;
}

.text-light {
  color: #babbbc !important;
}

.btn-facebook {
  border-color: rgba(0, 0, 0, 0);
  background: #3b5998;
  color: #fff;
}

.btn-instagram {
  border-color: rgba(0, 0, 0, 0);
  background: #000;
  color: #fff;
}

.card {
  background-clip: padding-box;
  box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
  overflow: hidden;
}
</style>