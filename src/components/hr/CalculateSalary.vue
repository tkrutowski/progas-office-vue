<template>
    <div>
        <b-container fluid="" id="container">
            <h1>Obliczanie wypłat</h1>
            <hr style="border: 0px; background: rgba(255,245,0,0.8); height: 1px;">
            <b-container id="dateSwitch">
                <b-row align-h="center">

                    <div>
                        <label class="form-label" for="employee">Wybierz pracownika: </label>
                        <b-form-select v-model="selected" :options="options" class="mb-3" id="employee">
                            <!-- This slot appears above the options from 'options' prop -->
                            <template #first>
                                <b-form-select-option :value="null" disabled>
                                    -- Wybierz pracownika --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                        <label for="date">Wybierz datę:</label>
                        <div style="display: flex; justify-content: space-between">
                            <b-form-select v-model="month" :options="months" class="mb-3" id="date" style="width: 45%">
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
                        <a class="btn btn-warning form-button mt-3" style="width: 100px;" @click="getSalaryFromDb">Oblicz</a>

                    </div>
                </b-row>

                <b-row class="mt-5 pl-5 ml-5">
                    <!--obliczanie wypłąt lewa-->
                    <div style=" float: left; width: 40%">
                        <div class="main">
                            <p class="text">Godziny urlopowe (płatne):</p>
                            <p class="value">{{salary.dayOffWorkTimePay}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny urlopowe (bezpłatne):</p>
                            <p class="value">{{salary.dayOffWorkTimeFree}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny chorobowe (80%):</p>
                            <p class="value">{{salary.illnessWorkTime80}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny chorobowe (100%):</p>
                            <p class="value">{{salary.illnessWorkTime100}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny przepracowane:</p>
                            <p class="value">{{salary.workRegularWorkTime}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny nadliczbowe (50%):</p>
                            <p class="value">{{salary.workOvertimeWorkTime50}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Godziny nadliczbowe (100%):</p>
                            <p class="value">{{salary.workOvertimeWorkTime100}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Suma godzin:</p>
                            <p class="value">{{salary.workTimeAll}}</p>
                        </div>
                    </div>

                    <!--obliczanie wypłąt środek-->
                    <div style="float: left; width: 30%">
                        <div class="main">
                            <p class="text">Za godziny:</p>
                            <p class="value">{{salary.forRegularRate}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Za nadgodziny 50%:</p>
                            <p class="value">{{salary.forOvertime50}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Za nadgodziny 100%:</p>
                            <p class="value">{{salary.forOvertime100}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Za urlop:</p>
                            <p class="value">{{salary.forDayOff}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Za zasiłek (80%):</p>
                            <p class="value">{{salary.forIllness80}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Za zasiłek (100%):</p>
                            <p class="value">{{salary.forIllness100}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Razem:</p>
                            <p class="value">{{salary.forAll}}</p>
                        </div>
                    </div>

                    <!-- obliczenia wypłat prawa               -->
                    <div style="float: left; width: 30%">

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
                            <p class="value">{{salary.advancesSum}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Dodatki:</p>
                            <p class="value">{{salary.additionsSum}}</p>
                        </div>
                        <div class="main">
                            <p class="text">Pożyczki:</p>
                            <p class="value">{{salary.loanInstallmentSum}}</p>
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
                            <p class="value">{{salary.forAll}}</p>
                        </div>
                    </div>
                </b-row>
            </b-container>

            <ul v-if="errors && errors.length">
                <li v-for="error of errors" :key="error.ruleId">
                    {{error.message}}
                </li>
            </ul>
            <br>

        </b-container>
    </div>
</template>

<script>
    import moment from 'moment';
    import axios from "axios";

    export default {
        name: "CalculateSalary",
        data() {
            return {
                employees: [],
                options: [],
                salaryDate: moment(),
                errors: [],
                selected: '',
                months: [{value: '01', text: 'styczeń'}, {value: '02', text: 'luty'}, {
                    value: '03',
                    text: 'marzec'
                }, {value: '04', text: 'kwiecień'}, {value: '05', text: 'maj'}, {value: '06', text: 'czerwiec'}
                    , {value: '07', text: 'lipiec'}, {value: '08', text: 'sierpień'}, {
                        value: '09',
                        text: 'wrzesień'
                    }, {value: '10', text: 'październik'}, {value: '11', text: 'listopad'}, {
                        value: '12',
                        text: 'grudzień'
                    }],
                years: [2020, 2021, 2022],
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
                    workTimeAll: "..."
                },
                month: moment().format('MM'),
                year: moment().format('YYYY')
            }
        },
        created() {
            this.getEmployeesFromDb();
            moment.locale('pl');
            // this.months=moment.months();
        },
        methods: {
            getEmployeesFromDb() {
                console.log("getEmployeesFromDb() - start");
                // axios.get(`http://77.55.210.35:9090/api/teams`)
                // axios.get(`http://localhost:9090/api/teams`)
                axios.get(`http://192.168.1.10:8082/api/employee/query?status=HIRED`)
                    .then(response => {
                        // JSON responses are automatically parsed.
                        this.employees = response.data;
                        console.log("getEmployeesFromDb() - Ilosc employees[]: " + this.employees.length);
                        if (this.employees.length > 0) {
                            this.convertToOptions();
                        }
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });

            },
            getSalaryFromDb() {
                if (this.selected === '')
                    window.alert("Musisz wybrać pracownika!")
                else {
                    // this.salaryDate = moment().creationData().
                    let url = "http://localhost:8082/api/employee/salary/" + this.selected + "?date=" + this.year + "-" + this.month + "-01";
                    console.log("getSalaryFromDb(): "+ url);
                    // axios.get(`http://77.55.210.35:9090/api/teams`)
                    // axios.get(`http://localhost:9090/api/teams`)
                    axios.get(url)
                        .then(response => {
                            // JSON responses are automatically parsed.
                            this.salary = response.data;
                            console.log(this.salary.toString());
                        })
                        .catch(e => {
                            this.errors.push(e)
                        });
                }
            },
            convertToOptions() {
                console.log("convert to options...");
                this.employees.forEach((e) => {
                    let opt = {
                        value: e.id,
                        text: e.lastName + " " + e.firstName
                    }
                    this.options.push(opt)
                    console.log(e.id + " " + e.lastName);

                })
            }
        }
    }
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