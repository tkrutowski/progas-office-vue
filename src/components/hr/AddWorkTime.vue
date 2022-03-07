<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie godzin</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-row align-h="center">
        <b-col>
          <!--                    Pracownik-->
          <div>
            <label class="form-label mt-5 max-width" for="employeeSelect">
              Wybierz pracownika:
              <b-form-select
                v-model="selectedEmployee"
                :options="optionsEmployee"
                class="mb-5"
                id="employeeSelect"
                @change="onEmployeeChange"
                required
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- Wybierz pracownika --
                  </b-form-select-option>
                </template>
              </b-form-select>
            </label>
          </div>

          <!--                    Data-->
          <div>
            <label for="date" class="max-width"
              >Wybierz datę:
              <b-form-datepicker
                class="mb-5"
                id="date"
                v-model="workTimeDateString"
                locale="pl"
                placeholder="Wybierz datę"
                @context="onContext"
                style="width: 100%"
              >
              </b-form-datepicker>
            </label>
          </div>

          <!--                     PRACA                       -->
          <b-row>
            <b-col>
              <div class="form-check">
                <label class="form-check-label mb-3" for="rbWork">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="rbWork"
                    checked
                    @click="rbWork_click"
                  />
                  Praca
                </label>
              </div>
              <b-input-group class="mb-3" style="justify-content: space-around">
                <label for="workFrom-input"
                  >Od:
                  <b-form-input
                    class="mr-3"
                    id="workFrom-input"
                    v-model="timeFrom"
                    type="time"
                    placeholder="HH:mm"
                    :readonly="!isWork"
                  ></b-form-input>
                </label>
                <label for="workTo-input"
                  >Do:
                  <b-form-input
                    id="workTo-input"
                    v-model="timeTo"
                    type="time"
                    placeholder="HH:mm"
                    :readonly="!isWork"
                  ></b-form-input>
                </label>
              </b-input-group>
            </b-col>

            <!--                            URLOP-->
            <b-col>
              <div class="form-check">
                <label class="form-check-label mb-3" for="rbDayOff">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="rbDayOff"
                    @click="rbDayOff_click"
                  />
                  Urlop
                </label>
              </div>
              <div>
                <label class="form-label" for="dayOffTypeSelect">
                  Wybierz rodzaj urlopu:
                  <b-form-select
                    v-model="selectedDayOffType"
                    :options="optionDayOff"
                    class="mb-3"
                    id="dayOffTypeSelect"
                  >
                    <!-- This slot appears above the options from 'options' prop -->
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Wybierz rodzaj urlopu --
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </label>
              </div>
            </b-col>

            <!--                            CHOROBA-->
            <b-col>
              <div class="form-check">
                <label class="form-check-label mb-3" for="rbIllness">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="rbIllness"
                    @click="rbIllness_click"
                  />
                  Choroba</label
                >
              </div>
              <div>
                <label class="form-label" for="illnessTypeSelect"
                  >Wybierz rodzaj zasiłku:
                  <b-form-select
                    v-model="selectedIllnessType"
                    :options="optionIllness"
                    class="mb-3"
                    id="illnessTypeSelect"
                  >
                    <!-- This slot appears above the options from 'options' prop -->
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        -- Wybierz rodzaj zasiłku --
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                </label>
              </div>
            </b-col>
          </b-row>

          <a
            class="btn btn-warning form-button mt-3 button-view "
            style="width: 100px"
            @click="addWorkTime"
            >Dodaj</a
          >
        </b-col>

        <!--                TABELA-->
        <b-col>
          <div class="mt-5">
            <b-table
              :busy="isBusy"
              :items="workTimeList"
              :fields="fields"
              :tbody-tr-class="rowClass"
              id="table"
            ></b-table>
          </div>
        </b-col>
      </b-row>

      <ul v-if="errors && errors.length">
        <li v-for="error of errors" :key="error.ruleId">
          {{ error.message }}
        </li>
      </ul>
      <br />
    </b-container>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "AddWorkTime",
  data() {
    return {
      // url: "http://focikhome.no-ip.org:9090",
        url: "https://docker.focikhome.synology.me",
      fields: [
        {
          key: "date",
          label: "Data",
        },
        {
          key: "dayOfWeek",
          label: "Dzień tyg.",
        },
        {
          key: "startTime",
          label: "Wejście",
        },
        {
          key: "stopTime",
          label: "Wyjście",
        },
        {
          key: "workTimeAll",
          label: "Ilość godzin",
        },
        {
          key: "workTime50",
          label: "Ilość godzin 50%",
        },
        {
          key: "workTime100",
          label: "Ilość godzin 100%",
        },
      ],
      isBusy: false,
      workTimeList: [],
      employees: [],
      dayOffTypes: [],
      illnessTypes: [],

      workTimeDateString: "",
      workTimeDate: moment(),
      errors: [],
      timeFrom: "07:00:00",
      timeTo: "15:00:00",
      isWork: true,
      isDayOff: false,
      isIllness: false,
      optionDayOff: [],
      optionsEmployee: [],
      optionIllness: [],

      selectedEmployee: "",
      selectedDayOffType: "",
      selectedIllnessType: "",

      work: {
        idEmployee: "",
        date: "",
        startTime: "",
        stopTime: "",
      },
      illness: {
        idEmployee: "",
        date: "",
        idIllnessType: "",
      },
      dayOff: {
        idEmployee: "",
        date: "",
        idDayOffType: "",
      },
    };
  },
  created() {
    this.getEmployeesFromDb();
    this.getDayOffTypesFromDb();
    this.getIllnessTypesFromDb();
    moment.locale("pl");
    // this.workTimeDate = new Date();
    this.workTimeDateString = this.workTimeDate.format("YYYY-MM-DD");
    this.isWork = true;
    this.selectedEmployee = 0;
    this.selectedDayOffType = 2;
    this.selectedIllnessType = 1;
    this.getWorkTimeAll();
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
    onEmployeeChange() {
      this.getWorkTimeAll();
    },
    rbWork_click() {
      this.isWork = true;
      this.isIllness = false;
      this.isDayOff = false;
    },
    rbDayOff_click() {
      this.isDayOff = true;
      this.isWork = false;
      this.isIllness = false;
    },
    rbIllness_click() {
      this.isIllness = true;
      this.isWork = false;
      this.isDayOff = false;
    },
    onContext(ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      //this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      this.workTimeDateString = ctx.selectedYMD;
      this.workTimeDate = moment(this.workTimeDateString);
      this.getWorkTimeAll();
    },
    getEmployeesFromDb() {
      console.log("getEmployeesFromDb() - start");
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      axios
        .get(this.url+`/api/employee/query?status=HIRED`)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.employees = response.data;
          console.log(
            "getEmployeesFromDb() - Ilosc employees[]: " + this.employees.length
          );
          if (this.employees.length > 0) {
            this.convertToOptionsEmployee();
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getDayOffTypesFromDb() {
      console.log("getDayOffTypesFromDb() - start");
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      axios
        .get(this.url+`/api/employee/worktime/dayofftype`)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.dayOffTypes = response.data;
          console.log(
            "getDayOffTypesFromDb() - Ilosc dayOffTypes[]: " + this.dayOffTypes.length
          );
          if (this.dayOffTypes.length > 0) {
            this.convertToOptionsDayOff();
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getIllnessTypesFromDb() {
      console.log("getIllnessTypesFromDb() - start");
      // axios.get(`http://77.55.210.35:9090/api/teams`)
      // axios.get(`http://localhost:9090/api/teams`)
      axios
        .get(this.url+`/api/employee/worktime/illnesstype`)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.illnessTypes = response.data;
          console.log(
            "getIllnessTypesFromDb() - Ilosc illnessTypes[]: " + this.illnessTypes.length
          );
          if (this.illnessTypes.length > 0) {
            this.convertToOptionsIllness();
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getWorkTimeAll() {
      // this.salaryDate = moment().creationData().
      console.log("getWorkTimeAll()");
      this.isBusy = true;
      // let url = "http://localhost:8082/api/worktime/" + this.selectedEmployee + "?date=" + this.workTimeDate.year() + "-" + (this.workTimeDate.month() + 1) + "-01";
      let url =
        this.url+"/api/employee/worktime/" +
        this.selectedEmployee +
        "?date=" +
        this.workTimeDate.format("YYYY-MM-DD");
      // // axios.get(`http://77.55.210.35:9090/api/teams`)
      axios
        .get(url)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.workTimeList = response.data;
          // console.log(this.salary.toString());
          this.isBusy = false;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    addWorkTime() {
      if (this.isWork) {
        this.addWork();
      }
      if (this.isIllness) this.addIllness();

      if (this.isDayOff) this.addDayOff();

      this.addCalendarDay();
    },
    addWork() {
      console.log("add praca: " + this.timeFrom + " - " + this.timeTo);
      this.work.idEmployee = this.selectedEmployee;
      this.work.date = this.workTimeDate.format("YYYY-MM-DD");
      this.work.startTime = this.timeFrom;
      this.work.stopTime = this.timeTo;
      console.log(this.work);
      let url = this.url+ "/api/employee/worktime?workType=WORK";
      // // axios.get(`http://77.55.210.35:9090/api/teams`)
      // // axios.get(`http://localhost:9090/api/teams`)
      axios
        .post(url, this.work)
        .then((response) => {
          console.log(response);
          this.getWorkTimeAll();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    addIllness() {
      console.log("add illness: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.illness.idEmployee = this.selectedEmployee;
      this.illness.date = this.workTimeDate.format("YYYY-MM-DD");
      this.illness.idIllnessType = this.selectedIllnessType;
      console.log(this.illness);
      let url = this.url+ "/api/employee/worktime?workType=ILLNESS";
      // // axios.get(`http://77.55.210.35:9090/api/teams`)
      // // axios.get(`http://localhost:9090/api/teams`)
      axios
        .post(url, this.illness)
        .then((response) => {
          console.log(response);
          this.getWorkTimeAll();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    addDayOff() {
      console.log("add dayOff: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.dayOff.idEmployee = this.selectedEmployee;
      this.dayOff.date = this.workTimeDate.format("YYYY-MM-DD");
      this.dayOff.idDayOffType = this.selectedDayOffType;
      console.log(this.dayOff);
      let url = this.url+"/api/employee/worktime?workType=DAY_OFF";
      // // axios.get(`http://77.55.210.35:9090/api/teams`)
      // // axios.get(`http://localhost:9090/api/teams`)
      axios
        .post(url, this.dayOff)
        .then((response) => {
          console.log(response);
          this.getWorkTimeAll();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    addCalendarDay() {
      console.log("addCalendarDay()");
      console.log("przed dodaniem dnia: " + this.workTimeDate.format("YYYY-MM-DD"));

      //if this is the last day of the month, don't add day and don't switch to nexzt month
      if( this.workTimeDate.format('D')!=this.workTimeDate.daysInMonth() ){
      this.workTimeDate.add(1, "day"); // setDate(day+1);
      }
      console.log("po dodaniu dnia: " + this.workTimeDate.format("YYYY-MM-DD"));

      this.workTimeDateString = this.workTimeDate.format("YYYY-MM-DD");
    },
    convertToOptionsEmployee() {
      console.log("convert to options...");
      this.employees.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsEmployee.push(opt);
        console.log(e.id + " " + e.lastName);
      });
    },
    convertToOptionsDayOff() {
      console.log("convert to options...");
      this.dayOffTypes.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        this.optionDayOff.push(opt);
        console.log(e.id + " " + e.name);
      });
    },
    convertToOptionsIllness() {
      console.log("convert to options...");
      this.illnessTypes.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        this.optionIllness.push(opt);
        console.log(e.id + " " + e.name);
      });
    },
  },
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: flex-start;
  /*align-content: start;*/
  margin: 10px;
  color: white;
}

#table {
  color: rgba(255, 245, 0, 0.8);
}

.text {
  margin-right: 5px;
}

#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

.worktime1 {
  /*background-color: rgba(229, 29, 29);*/
  color: red;
}

.max-width {
  width: -webkit-fill-available;
}

 .button-view {
        background-color: rgba(255, 245, 0, 0.8);
        color: #2c3e50 ;
        border-color:  rgb(108, 117, 125);
        /* font-weight: bold; */
    }


.button-view:hover {
  color: white;
  background-color:  rgb(108, 117, 125);
  /* text-decoration: underline; */
}
</style>
