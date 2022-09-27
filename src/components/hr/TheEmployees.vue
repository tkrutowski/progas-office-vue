<template>
  <b-container fluid id="container">
    <b-row class="mt-5">
      <b-col>
        <!-- --------------------------------- TABELA ---------------------------------- -->
        <b-table
          striped
          small
          :busy="isBusy"
          :items="employeesListDisplay"
          :fields="fields"
          :tbody-tr-class="rowClass"
          id="table"
          responsive="sm"
          thead-tr-class="table-bg text-dark"
        >
          <!-- ICON BUSY -->
          <template #table-busy>
            <div class="text-center text-progas my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>

          <!-- COLORING DATES  -->
          <template v-slot:cell(nextMedicalExaminationDate)="{ item }">
            <div
              :class="{
                'time-is-almost-up': isBeforeNow(item.nextMedicalExaminationDate) == 'true',
                'time-is-up': isAfterNow(item.nextMedicalExaminationDate) == 'true',
              }"
            >
              {{ item.nextMedicalExaminationDate }}
            </div>
          </template>
          <template v-slot:cell(nextBhpTrainingDate)="{ item }">
            <div
              :class="{
                'time-is-almost-up': isBeforeNow(item.nextBhpTrainingDate) == 'true',
                'time-is-up': isAfterNow(item.nextBhpTrainingDate) == 'true',
              }"
            >
              {{ item.nextBhpTrainingDate }}
            </div>
          </template>

          <template #cell(status)="row">
            <!-- ---------------------------- Status icons -------------------------------- -->
            <div>
              <!-- Enabled -->
              <b-button
                v-if="row.item.employmentStatus == 'HIRED'"
                size="sm"
                variant="outline"
                @click="setEmploymentStatus(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4 pt-1"
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
                @click="setEmploymentStatus(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4"
                  scale="1.3"
                  icon="toggle-off"
                  variant="danger"
                  aria-hidden="true"
                ></b-icon>
              </b-button>
            </div>
          </template>

          <!-- ----------------------------------AKCJA --------------------------------- -->
          <template #cell(action)="row">
            <b-button-group>
              <!-- RATE -->
              <b-button
                v-if="hasAccessRateRead"
                size="sm"
                @click="showEmployeeRate(row.item, row.index, $event.target)"
                class="mr-2 bg"
                variant="progas"
                title="Stawka"
              >
                <b-icon icon="credit-card" aria-hidden="true"></b-icon>
              </b-button>
              <!-- DETAILS -->
              <b-button
                size="sm"
                @click="row.toggleDetails"
                variant="progas"
                class="mr-2"
                title="Rozwiń szczegóły"
              >
                <b-icon icon="three-dots" aria-hidden="true"></b-icon>
              </b-button>
              <!-- EDIT -->
              <b-button
                v-if="hasAccessEmployeeWrite"
                size="sm"
                @click="editEmployee(row.item, row.index, $event.target)"
                class="mr-2"
                variant="progas"
                title="Edycja pracownika"
              >
                Edit
              </b-button>
              <!-- DELETE -->
              <b-button
                v-if="hasAccessEmployeeDelete"
                size="sm"
                @click="deleteEmployee(row.item, row.index, $event.target)"
                class="mr-2 bg-danger"
                title="Usuń pracownika"
              >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>

          <!-- --------------------DETAILS----------------------- -->
          <template #row-details="row">
            <b-card id="details">
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-left">Pesel: {{ row.item.pesel }}</b-col>
                <!-- <b-col>{{ row.item.pesel }}</b-col> -->
                <b-col sm="3" class="text-sm-left">Inne info: {{ row.item.otherInfo }}</b-col>
                <!-- <b-col>{{ row.item.pesel }}</b-col> -->
              </b-row>

              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-left"
                  >Data zatrudnienia: {{ row.item.hiredDate }}</b-col
                >
                <!-- <b-col>{{ row.item.hiredDate }}</b-col> -->
                <b-col sm="3" class="text-sm-left"
                  >Data zwolnienia: {{ row.item.releaseDate }}</b-col
                >
                <!-- <b-col>{{ row.item.releaseDate }}</b-col> -->
              </b-row>
            </b-card>
          </template>
        </b-table>
      </b-col>

      <!-- ----------------------------------SIDE CARD --------------------------------- -->
      <b-col cols="12" md="auto" class="mb-3">
        <b-card id="card-info" bg-variant="dark" header-tag="header">
          <template #header>
            <b-button variant="progas" @click="newEmployee">Nowy pracownik</b-button>
          </template>

          <b-card-text class="text-left pl-3 mb-1">Wszyscy / {{ calculateAll }}</b-card-text>
          <b-card-text class="text-left pl-3 mb-1 color-green"
            >Zatrudnieni / {{ calculateHired }}</b-card-text
          >
          <b-card-text class="text-left pl-3 mb-1 color-red"
            >Zwolnieni / {{ calculateFired }}</b-card-text
          >
          <!-- <div class="text-center px-xl-3"> -->
          <!-- </div> -->
          <hr class="my-4" style="color: yellow; background-color: yellow" />

          <b-form-group label="Wyświetl:">
            <b-form-radio
              v-model="selectedDisplay"
              class="pb-1"
              value="ALL"
              @change="displayRadio($event)"
              >Wszystkie
            </b-form-radio>
            <b-form-radio
              v-model="selectedDisplay"
              class="color-green pb-1"
              value="HIRED"
              @change="displayRadio($event)"
              >Zatrudnieni</b-form-radio
            >
            <b-form-radio
              v-model="selectedDisplay"
              class="color-red pb-1"
              value="FIRED"
              @change="displayRadio($event)"
              >Zwolnieni</b-form-radio
            >
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <!-- MODAL - RATE -->
    <b-modal
      ref="employeeRateModal"
      centered
      title="Stawka pracownika"
      header-bg-variant="dark"
      header-text-variant="progas"
      body-bg-variant="dark"
      body-text-variant="progas"
      footer-bg-variant="dark"
      footer-text-variant="progas"
      ok-title="Zamknij"
      ok-variant="progas"
      ok-only
    >
      <div>
        <p><b>Stawka podstawowa:</b></p>
        <p>
          {{ rateRegular.rateValue }}
          <span>{{ rateRegular.rateType == "PER_HOUR" ? "zł/h" : "zł/mc" }}</span>
          od {{ convertRateDate(rateRegular.dateFrom) }}
        </p>

        <p><b>Stawka nadgodzinowa:</b></p>
        <p>{{ rateOvertime.rateValue }} zł/h od {{ convertRateDate(rateOvertime.dateFrom) }}</p>
      </div>
    </b-modal>
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>
<script>
import router from "@/router";
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
import { errorMixin } from "@/mixins/error";
import { employeeMixin } from "@/mixins/employee";
import moment from "moment";
import { rateMixin } from "@/mixins/rate";
export default {
  name: "Employees",
  mixins: [errorMixin, employeeMixin, rateMixin],
  data() {
    return {
      timeAlmostUp: 30,
      fields: [
        // {
        //   key: "id",
        //   label: "Id",
        // },
        {
          key: "firstName",
          label: "Imie",
        },
        {
          key: "lastName",
          label: "Nazwisko",
          sortable: true,
        },
        {
          key: "street",
          label: "Ulica",
          isActive: true,
        },
        {
          key: "city",
          label: "Miasto",
          isActive: false,
        },
        {
          key: "zip",
          label: "Kod",
        },
        {
          key: "numberDaysOffLeft",
          label: "Urlop",
        },
        {
          key: "numberDaysOffAnnually",
          label: "Wymiar urlopu",
        },
        {
          key: "telNumber",
          label: "Telefon",
        },
        {
          key: "email",
          label: "E-mail",
        },

        {
          key: "nextMedicalExaminationDate",
          label: "Nast. badania",
        },
        {
          key: "nextBhpTrainingDate",
          label: "Nast. szkolenie BHP",
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
      employeeList: [],
      employeesListDisplay: [],
      selectedDisplay: "HIRED",
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  created() {
    this.getAllEmployees();
    moment.locale("pl");
  },
  computed: {
      ...mapGetters(["getToken"]),
       hasAccessRateRead() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_RATE_READ_ALL: " + token2.authorities.includes('HR_RATE_READ_ALL'))
        return (
          token2.authorities.includes("HR_RATE_READ_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        // return false;
        return true;
        }
    },
       hasAccessEmployeeWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_EMPLOYEE_WRITE_ALL: " + token2.authorities.includes('HR_EMPLOYEE_WRITE_ALL'))
        return (
          token2.authorities.includes("HR_EMPLOYEE_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        //  return false;
        return true;
      }
    },
     hasAccessEmployeeDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_EMPLOYEE_DELETE_ALL: " + token2.authorities.includes('HR_EMPLOYEE_DELETE_ALL'))
        return (
          token2.authorities.includes("HR_EMPLOYEE_DELETE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    calculateAll() {
      return this.employeeList.length;
    },
    calculateHired() {
      let count = 0;
      this.employeeList.forEach((emp) => {
        if (emp.employmentStatus == "HIRED") {
          count++;
        }
      });
      return count;
    },
    calculateFired() {
      let count = 0;
      this.employeeList.forEach((emp) => {
        if (emp.employmentStatus == "FIRED") {
          count++;
        }
      });
      return count;
    },
  },
  methods: {
    rowClass(item, type) {
      // if (!item || type !== 'row') return
      //if (item.isHoliday === true) return "table-dark";
      return "color-progas-yellow";
    },

    isAfterNow(date) {
      var now = moment();
      var date = moment(date);
      let result = date.diff(now, "days");
      if (result < 0 ) return "true";
      else return "false";
    },

    isBeforeNow(date) {
      var now = moment();
      var date = moment(date);
      let result = date.diff(now, "days");
      if (result >= 0 && result < this.timeAlmostUp) return "true";
      else return "false";
    },

    convertRateDate(date){
      return moment(date).format("MMMM YYYY");
    },
    getAllEmployees() {
      this.isBusy = true;
      this.getEmployeesFromDb("ALL").then((response) => {
        this.employeeList = response.data;
        //wyświetla tabele
        this.displayRadio(this.selectedDisplay);
        this.isBusy = false;
      });
    },
    //
    //add new employee
    //
    newEmployee() {
      console.log("newEmployee()");
      if(this.hasAccessEmployeeWrite){
        router.push({
          name: "TheEmployee",
        params: { idEmployee: 0, isEdit: "false" },
      });
        }else
         this.displaySmallMessage("danger", "Nie masz uprawnień do dodawania pracowników.");
    },

    //
    //edit employee
    //
    editEmployee(item, index, button) {
      console.log("editEmployee(): " + item.id);
      router.push({
        name: "TheEmployee",
        params: { idEmployee: item.id, isEdit: "true" },
      });
    },
    //
    //delete employee
    //
    deleteEmployee(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      // this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      this.$bvModal
        .msgBoxConfirm(`Czy chcesz usunąć pracownika:\n ${item.firstName} ${item.lastName}?`, {
          title: "Potwierdzenie",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "TAK",
          cancelTitle: "NIE",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.deleteEmployeeDB(item.id).then((response) => {
              this.getAllEmployees();
              this.displaySmallMessage("success", "Usunięto pracownika.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
     //
    //Display rate in separate window
    //
    showEmployeeRate(item, index, button) {
      this.getRateRegularFromDb(item.id).then((response) => {
        // console.log(JSON.stringify(response.data));
        this.rateRegular = response.data;
         this.getRateOvertimeFromDb(item.id).then((response) => {
        // console.log(JSON.stringify(response.data));
        this.rateOvertime = response.data;
        this.$refs["employeeRateModal"].show();
      });
      });
    },
    //
    //set employment status hired/fired
    //
    setEmploymentStatus(item, index, button) {
      console.log("setEmploymentStatus id: " + item.id + ", status: " + item.employmentStatus);
       if(this.hasAccessEmployeeWrite){
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz zmienić status pracownika:
        ${item.firstName} ${item.lastName} na
         ${item.employmentStatus == "HIRED" ? "ZWOLNIONY" : "ZATRUDNIONY"}?`,
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
          // console.log(value);
          if (value) {
            this.setEmploymentStatusDb(
              item.id,
              item.employmentStatus == "HIRED" ? "FIRED" : "HIRED"
            ).then((response) => {
              this.getAllEmployees();
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
         }else
         this.displaySmallMessage("danger", "Nie masz uprawnień do zmiany statusu pracownika.");
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    //-------------------------------------------DISPLAY-------------------------------------------
    displayRadio(event) {
      console.log("DisplayRadio(): " + event);
      if (event == "ALL") {
        this.employeesListDisplay = [];
        this.employeeList.forEach((emp) => {
          this.employeesListDisplay.push(emp);
        });
      }
      if (event == "HIRED") {
        this.employeesListDisplay = [];
        this.employeeList.forEach((emp) => {
          if (emp.employmentStatus == "HIRED") {
            this.employeesListDisplay.push(emp);
          }
        });
      }

      if (event == "FIRED") {
        this.employeesListDisplay = [];
        this.employeeList.forEach((emp) => {
          if (emp.employmentStatus == "FIRED") {
            this.employeesListDisplay.push(emp);
          }
        });
      }
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

.b-table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  color: white;
  background-color: rgba(229, 200, 0, 0.883) !important;
}

.b-table-hover > tbody > tr:nth-child(odd) > td,
.b-table:hover {
  background-color: red; /* Choose your own color here */
}
#details {
  background-color: #343a40;
  border-block-color: rgba(255, 245, 0, 0.8);
  color: rgba(255, 245, 0, 0.8);
}
/deep/.table-bg {
  background-color: rgba(255, 245, 0, 0.8);
  /* color: rgb(97, 93, 92); */
}
</style>
