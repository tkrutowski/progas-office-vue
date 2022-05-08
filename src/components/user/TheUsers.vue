<template>
  <b-container fluid id="container">
    <b-row class="mt-5">
      <b-col>

        <!-- --------------------------------- TABELA ---------------------------------- -->
        <b-table :busy="isBusy" :items="usersListDisplay" :fields="fields" :tbody-tr-class="rowClass" id="table"
          responsive="sm" thead-tr-class="table-bg text-dark">
          <template #cell(status)="row">
            <!-- ---------------------------- Status icons -------------------------------- -->
            <div>
              <!-- Enabled -->
              <b-button v-if="row.item.enabled" size="sm" variant="outline"
                @click="setActiveUser(row.item, row.index, $event.target)">
                <b-icon class="pr-4 pt-1" scale="1.3" icon="toggle-on" variant="success" aria-hidden="true"></b-icon>
              </b-button>
              <b-button v-else size="sm" variant="outline" @click="setActiveUser(row.item, row.index, $event.target)">
                <b-icon class="pr-4" scale="1.3" icon="toggle-off" variant="danger" aria-hidden="true"></b-icon>
              </b-button>
              <!-- Lock -->
              <b-button v-if="row.item.notLocked" size="sm" variant="outline"
                @click="setLockUser(row.item, row.index, $event.target)">
                <b-icon scale="1.1" icon="unlock-fill" variant="success" aria-hidden="true"></b-icon>
              </b-button>
              <b-button v-else size="sm" variant="outline" @click="setLockUser(row.item, row.index, $event.target)">
                <b-icon scale="1.1" icon="lock-fill" variant="danger" aria-hidden="true"></b-icon>
              </b-button>
            </div>
          </template>

          <!-- ----------------------------------AKCJA --------------------------------- -->
          <template #cell(action)="row">
            <b-button-group>
              <!-- EDIT -->
              <b-button size="sm" @click="editUser(row.item, row.index, $event.target)" class="mr-2" variant="progas">
                Edit
              </b-button>
              <!-- DELETE -->
              <b-button size="sm" @click="deleteUser(row.item, row.index, $event.target)" class="mr-2 bg-danger">
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>
        </b-table>
      </b-col>

      <!-- ----------------------------------SIDE CARD --------------------------------- -->
      <b-col cols="12" md="auto" class="mb-3">
        <b-card id="card-info" bg-variant="dark" header-tag="header">
          <template #header>
            <b-button variant="progas" @click="addUser">Nowy użytkownik</b-button>
          </template>

          <b-card-text class="text-left pl-3 mb-1">Wszyscy / {{ calculateAll }}</b-card-text>
          <b-card-text class="text-left pl-3 mb-1 color-green">Aktywni / {{ calculateActive }}</b-card-text>
          <b-card-text class="text-left pl-3 mb-1 color-red">Nieaktywni / {{ calculateNotActive }}</b-card-text>
          <b-card-text class="text-left pl-3 mb-1 color-green">Odblokowani / {{ calculateUnLock }}</b-card-text>
          <b-card-text class="text-left pl-3 color-red">Zablokowani / {{ calculateLock }}</b-card-text>
          <!-- <div class="text-center px-xl-3"> -->
          <!-- </div> -->
          <hr class="my-4" style="color:yellow;background-color:yellow" />

          <b-form-group label="Wyświetl:">
            <b-form-radio v-model="selectedDisplay" class="pb-1" value="ALL" @change="displayRadio($event)">Wszystkie
            </b-form-radio>
            <b-form-radio v-model="selectedDisplay" class="color-green pb-1" value="ACTIVE"
              @change="displayRadio($event)">Aktywne</b-form-radio>
            <b-form-radio v-model="selectedDisplay" class="color-red pb-1" value="DISABLED"
              @change="displayRadio($event)">Wyłączone</b-form-radio>
            <b-form-radio v-model="selectedDisplay" class="color-green pb-1" value="UNLOCK"
              @change="displayRadio($event)">Odblokowane</b-form-radio>
            <b-form-radio v-model="selectedDisplay" class="color-red" value="LOCK" @change="displayRadio($event)">
              Zablokowane</b-form-radio>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <!-- <router-link to="/user/profile">Do profilu</router-link> -->

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
import router from "@/router";
import {errorMixin} from "@/mixins/error"
import {userMixin} from "@/mixins/user"
export default {
  name: "Users",
    mixins : [errorMixin, userMixin],
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "Id",
        },
        {
          key: "firstName",
          label: "Imie",
        },
        {
          key: "lastName",
          label: "Nazwisko",
          sortable: true
        },
        {
          key: "username",
          label: "Login",
        },
        {
          key: "email",
          label: "E-mail",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "action",
          label: "Akcja",
        },
      ],
      isBusy: false,
      usersList: [],
      usersListDisplay: [],
      selectedDisplay: "ALL",
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  computed: {

    calculateAll() {
      return this.usersList.length;
    },
    calculateActive() {
      let count = 0;
      this.usersList.forEach((user) => {
        if (user.enabled == true) {
          count++;
        }
      });
      return count;
    },
    calculateNotActive() {
      let count = 0;
      this.usersList.forEach((user) => {
        if (user.enabled == false) {
          count++;
        }
      });
      return count;
    },
    calculateLock() {
      let count = 0;
      this.usersList.forEach((user) => {
        if (user.notLocked == false) {
          count++;
        }
      });
      return count;
    },
    calculateUnLock() {
      let count = 0;
      this.usersList.forEach((user) => {
        if (user.notLocked == true) {
          count++;
        }
      });
      return count;
    }

  },
  created() {
    this.getUsersFromDb();
  },
  methods: {
    rowClass(item, type) {
      // if (!item || type !== 'row') return
      //if (item.isHoliday === true) return "table-dark";
      return "color-progas-yellow"
    },
    
    //-------------------------------------------DISPLAY-------------------------------------------
    displayRadio(event) {
      console.log("DisplayRadio(): " + event);
      if (event == "ALL") {
        this.usersListDisplay = [];
        this.usersList.forEach((user) => {
          this.usersListDisplay.push(user);
        });
      }
      if (event == "ACTIVE") {
        this.usersListDisplay = [];
        this.usersList.forEach((user) => {
          if (user.enabled == true) {
            this.usersListDisplay.push(user);
          }
        });
      }

      if (event == "DISABLED") {
        this.usersListDisplay = [];
        this.usersList.forEach((user) => {
          if (user.enabled == false) {
            this.usersListDisplay.push(user);
          }
        });
      }

      if (event == "LOCK") {
        this.usersListDisplay = [];
        this.usersList.forEach((user) => {
          if (user.notLocked == false) {
            this.usersListDisplay.push(user);
          }
        });
      }

      if (event == "UNLOCK") {
        this.usersListDisplay = [];
        this.usersList.forEach((user) => {
          if (user.notLocked == true) {
            this.usersListDisplay.push(user);
          }
        });
      }
    },
    //-------------------------------------------USER-------------------------------------------
    //
    //delete user
    //
    deleteUser(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      // this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć użytkownika: ${item.firstName} ${item.lastName}?`,
          {
            title: "Potwierdzenie",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "TAK",
            cancelTitle: "NIE",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            this.deleteUserDB(item.id);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    //
    //edit user
    //
    editUser(item, index, button) {
      console.log("Edycja id: " + item.id);
      let data = {
        id: item.id,
        edit: true,
      };
      router.push({
        name: "User",
        params: { idUser: item.id, isEdit: "true" },
      });
      //  router.push({ name: 'User', params: {data}})
    },
     //
    //add user
    //
    addUser() {
      console.log("Add user()");
      router.push({
        name: "User",
           params: { idUser: 0, isEdit: "false" },
      });
    },
    //
    //set user active/inactive
    //
    setActiveUser(item, index, button) {
      console.log("user id: " + item.id + ", isEnabled: " + item.enabled);
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz zmienić status użytkownika: 
        ${item.firstName} ${item.lastName} na ${!item.enabled}?`,
          {
            title: "Potwierdzenie",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "TAK",
            cancelTitle: "NIE",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            this.setActiveUserDb(item.id, !item.enabled);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    //
    //set user lock/unlock
    //
    setLockUser(item, index, button) {
      console.log("user id: " + item.id + ", isLock: " + item.notLocked);
      let lock = item.notLocked ? "zablokować" : "odblokować";

      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz  ${lock} konto użytkownika: 
        ${item.firstName} ${item.lastName}?`,
          {
            title: "Potwierdzenie",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "TAK",
            cancelTitle: "NIE",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            this.setLockUserDb(item.id, !item.notLocked);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    //---------------------------------------------DB---------------------------------------
    //
    //get users
    //
    getUsersFromDb() {
      console.log("getUsersFromDb() - start");
        const headers = {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': "Bearer "+ this.$store.getters.getToken
      };
      axios
        .get(this.urlUser + `/api/user`, {headers})
        .then((response) => {
          // JSON responses are automatically parsed.
          this.usersList = response.data;
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          console.log(
            "getUsersFromDb() - Ilosc usersList[]: " + this.usersList.length
          );
          //wyświetla tabele
          this.displayRadio(this.selectedDisplay);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //
    //delete USER from db
    //
    deleteUserDB(userID) {
      console.log("deleteUserDB() - start");
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': "Bearer "+ this.$store.getters.getToken
      };

      axios
        .delete(this.urlUser + `/api/user/delete/` + userID, {
          headers,
        })
        .then((response) => {
          this.displaySmallMessage("success", "Usunięto użytkownika.");
          this.getUsersFromDb(userID);
        })
        .catch((e) => {
          this.errors.push(e);
          this.validateError(e);
        });
    },
    //
    //update IsEnabled
    //
    setActiveUserDb(userID, isEnabled) {
      console.log("updateUser() - start");
      console.log("user id: " + userID + ", isEnabled: " + isEnabled);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           Authorization: "Bearer "+ this.$store.getters.getToken
        },
      };
      const params = {
        enabled: isEnabled,
      };
      axios
        .put(this.urlUser + `/api/user/update/active/` + userID, null, {
          params,
          header,
        })
        .then((response) => {
          // JSON responses are automatically parsed.
          this.user = response.data;
          this.displaySmallMessage("success", "Zaaktualizowano użytkownika.");
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          this.getUsersFromDb();
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //
    //update IsLock
    //
    setLockUserDb(userID, isLock) {
      console.log("setLockUserDb() - start");
      let lock = isLock ? "Odblokowano" : "Zablokowano";
      console.log("user id: " + userID + ", isLock: " + isLock);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer "+ this.$store.getters.getToken,
        },
      };
      const params = {
        lock: isLock,
      };
      axios
        .put(this.urlUser + `/api/user/update/lock/` + userID, null, {
          params,
          header,
        })
        .then((response) => {
          // JSON responses are automatically parsed.
          this.user = response.data;
          this.displaySmallMessage("success", lock + " konto użytkownika.");
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          this.getUsersFromDb();
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
  },
};
</script>

<style scoped>
#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

#card-info {
  width: 200px;
}

#table {
  color: rgba(255, 245, 0, 0.8);
}

/deep/.table-bg {
  background-color: rgba(255, 245, 0, 0.8);
  /* color: rgb(97, 93, 92); */
}
</style>