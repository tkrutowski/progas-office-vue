<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie godzin</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-row align-h="center">

        <b-col>
        <form class="" @submit.prevent="addWorkTime">
          <!--                    Pracownik-->
          <div>
            <label class="form-label mt-5 max-width" for="employeeSelect">
              Wybierz pracownika:
              <div style="display: flex">
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
                  <b-button
                v-if="loading"
                style="height: fit-content"
                variant="progas"
                class="ml-3"
                disabled
              >
                <b-spinner small></b-spinner>
                <span class="sr-only">Loading...</span>
              </b-button>
              </div>
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
                    <!-- <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Wybierz rodzaj urlopu --
                      </b-form-select-option>
                    </template> -->
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
                    <!-- <template #first>
                      <b-form-select-option :value="null" disabled>
                        -- Wybierz rodzaj zasiłku --
                      </b-form-select-option>
                    </template> -->
                  </b-form-select>
                </label>
              </div>
            </b-col>
          </b-row>

         
            <b-button class="mt-3" style="width: 120px" type="submin" variant="progas" 
              >Dodaj
          
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
        </form>
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
            >
            <!-- ICON BUSY -->
          <template #table-busy>
            <div class="text-center text-progas my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          </b-table>
          </div>
        </b-col>
      </b-row>

    
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
  name: "AddWorkTime",
    mixins: [errorMixin, employeeMixin],
  data() {
    return {
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
      busyIcon: false,
      btnDisabled: false,
      loading: false,
      isBusy: false,

      busyIcon: false,
      savedIcon: false,
      errorIcon: false,


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

      selectedEmployee: null,
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
    this.getEmployees();
    this.getDayOffTypesFromDb();
    this.getIllnessTypesFromDb();
    moment.locale("pl");
    // this.workTimeDate = new Date();
    this.workTimeDateString = this.workTimeDate.format("YYYY-MM-DD");
    this.isWork = true;
    this.selectedEmployee = null;
    this.selectedDayOffType = 2;
    this.selectedIllnessType = 1;
    //this.getWorkTimeAllFromDB();
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("HR_WORKTIME_READ_ALL");
      } catch (error) {
        return false;
      }
    },
    hasRead() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("HR_WORKTIME_READ");
      } catch (error) {
        return false;
      }
    },
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
      console.log("onEmployeeChange() - start");
      console.log("selectedEmployee: "+this.selectedEmployee);
      if(this.selectedEmployee != null){
        this.getWorkTimeAllFromDB();
      }
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
      this.workTimeDateString = ctx.selectedYMD;
      this.workTimeDate = moment(this.workTimeDateString);
         if(this.selectedEmployee != null){
        this.getWorkTimeAllFromDB();
      }
    },
   

    addWorkTime() {
      this.busyIcon = true;
      this.savedIcon = false;
      this.errorIcon = false;
      if (this.isWork) {
        this.addWorkToDB();
      }
      if (this.isIllness) this.addIllnessToDB();

      if (this.isDayOff) this.addDayOffToDB();

      this.addCalendarDay();
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

   //---------------------------------------------------- DB READ ---------------------------------------------------------
    //
    //pobranie rodzajów dni wolnych 
    //
    getDayOffTypesFromDb() {
      console.log("getDayOffTypesFromDb() - start");    
      const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      }; 
      axios
        .get(this.urlEmpl+`/api/employee/worktime/dayofftype`, header)
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
          this.validateError(e);
        });
    },
      //
    //pobranie rodzajów dni chorobowych 
    //
    getIllnessTypesFromDb() {
      console.log("getIllnessTypesFromDb() - start");
          const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      };
      axios
        .get(this.urlEmpl+`/api/employee/worktime/illnesstype`, header)
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
          this.validateError(e);
        });
    },
      //
    //pobranie czsu pracy 
    //
    getWorkTimeAllFromDB() {
      console.log("getWorkTimeAllFromDB() - start");
      this.isBusy = true;
     console.log("selected employee: " + this.selectedEmployee);
        const header = {
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  'Authorization': "Bearer "+ this.$store.getters.getToken
              },
          };
     let url =
        this.urlEmpl+"/api/employee/worktime/" +
        this.selectedEmployee +
        "?date=" +
        this.workTimeDate.format("YYYY-MM-DD");
      axios
        .get(url, header)
        .then((response) => {
          this.workTimeList = response.data;
          this.isBusy = false;
        })
        .catch((e) => {
        this.validateError(e);
        });
    },
        //---------------------------------------------------- DB WRITE ---------------------------------------------------------
    //
    //zapisanie godzin pracy
    //
    addWorkToDB() {
       console.log("addWorkToDB() - start");
      console.log("add praca: " + this.timeFrom + " - " + this.timeTo);
      this.work.idEmployee = this.selectedEmployee;
      this.work.date = this.workTimeDate.format("YYYY-MM-DD");
      this.work.startTime = this.timeFrom;
      this.work.stopTime = this.timeTo;
      //  console.log(JSON.stringify(this.work));
         const header = {
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  'Authorization': "Bearer "+ this.$store.getters.getToken
              },
          };
      axios
        .post(this.urlEmpl+ "/api/employee/worktime?workType=WORK", this.work, header)
        .then((response) => {
          this.displaySmallMessage("success", "Dodano godziny pracy.")
          this.getWorkTimeAllFromDB();
              this.busyIcon = false;
      this.savedIcon = true;
      this.errorIcon = false;
        })
        .catch((e) => {
              this.busyIcon = false;
      this.savedIcon = false;
      this.errorIcon = true;
         this.validateError(e);
        });
    },
    addIllnessToDB() {
       console.log("addWorkToDB() - start");
      console.log("add illness: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.illness.idEmployee = this.selectedEmployee;
      this.illness.date = this.workTimeDate.format("YYYY-MM-DD");
      this.illness.idIllnessType = this.selectedIllnessType;
         const header = {
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  'Authorization': "Bearer "+ this.$store.getters.getToken
              },
          };
       //  console.log(JSON.stringify(this.illness));
      axios
        .post(this.urlEmpl+ "/api/employee/worktime?workType=ILLNESS", this.illness, header)
        .then((response) => {
           this.displaySmallMessage("success", "Dodano godziny chorobowe.")
          this.getWorkTimeAllFromDB();
                    this.busyIcon = false;
      this.savedIcon = true;
      this.errorIcon = false;
        })
        .catch((e) => {
               this.busyIcon = false;
      this.savedIcon = false;
      this.errorIcon = true;
           this.validateError(e);
        });
    },
    addDayOffToDB() {
      console.log("addDayOffToDB() - start");
      console.log("add dayOff: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.dayOff.idEmployee = this.selectedEmployee;
      this.dayOff.date = this.workTimeDate.format("YYYY-MM-DD");
      this.dayOff.idDayOffType = this.selectedDayOffType;
      //  console.log(JSON.stringify(this.dayOff));
         const header = {
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  'Authorization': "Bearer "+ this.$store.getters.getToken
              },
          };
      axios
        .post(this.urlEmpl+"/api/employee/worktime?workType=DAY_OFF", this.dayOff, header)
        .then((response) => {
           this.displaySmallMessage("success", "Dodano godziny urlopowe.")
          this.getWorkTimeAllFromDB();
                    this.busyIcon = false;
      this.savedIcon = true;
      this.errorIcon = false;
        })
        .catch((e) => {
               this.busyIcon = false;
      this.savedIcon = false;
      this.errorIcon = true;
            this.validateError(e);
        });
    },
   //---------------------------------------  CONVERT TO OPTION ----------------------------------------------------
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
</style>
