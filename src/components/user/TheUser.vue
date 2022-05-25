<template>
  <b-container id="container">
    <b-card
      :title="isEdit == 'false' ? 'Dodawanie nowego użytkownika' : 'Edycja użytkownia'"
      bg-variant="dark"
    >
      <b-form @submit.stop.prevent="saveUser" autocomplete="off">
        <div class="row">
          <!-- EMPLOYEE? -->
          <b-form-group
            v-if="isEdit == 'false'"
            class="col"
            description="Zaznacz, jeżeli nowy użytkownik jest pracownikiem firmy."
          >
            <b-form-checkbox
              v-model="isEmployee"
              name="checkbox-employee"
              checked="isEmployee"
              switch
              class="pb-1"
              @change="employeeClear"
            >
              Pracownik firmy
            </b-form-checkbox>

            <b-form-select
              v-model="selectedEmployeeID"
              :options="optionsEmployees"
              class=""
              id="select-employee"
              @change="onEmployeeChange"
              :disabled="!isEmployee"
              required
            >
            </b-form-select>
          </b-form-group>
        </div>
        <div class="row">
          <!-- FIRSTNAME -->
          <b-form-group class="col" label="Imię:" label-for="input-firstname">
            <b-form-input
              id="input-firstname"
              v-model="user.firstName"
              :state="validationUserFirstName"
              placeholder=""
              required
              autofocus
            ></b-form-input>
            <b-form-invalid-feedback :state="validationUserFirstName">
              Imię nie może być puste i nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- LASTNAME -->
          <b-form-group class="col" label="Nazwisko:" label-for="input-lastname">
            <b-form-input
              id="input-lastname"
              v-model="user.lastName"
              :state="validationUserLastName"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationUserLastName">
              Nazwisko nie może być puste i nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- EMAIL -->
        <b-form-group label="Email adres:" label-for="input-mail">
          <b-form-input
            id="input-mail"
            v-model="user.email"
            type="email"
            placeholder="Enter email"
            required
            :state="validationEmail"
          ></b-form-input>
          <b-form-invalid-feedback :state="validationEmail">
            Email nie może być puste i nie może mieć więcej niż 50 znaków.
          </b-form-invalid-feedback>
        </b-form-group>

        <div class="row">
          <!-- USERNAME -->
          <b-form-group class="col" label="Login:" label-for="input-username">
            <b-form-input
              id="input-username"
              v-model="user.username"
              :state="validationUserName"
              placeholder=""
              autocomplete="off"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationUserName">
              Login nie może być puste i nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- PASSWORD -->
          <b-form-group v-if="isEdit == 'false'" class="col" label="Hasło:" label-for="input-pass">
            <b-form-input
              id="input-pass"
              v-model="user.password"
              :state="validationPassword"
              placeholder=""
              type="password"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationPassword">
              HAsło musi mieć powyżej 8 znaków.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationPassword"> OK. </b-form-valid-feedback>
          </b-form-group>

          <!-- CONFIRM PASSWORD -->
          <b-form-group
            v-if="isEdit == 'false'"
            class="col"
            label="Potwierdź hasło:"
            label-for="input-pass-confirm"
          >
            <b-form-input
              id="input-pass-confirm"
              v-model="confirmPassword"
              :state="validationConfirmPassword"
              placeholder=""
              type="password"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationConfirmPassword">
              HAsła muszą być identyczne.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validationConfirmPassword"> OK. </b-form-valid-feedback>
          </b-form-group>
        </div>

        <b-form-group>
          <b-form-checkbox
            v-model="user.enabled"
            name="checkbox-enabled"
            checked="user.enabled"
            switch
          >
            Aktywny
          </b-form-checkbox>

          <b-form-checkbox
            v-model="user.isNotLocked"
            name="checkbox-isNotLocked"
            value="false"
            unchecked-value="true"
            switch
          >
            Zablokowany
          </b-form-checkbox>
        </b-form-group>

        <b-button class="px-5" variant="progas" type="submit">Zapisz</b-button>
      </b-form>
      <template #footer> </template>
    </b-card>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { userMixin } from "@/mixins/user";
