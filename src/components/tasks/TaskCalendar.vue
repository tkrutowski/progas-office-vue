<template>
    <div>
        <b-container fluid="" id="container">
            <h1>Kalendarz zadań</h1>
            <!--            <h2>Przełączanie daty</h2>-->
            <hr style="border: 0px; background: rgba(255,245,0,0.8); height: 1px;">
            <b-container id="dateSwitch">
                <b-row align-h="center">
                    <b-button class="mr-3 button-view" @click="prevDate" :disabled="isButtonDisabled"   >Poprzedni</b-button>
                    <h3>{{startDate.format('D.MM')}} - {{endDate.format('D.MM.YYYY')}}</h3>
                    <b-button class="ml-3 button-view" @click="nextDate" :disabled="isButtonDisabled" >Następny</b-button>
                </b-row>
            </b-container>

            <ul v-if="errors && errors.length">
                <li v-for="error of errors" :key="error.ruleId">
                    {{error.message}}
                </li>
            </ul>
            <br>
            <div v-for="team in allTeams" :key="team.idTeam">
                <br>
                <b-btn class="button-view"  v-b-toggle="'team'+team.idTeam">{{team.name}}  </b-btn>

                <b-collapse :id="'team'+team.idTeam"  visible>
                    <b-card class="card">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-2 odd">
                                    <p class="dayOfWeek">Poniedziałek - {{monday}}</p>

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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 even">
                                    <p class="dayOfWeek">Wtorek - {{tuesday}}</p>
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 odd">
                                    <p class="dayOfWeek">Środa - {{wednesday}}</p>
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 even">
                                    <p class="dayOfWeek">Czwartek - {{thursday}}</p>
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 odd">
                                    <p class="dayOfWeek">Piątek - {{friday}}</p>
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-2 even">
                                    <p class="dayOfWeek">Sobota - {{saturday}}</p>
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
                <br>
            </div>
        </b-container>
    </div>


</template>

