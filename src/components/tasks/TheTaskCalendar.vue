<template>
  <div>
    <b-container fluid="" id="container">
      <h1>Kalendarz zadań</h1>
      <!--            <h2>Przełączanie daty</h2>-->
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-container id="dateSwitch">
        <b-row align-h="center">
          <b-button
            class="col-md-2 mb-1"
            style="max-width: 110px"
            variant="progas"
            @click="prevDate"
            :disabled="isButtonDisabled"
            >Poprzedni
          </b-button>
          <h3 class="col-md-3 ml-3">
            {{ startDate.format("D.MM") }} - {{ endDate.format("D.MM.YYYY") }}
          </h3>
          <b-button
            class="col-md-2"
            style="max-width: 110px"
            variant="progas"
            @click="nextDate"
            :disabled="isButtonDisabled"
            >Następny
          </b-button>
        </b-row>
      </b-container>

      <br />
      <div v-for="team in allTeams" :key="team.idTeam">
        <br />
        <b-btn class="mb-1" variant="progas" v-b-toggle="'team' + team.idTeam"
          >{{ team.name }}
        </b-btn>

        <b-collapse :id="'team' + team.idTeam" visible>
          <b-card class="card">
            <div class="container-fluid">
              <div class="row">
                <!-- --------------------------MONDAY------------------------------------- -->
                <div class="col-md-2 odd">
                  <p class="dayOfWeek">Poniedziałek - {{ monday }}</p>

                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'poniedziałek'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- --------------------------TUESDAY------------------------------------- -->
                <div class="col-md-2 even">
                  <p class="dayOfWeek">Wtorek - {{ tuesday }}</p>
                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'wtorek'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- --------------------------WEDNESDAY------------------------------------- -->
                <div class="col-md-2 odd">
                  <p class="dayOfWeek">Środa - {{ wednesday }}</p>
                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'środa'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- --------------------------THURSDAY------------------------------------- -->
                <div class="col-md-2 even">
                  <p class="dayOfWeek">Czwartek - {{ thursday }}</p>
                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'czwartek'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- --------------------------FRIDAY------------------------------------- -->
                <div class="col-md-2 odd">
                  <p class="dayOfWeek">Piątek - {{ friday }}</p>
                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'piątek'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- --------------------------SATURDAY------------------------------------- -->
                <div class="col-md-2 even">
                  <p class="dayOfWeek">Sobota - {{ saturday }}</p>
                  <div v-if="calendarEntries && calendarEntries.length">
                    <div v-for="calendarEntry of calendarEntries" :key="calendarEntry.id">
                      <div v-if="weekDay(calendarEntry.date) === 'sobota'">
                        <div v-if="calendarEntry.idTeam === team.idTeam">
                          <div v-if="calendarEntry.taskType === 'GAS_CONNECTION'">
                            <GasConnectionCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :cabinet="calendarEntry.gasCabinetProvider"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-customer="calendarEntry.sentMailToCustomer"
                              :mail-customer-date="calendarEntry.dateSentMailToCustomer"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-status-pgn="calendarEntry.sentMailPgn"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :mail-pgn-date="calendarEntry.dateSentMailPgn"
                              :is-pgn="calendarEntry.isPgn"
                              :latitude="calendarEntry.latitude"
                              :longitude="calendarEntry.longitude"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>

                          <div v-else-if="calendarEntry.taskType === 'GAS_MAIN'">
                            <MainGasCalendarEntry
                              :id-entry="calendarEntry.idEntry"
                              :address="calendarEntry.address"
                              :msg="calendarEntry.message"
                              :task-no="calendarEntry.taskNo"
                              :mail-status-surveyor="calendarEntry.sentMailToSurveyor"
                              :mail-surveyor-date="calendarEntry.dateSentMailToSurveyor"
                              :edit="calculateIsEdit(calendarEntry.idTeam)"
                              :id-team="calendarEntry.idTeam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-card>
        </b-collapse>
        <br />
      </div>
    </b-container>
  </div>
</template>

<script>
import GasConnectionCalendarEntry from "@/components/tasks/GasConnectionCalendarEntry";
import MainGasCalendarEntry from "@/components/tasks/MainGasCalendarEntry";

