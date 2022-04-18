<template>
  <b-container fluid id="container">
    <b-row>
      <b-col class="mt-5">
        <b-table
          :busy="isBusy"
          :items="usersList"
          :fields="fields"
          :tbody-tr-class="rowClass"
          id="table"
        >
          <template #cell(status)="row">
            <div>
              <b-button
                v-if="row.item.enabled"
                size="sm"
                variant="outline"
                @click="setActiveUser(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4"
                  scale="1.3"
                  icon="toggle-on"
                  variant="success"
                  aria-hidden="true"
                ></b-icon>
              </b-button>
              <b-button
                v-else
                size="sm"
                variant="outline"
                @click="setActiveUser(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4"
                  scale="1.3"
                  icon="toggle-off"
                  variant="danger"
                  aria-hidden="true"
                ></b-icon>
              </b-button>
              <!-- <b-button size="sm" variant="outline" @click="deleteUser(row.item, row.index, $event.target)" class="mr-2"> -->
              <b-icon
                class="pl-3"
                scale="1.3"
                icon="lock-fill"
                variant="danger"
                aria-hidden="true"
              ></b-icon>
              <!-- </b-button> -->
            </div>
          </template>
          <template #cell(action)="row">
            <b-button-group>
              <b-button
                size="sm"
                @click="editUser(row.item, row.index, $event.target)"
                class="mr-2"
              >
                Edit
              </b-button>

              <b-button
                size="sm"
                @click="deleteUser(row.item, row.index, $event.target)"
                class="mr-2 bg-danger"
              >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" md="auto" class="mb-3" co>
        <div class="card" id="card-info">
          <div class="card-body">
            <div class="text-center px-xl-3">
              <b-button href="/user/add">Nowy użytkownik</b-button>
              <button
                class="btn btn-success btn-block"
                type="button"
                data-toggle="modal"
                data-target="#user-form-modal"
              >
                New User
              </button>
            </div>
            <hr class="my-3" />
            <div class="e-navlist e-navlist--active-bold">
              <ul class="nav">
                <li class="nav-item active">
                  <a href="" class="nav-link"
                    ><span>All</span>&nbsp;<small>/&nbsp;32</small></a
                  >
                </li>
                <li class="nav-item">
                  <a href="" class="nav-link"
                    ><span>Active</span>&nbsp;<small>/&nbsp;16</small></a
                  >
                </li>
                <li class="nav-item">
                  <a href="" class="nav-link"
                    ><span>Selected</span>&nbsp;<small>/&nbsp;0</small></a
                  >
                </li>
              </ul>
            </div>
            <hr class="my-3" />
            <div>
              <div class="form-group">
                <label>Date from - to:</label>
                <div>
                  <input
                    id="dates-range"
                    class="form-control flatpickr-input"
                    placeholder="01 Dec 17 - 27 Jan 18"
                    type="text"
                    readonly="readonly"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>Search by Name:</label>
                <div>
                  <input
                    class="form-control w-100"
                    type="text"
                    placeholder="Name"
                    value=""
                  />
                </div>
              </div>
            </div>
            <hr class="my-3" />
            <div class="">
              <label>Status:</label>
              <div class="px-2">
                <div class="custom-control custom-radio">
                  <input
                    type="radio"
                    class="custom-control-input"
                    name="user-status"
                    id="users-status-disabled"
                  />
                  <label
                    class="custom-control-label"
                    for="users-status-disabled"
                    >Disabled</label
                  >
                </div>
              </div>
              <div class="px-2">
                <div class="custom-control custom-radio">
                  <input
                    type="radio"
                    class="custom-control-input"
                    name="user-status"
                    id="users-status-active"
                  />
                  <label class="custom-control-label" for="users-status-active"
                    >Active</label
                  >
                </div>
              </div>
              <div class="px-2">
                <div class="custom-control custom-radio">
                  <input
                    type="radio"
                    class="custom-control-input"
                    name="user-status"
                    id="users-status-any"
                    checked=""
                  />
                  <label class="custom-control-label" for="users-status-any"
                    >Any</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <router-link to="/user/profile">Do profilu</router-link>
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key="error.ruleId">
        {{ error.message }}
      </li>
    </ul>

  
    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
import router from "@/router";
export default {
  name: "Users",
  data() {
    return {
      url: "http://localhost:8089",
      // url: "http://localhost:8082",
      // url: "https://docker.focikhome.synology.me",
      errors: [],
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

      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },

  created() {
    this.getUsersFromDb();
  },
  methods: {
    rowClass(item, type) {
      // if (!item || type !== 'row') return
      if (item.isHoliday === true) return "table-dark";
      // if (item.isHoliday === true) return "worktime1"
      // if (item.isHoliday === true) return {
      //     classes: 'worktime-table',
      //     css: {"color": "blue"}
      // }
    },
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
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
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
            // this.displaySmallMessage("success", "Usunięto użytkownika.");
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
      // const id = item.id;
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
    //---------------------------------------------DB---------------------------------------
    //
    //get users
    //
    getUsersFromDb() {
      console.log("getUsersFromDb() - start");
      axios
        .get(this.url + `/api/user`)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.usersList = response.data;
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          console.log(
            "getUsersFromDb() - Ilosc usersList[]: " + this.usersList.length
          );
        })
        .catch((e) => {
          this.errors.push(e);
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
        //   'Authorization': `Bearer ${token}`
      };

      axios
        .delete(this.url + `/api/user/delete/` + userID, {
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
          // Authorization: `Bearer ` + this.$store.getters.getToken,
        },
      };
      const params = {
        enabled: isEnabled,
      };
      axios
        .put(this.url + `/api/user/update/active/` + userID, null, {
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
    //error
    //
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
    },
  },
};
</script>

<style>
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
</style>