<script>
    import GasConnectionCalendarEntry from "@/components/tasks/GasConnectionCalendarEntry";
    import MainGasCalendarEntry from "@/components/tasks/MainGasCalendarEntry";

    import axios from 'axios';
    import moment from 'moment';

    export default {
        name: "TaskCalendar",
        components: {GasConnectionCalendarEntry, MainGasCalendarEntry},
        data() {
            return {
                // url: "http://focikhome.no-ip.org:9090",
                  url: "https://docker.focikhome.synology.me",
                calendarEntries: [],
                errors: [],
                allTeams: [],
                teams: new Set,
                startDate: moment(),
                endDate: '',
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                saturday: '',
               isButtonDisabled: true,
            }
        },
        // Fetches posts when the component is created.
        created() {
            //  moment.locale('en', null);
            moment.locale('pl');
            this.calculateStartDate();
            this.calculateEndDate();
            this.fillWeekDays();
            this.getTeamsFromDb();
            this.getFromDb();

        },
        methods: {
            getFromDb() {
                console.log("getEntryFromDb() - start");
                // axios.get(`http://localhost:8088/api/taskcalendar/week?date=` + this.startDate.format('YYYY-MM-DD'))
                // axios.get(`http://77.55.210.35:9090/api/taskcalendar/week?date=` + this.startDate.format('YYYY-MM-DD'))
                axios.get(this.url+`/api/taskcalendar/week?date=` + this.startDate.format('YYYY-MM-DD'))
                    .then(response => {
                        // JSON responses are automatically parsed.
                        this.calendarEntries = response.data;
                        console.log("getTaskEntriesFromDb() - Ilosc entries[]: " + this.calendarEntries.length);
                        //this.getTeams();

                        //button set to enabled
                         this.isButtonDisabled = false
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });

            },
            getTeamsFromDb() {
                console.log("getTeamsFromDb() - start");
                // axios.get(`http://77.55.210.35:9090/api/teams`)
                axios.get(this.url+`/api/teams`)
                // axios.get(`http://localhost:8082/api/teams`)
                    .then(response => {
                        // JSON responses are automatically parsed.
                        this.allTeams = response.data;
                        console.log("getTeamsFromDb() - Ilosc teams[]: " + this.allTeams.length);
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });

            },
            getTeams() {
                console.log("getTeams()");
                this.teams.clear();
                console.log("Ilosc teams[]: " + this.allTeams.length);

                if (this.calendarEntries.length > 0) {
                    this.calendarEntries.forEach(e => {
                        this.teams.add(e.idTeam)
                    })
                    this.calendarEntries.forEach(e => console.log("ID team: " + e.idTeam));
                    console.log("Teams set: " + this.teams);

                }

            },
            prevDate() {
                console.log("Preview date.")
                //block buttons
                this.isButtonDisabled = true
                let tempDate = this.startDate.format('YYYY-MM-DD')
                this.startDate = moment(tempDate, 'YYYY-MM-DD').subtract(7, 'days')
                this.calculateEndDate()
                this.fillWeekDays();
                this.getFromDb();
            },
            nextDate() {
                    //block buttons
                this.isButtonDisabled = true
                console.log("Next date.")
                let tempDate = this.startDate.format('YYYY-MM-DD')
                this.startDate = moment(tempDate, 'YYYY-MM-DD').add(7, 'days')
                this.calculateEndDate()
                this.fillWeekDays();
                this.getFromDb();
                // this.getTeams();
               
            },
            calculateEndDate() {
                console.log("Calculate end date")
                let tempDate = this.startDate.format('YYYY-MM-DD')
                this.endDate = moment(tempDate, 'YYYY-MM-DD').add(6, 'days')
                console.log("Start date: " + this.startDate.format('LLLL'))
                console.log("End date: " + this.endDate.format('LLLL'))
            },
            weekDay(value) {
                const entireWeek = moment(value).format("dddd")
                return entireWeek; // July 6 - 13 2020
            },
            calculateStartDate() {
                console.log("Calculate start date")
                let dateGiven = moment().format('YYYY-MM-DD')

                console.log(dateGiven)
                console.log(moment(dateGiven).format("dddd"))
                let given = moment(dateGiven).format("dddd")
                switch (given) {
                    case "poniedziałek":
                        console.log("jestem w pon")
                        this.startDate = moment()
                        break;
                    case "wtorek":
                        console.log("jestem w wt")
                        this.startDate = moment(dateGiven).subtract(1, 'days');
                        break;
                    case "środa":
                        console.log("jestem w sroda")
                        this.startDate = moment(dateGiven).subtract(2, 'days');
                        break;
                    case "czwartek":
                        console.log("jestem w czw")
                        this.startDate = moment(dateGiven).subtract(3, 'days');
                        break;
                    case "piątek":
                        console.log("jestem w pt")
                        this.startDate = moment(dateGiven).subtract(4, 'days');
                        break;
                    case "sobota":
                        console.log("jestem w sobota")
                        this.startDate = moment(dateGiven).subtract(5, 'days');
                        break;
                    case  "niedziela":
                        console.log("jestem w niedz")
                        this.startDate = moment(dateGiven).subtract(6, 'days');
                        break;
                }

                console.log(this.startDate.format('LLLL'))
                // return dateReturn;
            },
            fillWeekDays() {
                let dateGiven = moment(this.startDate).format('YYYY-MM-DD')
                this.monday = moment(dateGiven).format('D MMMM')
                this.tuesday = moment(dateGiven).add(1, 'days').format('D MMMM');
                this.wednesday = moment(dateGiven).add(2, 'days').format('D MMMM');
                this.thursday = moment(dateGiven).add(3, 'days').format('D MMMM');
                this.friday = moment(dateGiven).add(4, 'days').format('D MMMM');
                this.saturday = moment(dateGiven).add(5, 'days').format('D MMMM');

            },
            test2() {
                moment.locale('pl');
                return moment(this.starttest1);
            },
            addDate() {
                const date = moment(this.starttest1)
                // eslint-disable-next-line no-undef
                // this.startDate = (date.add(1,'days').format("dddd, D-MMMM-YYYY"));
                console.log(date.add(1, 'days').format("dddd, D-MMMM-YYYY"));
            },
           
        }
    }
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

.button-view:focus {
  outline: none;
  box-shadow: none;
}
</style>