<template>
  <b-container id="container">
    <b-row class="mt-5 center">
      <div>
        <label for="date">Wybierz datę:</label>
        <div style="display: flex; justify-content: space-between">
          <b-form-select
            v-model="month"
            :options="months"
            class="mb-3"
            id="date"
            style="width: 45%"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template #first>
              <b-form-select-option :value="null" disabled>
                -- Wybierz miesiąc --
              </b-form-select-option>
            </template>
          </b-form-select>
          <b-form-select v-model="year" :options="years" class="mb-3" style="width: 45%">
            <!-- This slot appears above the options from 'options' prop -->
            <template #first>
              <b-form-select-option :value="null" disabled>
                -- Wybierz rok --
              </b-form-select-option>
            </template>
          </b-form-select>
        </div>
      </div>
    </b-row>
    <b-row>
      <p>
        <b-button variant="progas" class="ml-3 mr-2" size="sm" @click="selectAllRows"
          >Zaznacz wszystko</b-button
        >
        <b-button variant="progas" size="sm" @click="clearSelected">Odznacz wszystko</b-button>
      </p>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <!-- --------------------------------- TABELA ---------------------------------- -->
        <b-table
          striped
          small
          :busy="isBusy"
          :items="employeeList"
          :fields="fields"
          :tbody-tr-class="rowClass"
          id="table"
          responsive="sm"
          thead-tr-class="table-bg text-dark"
          ref="selectableTable"
          @row-selected="onRowSelected"
          selectable
        >
          <!-- ICON BUSY -->
          <template #table-busy>
            <div class="text-center text-progas my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <!-- wybrany wiersz -->
          <template #cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <span aria-hidden="true">&check;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template>
        </b-table>
        <p>
          Selected Rows:<br />
          {{ selectedEpmloyee }}
        </p>
      </b-col>
    </b-row>
    <b-row class="mt-5 center">
      <label class="pr-2" for="print">Wybierz rodzaj wydruku:</label>
      <!-- <div > -->
      <b-form-select v-model="selectedPrint" :options="printOpt" id="print" style="width: 45%">
        <!-- This slot appears above the options from 'options' prop -->
        <template #first>
          <b-form-select-option :value="null" disabled>
            -- Wybierz rodzaj wydruku --
          </b-form-select-option>
        </template>
      </b-form-select>
      <!-- </div> -->
      <b-button variant="progas" class="ml-2" @click="onCreatePdfClick" :disabled="btnDisabled"
        >Pobierz
        <b-icon
          v-if="startIcon"
          class="pl-2"
          scale="1.6"
          icon="download"
          variant="success"
          aria-hidden="true"
        ></b-icon>
        <b-icon
          v-if="savedIcon"
          class="pl-2"
          scale="2.6"
          icon="check"
          variant="success"
          aria-hidden="true"
        ></b-icon>
        <b-icon
          v-if="errorIcon"
          class="pl-2"
          scale="1.6"
          icon="x-circle"
          variant="danger"
          aria-hidden="true"
        ></b-icon>
        <b-icon
          v-if="busyIcon"
          icon="arrow-clockwise"
          animation="spin-pulse"
          font-scale="1"
        ></b-icon>
      </b-button>
    </b-row>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>