import { employeeMixin } from "@/mixins/employee";
export default {
  name: "User",
  mixins: [errorMixin, userMixin, employeeMixin],
  data() {
    return {
      idUser: 0,
      isEdit: false,
      // user: {
      //   id: 0,
      //   firstName: "",
      //   lastName: "",
      //   password: "",
      //   email: "",
      //   username: "",
      //   enabled: true,
      //   notLocked: true,
      //   idEmployee: 0
      // },
      confirmPassword: "",
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      //employee
      selectedEmployeeID: 0,
      optionsEmployees: [],
      isEmployee: false,
    };
  },
  mounted() {
    let idTemp = this.$route.params.idUser;
    this.isEdit = this.$route.params.isEdit;
    console.log("TempID: " + idTemp + ", edit: " + this.$route.params.isEdit);
    this.idUser = idTemp;
    this.getUserifEdit();
  },
  created() {
    this.getEmployees();
  },
  computed: {
    validationUserFirstName() {
      return this.user.firstName.length > 0 && this.user.firstName.length < 50;
    },
    validationUserLastName() {
      return this.user.lastName.length > 0 && this.user.lastName.length < 50;
    },
    validationUserName() {
      return this.user.username.length > 0 && this.user.username.length < 50;
    },
    validationEmail() {
      return (
        this.user.email.length > 0 && this.user.email.length < 50 && this.user.email.includes("@")
      );
    },
    validationPassword() {
      return this.user.password.length > 7 && this.user.password.length < 250;
    },
    validationConfirmPassword() {
      return this.user.password === this.confirmPassword && this.confirmPassword.length > 0;
    },
  },
  methods: {
    //-------------------------------------------EMPLOYEE-------------------------------------------
    //
    //Podczas zmiany uzytkownika pobierane są z bazy jego role
    //
    onEmployeeChange() {
      console.log("onEmployeeChange()");
      if (this.selectedEmployeeID > 0) {
        this.getEmployeeByID(this.selectedEmployeeID);
        this.user.idEmployee = this.selectedEmployeeID;
      }
    },
    employeeClear() {
      this.user.firstName = "";
      this.user.lastName = "";
      this.user.email = "";
      this.selectedEmployeeID = 0;
    },
    //
    //get users from DB
    //
    getEmployees() {
      console.log("getEmployee() - start");
      const employees = this.getEmployeesFromDb("HIRED");

      if (employees.length > 0) {
        this.convertToOptionsEmployees(employees);
      }
    },
    getEmployeeByID(employeeID) {
      console.log("getEmployeeByID() - start, ID = " + employeeID);

      let employee = this.getEmployeeFromDb(employeeID);
      this.user.firstName = employee.firstName;
      this.user.lastName = employee.lastName;
      this.user.email = employee.email == null ? "" : employee.email;
      this.user.idEmployee = employee.id;
    },
    convertToOptionsEmployees(emp) {
      console.log("convert employees to options...");
      emp.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsEmployees.push(opt);
        console.log(e.id + " " + e.lastName);
      });
    },
    //-------------------------------------------USER-------------------------------------------

    //
    //zapisuje użytkownika
    //
    saveUser() {
      if (this.isEdit == "true") {
        if (
          this.validationUserFirstName &&
          this.validationUserLastName &&
          this.validationUserName &&
          this.validationEmail
        ) {
          this.updateUserDb();
          // router.push('/user/all')
        } else {
          this.displaySmallMessage("warning", "Niepoprawne dane użytkownika.");
        }
      } else {
        if (
          this.validationUserFirstName &&
          this.validationUserLastName &&
          this.validationUserName &&
          this.validationEmail &&
          this.validationPassword &&
          this.validationConfirmPassword
        ) {
          this.addUserDB();
        } else {
          this.displaySmallMessage("warning", "Niepoprawne dane użytkownika.");
        }
      }
    },
    //
    //pobiera użytkownika do edycji
    //
    getUserifEdit() {
      console.log("getUserifEdit()) - start, ID = " + this.idUser);
      if (this.isEdit == "true") {
        this.getUserFromDb(this.idUser);
      }
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    resetForm() {
      this.user.id = 0;
      this.user.firstName = "";
      this.user.lastName = "";
      this.user.password = "";
      this.user.email = "";
      this.user.username = "";
      this.user.enabled = true;
      this.user.notLocked = true;
      this.selectedEmployeeID = 0;
      this.user.idEmployee = 0;
      this.confirmPassword = "";
      this.isEmployee = false;
    },
    //------------------------------------------EMPLOYEE DB--------------------------------------------------
    //  //
    // //get users from DB
    // //
    // getEmployeesFromDb() {
    //   console.log("getEmployeeFromDb() - start");
    //   const header = {
    //     headers: {
    //       "Content-type": "application/json; charset=UTF-8",
    //       // 'Authorization': "Bearer "+ this.$store.getters.getToken
    //     },
    //   };
    //   axios
    //     .get(this.urlUser + `/api/employee/query?status=HIRED`, header)
    //     .then((response) => {
    //       // JSON responses are automatically parsed.
    //       const employees = response.data;
    //       console.log("getEmployeeFromDb(), znaleziono: " + employees.length);

    //       if (employees.length > 0) {
    //         this.convertToOptionsEmployees(employees);
    //       }
    //     })
    //     .catch((e) => {
    //       this.validateError(e);
    //     });
    // },

    //
    //get employee from DB
    //
    // getEmployeeFromDb(employeeID) {
    //   console.log("getEmployeeFromDb() - start, ID = " + employeeID);
    //   const header = {
    //     headers: {
    //       "Content-type": "application/json; charset=UTF-8",
    //       //'Authorization': "Bearer "+ this.$store.getters.getToken
    //     },
    //   };
    //   axios
    //     .get(this.urlUser + `/api/employee/query/` + employeeID, header)
    //     .then((response) => {
    //       console.log("Odpowiedz HTTP: " + response.status + ", " + response.statusText);
    //       let employee = response.data;
    //       this.user.firstName = employee.firstName;
    //       this.user.lastName = employee.lastName;
    //       this.user.email = employee.email == null ? "":employee.email;
    //       this.user.idEmployee = employee.id;
    //     })
    //     .catch((e) => {
    //       this.validateError(e);
    //     });
    // },
  },
};
</script>

<style scoped>
@import "@/assets/css/main.css";

#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

#table {
  color: rgba(255, 245, 0, 0.8);
}
</style>