import axios from "axios";
import moment from "moment";
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
import router from "@/router";
import { errorMixin } from "@/mixins/error";
import { teamMixin } from "@/mixins/team";
import { employeeMixin } from "@/mixins/employee";
import { taskMixin } from "@/mixins/task";
export default {
  name: "TaskCalendar",
  components: { GasConnectionCalendarEntry, MainGasCalendarEntry },
  mixins: [errorMixin, teamMixin, employeeMixin, taskMixin],
  data() {
    return {
    
      calendarEntries: [],
      allTeams: [],
      // idTeam: 0,
      startDate: moment(),
      endDate: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      isButtonDisabled: true,
      hasWritePrivileges: false,
    };
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("TASK_CALENDAR_READ_ALL");
      } catch (error) {
        return false;
      }
    },
    hasWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("TASK_CALENDAR_WRITE");
      } catch (error) {
        return false;
      }
    },
    hasWriteAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return token2.authorities.includes("TASK_CALENDAR_WRITE_ALL");
      } catch (error) {
        return false;
      }
    },
  },
  // Fetches posts when the component is created.
  created() {
    //  moment.locale('en', null);
    moment.locale("pl");
    this.calculateStartDate();
    this.calculateEndDate();
    this.fillWeekDays();
    this.getTeams();
    this.getFromDb();
  },

  methods: {
    //idTeam = idTeam TaskCalendarEntry
    calculateIsEdit(idTeam) {
      console.log("calculateIsEdit(idTeam: " + idTeam + ") - start");
      const write = this.hasWrite;
      console.log("write: " + write);
      const writeAll = this.hasWriteAll;
      console.log("writeAll: " + writeAll);

      // if user has WRITE_ALL
      if (writeAll) {
        return true;
      }

      // if user has no privileges
      if (!writeAll && !write) {
        return false;
      }

      //id != 0 when user is a employee
      const idEmp = this.$store.getters.getUser.idEmployee;
      // if user is employee and have WRITE_ALL
      if (idEmp != 0 && writeAll) {
        return true;
      }
      // if user is employee and part of a teem and has WRITE
      if (this.isInTeam(idEmp, idTeam) && write) {
        return true;
      }

      return false;
    },

    //sprawdza czy uzytkownik jest w teamie
    isInTeam(idEmployee, idTeam) {
      console.log("isInTeam(idEmp: " + idEmployee + ", idTeam: " + idTeam);
      let team = {};
      let result = false;
      this.allTeams.forEach((element) => {
        if (element.idTeam == idTeam) {
          team = element;
        }
      });

      console.log(JSON.stringify(team));
      console.log("tea m !{}: " + (team != {}));
      console.log("team idMembers lenght: " + team.idMembers.length);
      if (team != {} || team.idMembers.length > 0) {
        team.idMembers.forEach((idMember) => {
          if (idMember == idEmployee) {
            console.log("idMember: " + (idMember == idEmployee));
            // return true;
            result = true;
          }
        });
      }
      console.log("result: " + result);
      return result;
      //   return false;
    },
    getTeams() {
      console.log("getTeams()");
      const readAll = this.hasReadAll;
      const id = this.$store.getters.getUser.idEmployee;
      console.log("idEmp from store: " + id + " hasALL: " + readAll);
      if (id == 0 || readAll) {
        this.getTeamsFromDb();
      } else {
        this.getEmployeeFromDb(id)
          .then((response) => {
            let idTeam = response.data.idTeam;
            console.log("idTeam from getTeams: " + idTeam);
            this.getTeamFromDb(idTeam);
          })
          .catch((e) => {
            this.validateError(e);
          });
      }
      console.log("getTeams() Ilosc teams[]: " + this.allTeams.length);
    },
    prevDate() {
      console.log("Preview date.");
      //block buttons
      this.isButtonDisabled = true;
      let tempDate = this.startDate.format("YYYY-MM-DD");
      this.startDate = moment(tempDate, "YYYY-MM-DD").subtract(7, "days");
      this.calculateEndDate();
      this.fillWeekDays();
      this.getFromDb();
    },
    nextDate() {
      //block buttons
      this.isButtonDisabled = true;
      console.log("Next date.");
      let tempDate = this.startDate.format("YYYY-MM-DD");
      this.startDate = moment(tempDate, "YYYY-MM-DD").add(7, "days");
      this.calculateEndDate();
      this.fillWeekDays();
      this.getFromDb();
    },
    calculateEndDate() {
      console.log("Calculate end date");
      let tempDate = this.startDate.format("YYYY-MM-DD");
      this.endDate = moment(tempDate, "YYYY-MM-DD").add(6, "days");
      console.log("Start date: " + this.startDate.format("LLLL"));
      console.log("End date: " + this.endDate.format("LLLL"));
    },
    weekDay(value) {
      const entireWeek = moment(value).format("dddd");
      return entireWeek; // July 6 - 13 2020
    },
    calculateStartDate() {
      console.log("Calculate start date");
      let dateGiven = moment().format("YYYY-MM-DD");

      console.log(dateGiven);
      console.log(moment(dateGiven).format("dddd"));
      let given = moment(dateGiven).format("dddd");
      switch (given) {
        case "poniedziałek":
          console.log("jestem w pon");
          this.startDate = moment();
          break;
        case "wtorek":
          console.log("jestem w wt");
          this.startDate = moment(dateGiven).subtract(1, "days");
          break;
        case "środa":
          console.log("jestem w sroda");
          this.startDate = moment(dateGiven).subtract(2, "days");
          break;
        case "czwartek":
          console.log("jestem w czw");
          this.startDate = moment(dateGiven).subtract(3, "days");
          break;
        case "piątek":
          console.log("jestem w pt");
          this.startDate = moment(dateGiven).subtract(4, "days");
          break;
        case "sobota":
          console.log("jestem w sobota");
          this.startDate = moment(dateGiven).subtract(5, "days");
          break;
        case "niedziela":
          console.log("jestem w niedz");
          this.startDate = moment(dateGiven).subtract(6, "days");
          break;
      }

      console.log(this.startDate.format("LLLL"));
      // return dateReturn;
    },
    fillWeekDays() {
      let dateGiven = moment(this.startDate).format("YYYY-MM-DD");
      this.monday = moment(dateGiven).format("D MMMM");
      this.tuesday = moment(dateGiven).add(1, "days").format("D MMMM");
      this.wednesday = moment(dateGiven).add(2, "days").format("D MMMM");
      this.thursday = moment(dateGiven).add(3, "days").format("D MMMM");
      this.friday = moment(dateGiven).add(4, "days").format("D MMMM");
      this.saturday = moment(dateGiven).add(5, "days").format("D MMMM");
    },
    test2() {
      moment.locale("pl");
      return moment(this.starttest1);
    },
    addDate() {
      const date = moment(this.starttest1);
      console.log(date.add(1, "days").format("dddd, D-MMMM-YYYY"));
    },
    //-------------------------------DB---------------------------------------------
    getFromDb() {
      console.log("getEntryFromDb() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(
          this.urlTask + `/api/taskcalendar/query/week?date=` + this.startDate.format("YYYY-MM-DD"),
          header
        )
        .then((response) => {
          this.calendarEntries = response.data;
          console.log("getTaskEntriesFromDb() - Ilosc entries[]: " + this.calendarEntries.length);
          //button set to enabled
          this.isButtonDisabled = false;
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
  align-content: center;
  color: rgba(255, 245, 0, 0.8);
  margin-top: 50px;
}

.odd {
  /*background-color: #FFFFE0;*/
  /*border-color: darkorange;*/
  border-right: 1px solid rgba(255, 245, 0, 0.8);
  background-color: rgba(29, 29, 29);
}

.even {
  /*background-color: #B0E0E6;*/
  background-color: rgb(29, 29, 29);
  /*border-color: darkorange;*/
  border-right: 1px solid rgba(255, 245, 0, 0.8);
}

#dateSwitch {
  flex-direction: column;
  margin-top: 50px;
}

.card {
  background-color: black;
}

.dayOfWeek {
  margin-top: 10px;
}
</style>