<script>
import axios from "axios";
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
        {
          key: "selected",
          label: "Wybrany",
        },
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
          key: "employeeType",
          label: "Stanowisko",
          sortable: true,
        },
        {
          key: "workTime",
          label: "Etat",
          sortable: true,
        },
      ],
      months: [
        { value: "01", text: "styczeń" },
        { value: "02", text: "luty" },
        {
          value: "03",
          text: "marzec",
        },
        { value: "04", text: "kwiecień" },
        { value: "05", text: "maj" },
        { value: "06", text: "czerwiec" },
        { value: "07", text: "lipiec" },
        { value: "08", text: "sierpień" },
        {
          value: "09",
          text: "wrzesień",
        },
        { value: "10", text: "październik" },
        { value: "11", text: "listopad" },
        {
          value: "12",
          text: "grudzień",
        },
      ],
      selectedPrint: "ATTENDANCE",
      printOpt: [
        {
          value: "ATTENDANCE",
          text: "Lista obecności",
        },
        {
          value: "TIME_SHEET",
          text: "Ewidencja czasu pracy",
        },
        {
          value: "SALARY_SHEET",
          text: "Kartki do wypłaty",
        },
        {
          value: "WORK_SHEET",
          text: "Karta pracy",
          disabled: true,
        },
      ],
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      isBusy: false,
      employeeList: [],
      selectedEpmloyee: [],
      month: moment().format("MM"),
      year: moment().format("YYYY"),

      startIcon: true,
      busyIcon: false,
      savedIcon: false,
      btnDisabled: false,
      errorIcon: false,

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
  methods: {
    rowClass(item, type) {
      // if (!item || type !== 'row') return
      //if (item.isHoliday === true) return "table-dark";
      return "color-progas-yellow";
    },

    convertRateDate(date) {
      return moment(date).format("MMMM YYYY");
    },

    getAllEmployees() {
      this.isBusy = true;
      this.getEmployeesPrintFromDb("HIRED").then((response) => {
        this.employeeList = response.data;
        this.isBusy = false;
      });
    },

    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    onRowSelected(items) {
      this.selectedEpmloyee = items;
    },

    onCreatePdfClick() {
      console.log("onCreatePdfClick(): " + this.selectedEpmloyee);
      if (this.selectedEpmloyee.length > 0) {
        console.log("selected ilosc: " + this.selectedEpmloyee.length);
        let ids = [];
        this.selectedEpmloyee.forEach((element) => {
          // console.log(JSON.stringify(element));
          ids.push(element.id);
        });
        this.getPdfFromDB(ids, this.year, this.month, this.selectedPrint);
      } else {
        this.$bvModal
          .msgBoxOk(`Musisz wybrać przynajmniej jednego pracownika.`, {
            title: "Informacja",
            size: "sm",
            buttonSize: "sm",
            okVariant: "progas",
            okTitle: "OK",

            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          })
          .then((value) => {})
          .catch((err) => {
            // An error occurred
          });
      }
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    changeStatusIcon(start, busy, save, error) {
      this.busyIcon = busy;
      this.errorIcon = error;
      this.savedIcon = save;
      this.startIcon = start;
    },

    //--------------------------------- PRINT DB -------------------------------

    //
    //get pdf
    //
    getPdfFromDB(employeeIdList, year, month, printWhat) {
      console.log("START - getPdfFromDB()");
      this.changeStatusIcon(false, true, false, false);
      this.btnDisabled = true;
      // console.log("selected employee: " + this.selectedEmployee);
      // const header = {
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8",
      //     Authorization: "Bearer " + this.$store.getters.getToken,
      //   },
      // };
      let postConfig = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
        responseType: "blob",
      };

      let firstUtl = "";
      if (printWhat === "SALARY_SHEET") {
        firstUtl = "/api/employee/salary";
      } else {
        firstUtl = "/api/employee/worktime";
      }
      let url =
        this.urlEmpl +
        firstUtl +
        "/print?idEmployees=" +
        employeeIdList +
        "&date=" +
        this.year +
        "-" +
        this.month +
        "-01&print=" +
        printWhat;
      console.log("URL - " + url);
      return axios
        .get(url, postConfig)
        .then((response) => {
          console.log("END - getPdfFromDB()");
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          let url = printWhat + "_" + month + "_" + year + ".pdf";
          fileLink.href = fileURL;
          fileLink.setAttribute("download", url);
          document.body.appendChild(fileLink);
          this.changeStatusIcon(false, false, true, false);
          this.btnDisabled = false;

          setTimeout(() =>this.changeStatusIcon(true, false, false, false), 10000);

          fileLink.click();
        })
        .catch((e) => {
          this.changeStatusIcon(false, false, false, true);
          this.btnDisabled = false;
          setTimeout(() =>this.changeStatusIcon(true, false, false, false), 10000);
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

.center {
  display: inline-block;
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
