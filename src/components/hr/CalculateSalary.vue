<template>
  <div>
    <b-container fluid="" id="container">
      <h1>Obliczanie wypłat</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-container id="dateSwitch">
        <b-row align-h="center">
          <div>
            <label class="form-label" for="employee">Wybierz pracownika: </label>
            <div style="display: flex">
              <b-form-select v-model="selected" :options="options" class="mb-3" id="employee">
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    -- Wybierz pracownika --
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-button
                v-if="loadingEmployee"
                style="height: fit-content"
                variant="progas"
                class="ml-3"
                disabled
              >
                <b-spinner small></b-spinner>
                <span class="sr-only">Loading...</span>
              </b-button>
            </div>
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

            <b-button
              class="mt-3"
              style="width: 100px"
              variant="progas"
              @click="calculateSalary"
              :disabled="btnDisabled"
              >Oblicz
              <b-icon
                v-if="busyIcon"
                icon="arrow-clockwise"
                animation="spin-pulse"
                font-scale="1"
              ></b-icon>
            </b-button>
          </div>
        </b-row>

        <b-row class="mt-5">
          <!--obliczanie wypłąt lewa-->
          <div class="col-md-4 mb-5" style="float: left">
            <div class="main">
              <p class="text">Godziny urlopowe (płatne):</p>
              <p class="value">{{ salary.dayOffWorkTimePay }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny urlopowe (bezpłatne):</p>
              <p class="value">{{ salary.dayOffWorkTimeFree }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny chorobowe (80%):</p>
              <p class="value">{{ salary.illnessWorkTime80 }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny chorobowe (100%):</p>
              <p class="value">{{ salary.illnessWorkTime100 }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny przepracowane:</p>
              <p class="value">{{ salary.workRegularWorkTime }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny nadliczbowe (50%):</p>
              <p class="value">{{ salary.workOvertimeWorkTime50 }}</p>
            </div>
            <div class="main">
              <p class="text">Godziny nadliczbowe (100%):</p>
              <p class="value">{{ salary.workOvertimeWorkTime100 }}</p>
            </div>
            <div class="main">
              <p class="text">Suma godzin:</p>
              <p class="value">{{ salary.workTimeAll }}</p>
            </div>
          </div>

          <!--obliczanie wypłąt środek-->
          <div class="col-md-4 mb-5" style="float: left">
            <div class="main">
              <p class="text">Za godziny:</p>
              <p class="value">{{ salary.forRegularRate }}</p>
            </div>
            <div class="main">
              <p class="text">Za nadgodziny 50%:</p>
              <p class="value">{{ salary.forOvertime50 }}</p>
            </div>
            <div class="main">
              <p class="text">Za nadgodziny 100%:</p>
              <p class="value">{{ salary.forOvertime100 }}</p>
            </div>
            <div class="main">
              <p class="text">Za urlop:</p>
              <p class="value">{{ salary.forDayOff }}</p>
            </div>
            <div class="main">
              <p class="text">Za zasiłek (80%):</p>
              <p class="value">{{ salary.forIllness80 }}</p>
            </div>
            <div class="main">
              <p class="text">Za zasiłek (100%):</p>
              <p class="value">{{ salary.forIllness100 }}</p>
            </div>
            <div class="main">
              <p class="text">Razem:</p>
              <p class="value">{{ salary.forAll }}</p>
            </div>
          </div>

          <!-- obliczenia wypłat prawa               -->
          <div class="col-md-4 mb-5" style="float: left">
            <div class="main">
              <p class="text">Normatywny czas pracy:</p>
              <p class="value">...</p>
            </div>
            <div class="main">
              <p class="text">Pozostało urlopu:</p>
              <p class="value">...</p>
            </div>
            <div class="main">
              <p class="text">Do oddania (pożyczka):</p>
              <p class="value">...</p>
            </div>
            <div class="main">
              <p class="text">Zaliczki:</p>
              <p class="value">{{ salary.advancesSum }}</p>
            </div>
            <div class="main">
              <p class="text">Dodatki:</p>
              <p class="value">{{ salary.additionsSum }}</p>
            </div>
            <div class="main">
              <p class="text">Pożyczki:</p>
              <p class="value">{{ salary.loanInstallmentSum }}</p>
            </div>
            <div class="main">
              <p class="text">Stawka:</p>
              <p class="value">...</p>
            </div>
            <div class="main">
              <p class="text">Stawka nadgodzinowa:</p>
              <p class="value">...</p>
            </div>
            <div class="main" style="font-size: 25px">
              <p class="text">Do wypłaty:</p>
              <p class="value">{{ salary.forAll }}</p>
            </div>
          </div>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { employeeMixin } from "@/mixins/employee";
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
export default {
  name: "CalculateSalary",
  mixins: [errorMixin, employeeMixin],
  data() {
    return {
      busyIcon: false,
      btnDisabled: false,
      loadnig: false,
      employees: [],
      options: [],
      salaryDate: moment(),
      errors: [],
      selected: null,
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
      years: [2020, 2021, 2022, 2023, 2024],
      salary: {
        advancesSum: "...",
        additionsSum: "...",
        loanInstallmentSum: "...",
        forRegularRate: "...",
        forOvertime50: "...",
        forOvertime100: "...",
        forDayOff: "...",
        forIllness80: "...",
        forIllness100: "...",
        forAll: "...",
        dayOffWorkTimePay: "...",
        dayOffWorkTimeFree: "...",
        illnessWorkTime80: "...",
        illnessWorkTime100: "...",
        workRegularWorkTime: "...",
        workOvertimeWorkTime50: "...",
        workOvertimeWorkTime100: "...",
        workTimeAll: "...",
      },
      month: moment().format("MM"),
      year: moment().format("YYYY"),
    };
  },
  created() {
    this.getEmployees("HIRED");
    moment.locale("pl");
    // this.months=moment.months();
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("HR_SALARIES_READ_ALL") || token2.authorities.includes("ROLE_ADMIN");
      } catch (error) {
        return false;
      }
    },
    hasRead() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("HR_SALARIES_READ");
      } catch (error) {
        return false;
      }
    },
  },
  methods: {
    //
    //Oblicza wypłate
    //
    calculateSalary() {
      if (this.selected == null) {
        // this.displaySmallMessage("warning", "Musisz wybrać pracownika!") ;
        this.displayLargeMessage("warning", "Musisz wybrać pracownika!");
      } else {
        this.busyIcon = true;
        this.btnDisabled = true;
        this.getSalaryFromDb();
      }
    },

    convertToOptionsEmployee() {
      console.log("convert to options...");
      this.employees.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.options.push(opt);
        // console.log(e.id + " " + e.lastName);
      });
    },
    //-------------------------------------------------- DB----------------------------------------------------------

    getSalaryFromDb() {
      console.log("getSalaryFromDb() - start ");
      let url =
        this.urlEmpl +
        "/api/employee/salary/" +
        this.selected +
        "?date=" +
        this.year +
        "-" +
        this.month +
        "-01";
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(url, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.salary = response.data;
          this.busyIcon = false;
          this.btnDisabled = false;
        })
        .catch((e) => {
          this.busyIcon = false;
          this.btnDisabled = false;
          this.validateError(e);
        });
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
  /*align-content: start;*/
  margin: 10px;
}

.text {
  margin-right: 5px;
}

#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

#dateSwitch {
  /*margin-top: 25px;*/
  padding-top: 25px;
}

.value {
  font-weight: bold;
  /*font-size: 20px;*/
  color: darkgrey;
}
</style>
