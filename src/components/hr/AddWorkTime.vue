<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie godzin</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <div>
        <b-button
          class="mr-2"
          variant="outline-progas"
          href="/hr/AddAdditions"
          :disabled="!hasAccessHrAddition"
          >Dodatków</b-button
        >
        <b-button
          class="mr-2"
          variant="outline-progas"
          href="/hr/AddLoanInstallment"
          :disabled="!hasAccessReadLoans"
          >Pożyczek</b-button
        >
        <b-button variant="outline-progas" href="/hr/AddAdvances" :disabled="!hasAccessHrAdvance"
          >Zaliczek</b-button
        >
      </div>
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
                    :disabled="employeeDisabled"
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
              </label>
            </div>

            <!--                    Data-->
            <div>
              <b-form-group
                class="max-width mr-2 text-center"
                label="Wybierz datę:"
                label-for="input-date"
              >
                <b-form-input
                  id="input-date"
                  v-model="workTimeDateString"
                  type="date"
                  @change="onDateChange"
                  :disabled="dateDisabled"
                  required
                ></b-form-input>
              </b-form-group>
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
                    </b-form-select>
                  </label>
                </div>
              </b-col>
            </b-row>

            <!-- BTN CANCEL -->
            <b-button
              class="mt-3 mr-2"
              style="width: 120px"
              type="reset"
              variant="progas"
              @click="cancelWorkTime"
              v-if="employeeDisabled"
              >Anuluj
            </b-button>

            <b-button class="mt-3" style="width: 120px" type="submin" variant="progas-save"
              >{{ btnSaveTitle }}

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
              <!-- ----------------------------------AKCJA --------------------------------- -->
              <template #cell(action)="row">
                <b-button-group>
                  <!-- EDIT -->
                  <b-button
                    v-if="hasAccessWorkTimeWrite"
                    size="sm"
                    @click="editWorkTime(row.item, row.index, $event.target)"
                    class="mr-2"
                    variant="progas"
                    title="Edycja wpisu."
                  >
                    Edit
                  </b-button>
                  <!-- DELETE -->
                  <b-button
                    v-if="hasAccessWorkTimeDelete"
                    size="sm"
                    @click="deleteWorkTime(row.item, row.index, $event.target)"
                    class="mr-2 bg-danger"
                    title="Usuń wpis."
                  >
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
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
import { worktimeMixin } from "@/mixins/worktime";
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
export default {
  name: "AddWorkTime",
  mixins: [errorMixin, employeeMixin, worktimeMixin],
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
        {
          key: "action",
          label: "Akcja",
        },
      ],
      busyIcon: false,
      btnDisabled: false,

      employeeDisabled: false,
      dateDisabled: false,
      btnSaveTitle: "Dodaj",

      isBusy: false,

      busyIcon: false,
      savedIcon: false,
      errorIcon: false,

      workTimeDateString: "",
      workTimeDate: moment(),
      errors: [],
      timeFrom: "07:00:00",
      timeTo: "15:00:00",
      isWork: true,
      isDayOff: false,
      isIllness: false,
      workTypeToDelete: "",

      selectedEmployee: null,
      selectedDayOffType: "",
      selectedIllnessType: "",

    };
  },
  created() {
    this.getEmployees("HIRED");
    this.getDayOffTypesFromDb();
    this.getIllnessTypesFromDb();
    moment.locale("pl");
    this.workTimeDateString = this.workTimeDate.format("YYYY-MM-DD");
    this.isWork = true;
    this.rbWorkChecked = true;
    this.selectedEmployee = null;
    this.selectedDayOffType = 2;
    this.selectedIllnessType = 1;
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return (
          token2.authorities.includes("HR_WORKTIME_READ_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
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
    hasAccessWorkTimeWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_WORKTIME_WRITE_ALL: " + token2.authorities.includes('HR_WORKTIME_WRITE_ALL'))
        return (
          token2.authorities.includes("HR_WORKTIME_WRITE_ALL") ||
          token2.authorities.includes("HR_WORKTIME_WRITE") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessWorkTimeDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_WORKTIME_DELETE: " + token2.authorities.includes('HR_WORKTIME_DELETE'))
        return token2.authorities.includes("HR_WORKTIME_DELETE") ||
        token2.authorities.includes("HR_WORKTIME_DELETE_ALL") ||
        token2.authorities.includes("ROLE_ADMIN");
      } catch (error) {
        return false;
        // return true;
      }
    },
  
    hasAccessHrAddition() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_ADDITION: " + token2.authorities.includes('ROLE_HR_ADDITION'))
        return (
          token2.authorities.includes("ROLE_HR_ADDITION") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
    hasAccessHrAdvance() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_ADVANCE: " + token2.authorities.includes('ROLE_HR_ADVANCE'))
        return (
          token2.authorities.includes("ROLE_HR_ADVANCE") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessReadLoans() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_EMPLOYEE: " + token2.authorities.includes('ROLE_HR_EMPLOYEE'))
        return (
          token2.authorities.includes("HR_LOAN_READ_ALL") ||
          token2.authorities.includes("HR_LOAN_READ") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
      }
    },
  },
  methods: {
    rowClass(item, type) {
      if (item.isHoliday === true) return "table-holiday";
    },

    onEmployeeChange() {
      console.log("onEmployeeChange() - start");
      console.log("selectedEmployee: " + this.selectedEmployee);
      if (this.selectedEmployee != null) {
        this.getWorkTimeAllFromDB(this.selectedEmployee, this.workTimeDate.format("YYYY-MM-DD"));
      }
    },
    rbWork_click() {
      console.log("rbWork_click");
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

    onDateChange() {
      // this.workTimeDateString = ctx.selectedYMD;
      if (!this.isEdit) {
        this.workTimeDate = moment(this.workTimeDateString);
        if (this.selectedEmployee != null) {
          this.getWorkTimeAllFromDB(this.selectedEmployee, this.workTimeDate.format("YYYY-MM-DD"));
        }
      }
    },

    addWorkTime() {
      this.busyIcon = true;
      this.savedIcon = false;
      this.errorIcon = false;
      if (this.isEdit) {
        if (this.isWork) {
          this.deleteWorkTimeDB(
            this.selectedEmployee,
            this.workTimeDateString,
            this.workTypeToDelete
          ).then((response) => {
            this.workTimeDate = moment(this.workTimeDateString);
            this.addWorkToDB();
            // console.log(JSON.stringify(this.work));
          });
        }
        if (this.isIllness) {
          this.deleteWorkTimeDB(
            this.selectedEmployee,
            this.workTimeDateString,
            this.workTypeToDelete
          ).then((response) => {
            this.workTimeDate = moment(this.workTimeDateString);
            this.addIllnessToDB();
            // console.log(JSON.stringify(this.work));
          });
        }

        if (this.isDayOff) {
          this.deleteWorkTimeDB(
            this.selectedEmployee,
            this.workTimeDateString,
            this.workTypeToDelete
          ).then((response) => {
            this.workTimeDate = moment(this.workTimeDateString);
            this.addDayOffToDB();
            // console.log(JSON.stringify(this.work));
          });
        }

        this.cancelWorkTime();
      } else {
        if (this.isWork) {
          this.addWorkToDB();
        }
        if (this.isIllness) {
          this.addIllnessToDB();
        }

        if (this.isDayOff) {
          this.addDayOffToDB();
        }

        this.addCalendarDay();
      }
    },

    addCalendarDay() {
      console.log("addCalendarDay()");
      console.log("przed dodaniem dnia: " + this.workTimeDate.format("YYYY-MM-DD"));

      //if this is the last day of the month, don't add day and don't switch to nexzt month
      if (this.workTimeDate.format("D") != this.workTimeDate.daysInMonth()) {
        this.workTimeDate.add(1, "day"); // setDate(day+1);
      }
      console.log("po dodaniu dnia: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.workTimeDateString = this.workTimeDate.format("YYYY-MM-DD");
    },

    //
    //edit worktime
    //
    editWorkTime(item) {
      console.log("editWorkTimeAddition(): " + item.date);
      // console.log(JSON.stringify(item));
      if (item.workType != null) {
        this.employeeDisabled = true;
        this.dateDisabled = true;
        this.isEdit = true;
        this.btnSaveTitle = "Zapisz";
        this.workTimeDateString = moment(item.date, "DD-MM-YYYY").format("YYYY-MM-DD");
        if (item.workType == "WORK") {
          console.log("edit work");
          const rbWork = document.getElementById("rbWork");
          rbWork.checked = true;
          this.rbWork_click();
          this.timeFrom = moment(item.startTime, "HH:mm").format("HH:mm");
          this.timeTo = item.stopTime;
          this.workTypeToDelete = "WORK";
        } else if (item.workType == "ILLNESS") {
          console.log("edit illness");
          const rbIllness = document.getElementById("rbIllness");
          rbIllness.checked = true;
          this.rbIllness_click();
          this.selectedIllnessType = item.idIllnessType;
          this.workTypeToDelete = "ILLNESS";
        } else if (item.workType == "DAY_OFF") {
          console.log("edit dayOff");
          const rbDayOff = document.getElementById("rbDayOff");
          rbDayOff.checked = true;
          this.rbDayOff_click();
          this.selectedDayOffType = item.idDayOffType;
          this.workTypeToDelete = "DAY_OFF";
        }

      }
    },

    cancelWorkTime() {
      console.log("cancelWorkTime()");
      this.employeeDisabled = false;
      this.dateDisabled = false;
      this.btnSaveTitle = "Dodaj";
      this.isEdit = false;
      // this.resetForm();
    },

    //
    //delete worktime
    //
    deleteWorkTime(item) {
      this.$bvModal
        .msgBoxConfirm(`Czy chcesz usunąć wpis:\n z dnia ${item.date}?`, {
          title: "Potwierdzenie",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "TAK",
          cancelTitle: "NIE",
          footerClass: "p-2",
          hideHeaderClose: true,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.deleteWorkTimeDB(
              item.idEmployee,
              moment(item.date, "DD-MM-YYYY").format("YYYY-MM-DD"),
              item.workType
            ).then((response) => {
              this.displaySmallMessage("success", "Usunięto wpis.");
              this.getWorkTimeAllFromDB(
                this.selectedEmployee,
                this.workTimeDate.format("YYYY-MM-DD")
              );
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    //---------------------------------------  CONVERT TO OPTION ----------------------------------------------------
    convertToOptionsEmployee() {
      console.log("convertToOptionsEmployee...");
      this.employees.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsEmployee.push(opt);
        // console.log(e.id + " " + e.lastName);
      });
    },
    convertToOptionsDayOff() {
      console.log("convertToOptionsDayOff...");
      this.dayOffTypes.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        this.optionDayOff.push(opt);
        // console.log(e.id + " " + e.name);
      });
    },
    convertToOptionsIllness() {
      console.log("convertToOptionsIllness...");
      this.illnessTypes.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        this.optionIllness.push(opt);
        // console.log(e.id + " " + e.name);
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
