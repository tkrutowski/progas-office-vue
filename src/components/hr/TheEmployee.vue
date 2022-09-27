<template>
  <b-container id="container">
    <b-card
      :title="isEdit == 'false' ? 'Dodawanie nowego pracownika' : 'Edycja pracownika'"
      bg-variant="dark"
    >
      <b-button v-show="loadingEmployee" style="height: fit-content" variant="progas" class="ml-3" disabled>
        <b-spinner small></b-spinner>
        <span class="sr-only">Loading...</span>
      </b-button>
      <b-form @submit.stop.prevent="saveEmployee" autocomplete="off">
        <!-- ROW-1 -->
        <div class="row">
          <!-- FIRSTNAME -->
          <b-form-group class="col" label="Imię:" label-for="input-firstname">
            <b-form-input
              id="input-firstname"
              v-model="employee.firstName"
              :state="validationFirstName"
              placeholder=""
              required
              autofocus
            ></b-form-input>
            <b-form-invalid-feedback :state="validationFirstName">
              Nie może mieć więcej niż 10 znaków.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- LASTNAME -->
          <b-form-group class="col" label="Nazwisko:" label-for="input-lastname">
            <b-form-input
              id="input-lastname"
              v-model="employee.lastName"
              :state="validationLastName"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationLastName">
              Nie może mieć więcej niż 20 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-2 -->
        <div class="row">
          <!-- STREET -->
          <b-form-group class="col" label="Ulica:" label-for="input-street">
            <b-form-input
              id="input-street"
              v-model="employee.street"
              :state="validationStreet"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationStreet">
              Nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- ZIP -->
          <b-form-group class="col" label="Kod pocztowy:" label-for="input-zip">
            <b-form-input
              id="input-zip"
              v-model="employee.zip"
              :state="validationZip"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationZip">
              Format 61754 lub 61-754.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- CITY -->
          <b-form-group class="col" label="Miasto:" label-for="input-city">
            <b-form-input
              id="input-city"
              v-model="employee.city"
              :state="validationCity"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationCity">
              Nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-3 -->
        <div class="row">
          <!-- DAYS_OFF_LEFT -->
          <b-form-group class="col" label="Urlop pozostały:" label-for="input-daysOff-left">
            <b-form-input
              id="input-daysOff-left"
              v-model="employee.numberDaysOffLeft"
              :state="validationDayOffLeft"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationDayOffLeft">
              Wymiar urlopu np: 10.5.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- DAYS_OFF_ANNUALLY -->
          <b-form-group class="col" label="Wymiar urlop:" label-for="input-numberDaysOffAnnually">
            <b-form-select
              id="select-dayOff"
              v-model="employee.numberDaysOffAnnually"
              :options="optionsNrDaysOffAnnually"
            ></b-form-select>
          </b-form-group>

          <!-- PESEL -->
          <b-form-group class="col" label="Pesel:" label-for="input-pesel">
            <b-form-input
              id="input-pesel"
              v-model="employee.pesel"
              :state="validationPesel"
              placeholder=""
            ></b-form-input>
            <b-form-invalid-feedback :state="validationPesel">
              Pesel musi mieć 11 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-4 -->
        <div class="row">
          <!-- EMAIL -->
          <b-form-group class="col" label="Email adres:" label-for="input-mail">
            <b-form-input
              id="input-mail"
              v-model="employee.email"
              type="email"
              placeholder="Example@com.pl"
              :state="validationEmail"
            ></b-form-input>
            <b-form-invalid-feedback :state="validationEmail">
              Pole nie może mieć więcej niż 100 znaków.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- PHONE_NR -->
          <b-form-group class="col" label="Telefon:" label-for="input-phoneNr">
            <b-form-input
              id="input-phoneNr"
              v-model="employee.telNumber"
              :state="validationTelNumber"
              placeholder=""
            ></b-form-input>
            <b-form-invalid-feedback :state="validationTelNumber">
              Pole nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-5 -->
        <div class="row">
          <!-- HIRED DATE -->
          <b-form-group class="col" label="Data zatrudnienia:" label-for="input-hired-date">
            <b-form-input
              id="input-hired-date"
              v-model="employee.hiredDate"
              type="date"
              required
            ></b-form-input>
          </b-form-group>

          <!-- RELEASE DATE -->
          <b-form-group class="col" label="Data zwolnienia:" label-for="input-release-date">
            <b-form-input
              id="input-release-date"
              v-model="employee.releaseDate"
              type="date"
            ></b-form-input>
          </b-form-group>
        </div>

        <!-- ROW-6 -->
        <div class="row">
          <!-- NEXT MED DATE -->
          <b-form-group
            class="col"
            label="Data następnego badania lekarskiego:"
            label-for="input-nextMedDate"
          >
            <b-form-input
              id="input-nextMedDate"
              v-model="employee.nextMedicalExaminationDate"
              type="date"
              placeholder=""
            ></b-form-input>
          </b-form-group>

          <!-- NEXT BHP DATE -->
          <b-form-group
            class="col"
            label="Data następnego szkolenia BHP:"
            label-for="input-nextBhpDate"
          >
            <b-form-input
              id="input-nextBhpDate"
              v-model="employee.nextBhpTrainingDate"
              type="date"
            ></b-form-input>
          </b-form-group>
        </div>

        <!-- ROW-7 -->
        <div class="row">
          <b-form-group class="col" label="Stanowisko:" label-for="input-employeeType">
            <b-form-select
              id="input-employeeType"
              v-model="employee.employeeType"
              :options="optionsEmployeesTypes"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group class="col" label="Etat:" label-for="input-worktime">
            <b-form-select
              id="input-worktime"
              v-model="employee.workTime"
              :options="optionsWorktime"
              required
            ></b-form-select>
          </b-form-group>
        </div>

        <!-- ROW-8 -->
        <div class="row">
          <!-- OTHER_INFO -->
          <b-form-group class="col" label="Inne informacje:" label-for="other-info">
            <b-form-textarea
              id="other-info"
              v-model="employee.otherInfo"
              rows="3"
              max-rows="6"
              :state="validationInfo"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="validationInfo">
              Pole nie może mieć więcej niż 150 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <b-button class="pl-5 pr-3" variant="progas" :disabled="empSaveDisabled" type="submit"
          >Zapisz
          <!-- <b-icon class="pl-2"  scale="1.8" icon="arrow-bar-up" variant="success"  aria-hidden="true"></b-icon> -->
          <b-icon
            v-if="empSaveIcon"
            class="pl-2"
            scale="1.8"
            icon="save"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="empSavedIcon"
            class="pl-2"
            scale="2.6"
            icon="check"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="empErrorIcon"
            class="pl-2"
            scale="1.6"
            icon="x-circle"
            variant="danger"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="empBusyIcon"
            icon="arrow-clockwise"
            animation="spin-pulse"
            font-scale="1"
          ></b-icon>
        </b-button>
      </b-form>
      <template #footer> </template>
    </b-card>

    <!-- RATE REGULAR -->
    <b-card
      class="mt-5"
      v-if="hasAccessRateRead"
      :title="isEdit == 'false' ? 'Dodawanie stawki podstawowej' : 'Zmiana stawki podstawowej'"
      bg-variant="dark"
    >
      <b-form @submit.stop.prevent="saveRateRegular" autocomplete="off">
        <!--DATE RATE REGULAR -->
        <div class="row">
          <!-- RATE -->
          <b-form-radio-group class="ml-2 pl-2 mb-2" required v-slot="{ ariaDescribedby }">
            <b-form-radio
              v-model="rateRegular.rateType"
              :aria-describedby="ariaDescribedby"
              name="some-radios"
              value="PER_HOUR"
              >Stawka zł/h</b-form-radio
            >
            <b-form-radio
              class="ml-5"
              v-model="rateRegular.rateType"
              :aria-describedby="ariaDescribedby"
              name="some-radios"
              value="PER_MONTH"
              >Stawka zł/mc</b-form-radio
            >
          </b-form-radio-group>
        </div>
        <div class="row">
          <!-- RATE REGULAR -->
          <b-form-group class="col" label="Stawka podstawowa:" label-for="input-rate">
            <b-form-input
              id="input-rate"
              v-model="rateRegular.rateValue"
              :state="validationRateRegular"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationRateRegular">
              Stawka np: 10.5 lub 3280
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- DATE FROM -->
          <b-form-group class="col" label="Obowiązuje od:" label-for="datepicker-rate">
            <b-form-datepicker
              id="datepicker-rate"
              :date-format-options="{ year: 'numeric', month: 'long', day: undefined }"
              hide-header
              no-highlight-today
              locale="pl"
              required
              v-model="rateRegular.dateFrom"
            ></b-form-datepicker>
          </b-form-group>
        </div>

        <b-button class="pl-5 pr-3" variant="progas" :disabled="rateRegSaveDisabled" type="submit">
          Zapisz
          <b-icon
            v-if="rateRegSaveIcon"
            class="pl-2"
            scale="1.8"
            icon="save"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateRegSavedIcon"
            class="pl-2"
            scale="2.6"
            icon="check"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateRegErrorIcon"
            class="pl-2"
            scale="1.6"
            icon="x-circle"
            variant="danger"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateRegBusyIcon"
            icon="arrow-clockwise"
            animation="spin-pulse"
            font-scale="1"
          ></b-icon>
        </b-button>
      </b-form>
      <template #footer>
        <div class="d-flex justify-content-end">
          <b-button class="button-my" variant="progas" @click="showRateRagularHistoryModal"
            >Historia</b-button
          >
        </div>
      </template>
    </b-card>

    <!-- RATE OVERTIME-->
    <b-card
      v-if="hasAccessRateRead"
      class="mt-5"
      :title="isEdit == 'false' ? 'Dodawanie stawki nadgodzinowej' : 'Edycja stawki nadgodzinowej'"
      bg-variant="dark"
    >
      <b-form @submit.stop.prevent="saveRateOvertime" autocomplete="off">
        <div class="row mt-4">
          <!-- RATE -->
          <b-form-group class="col" label="Stawka nadgodzinowa:" label-for="input-rateOvertime">
            <b-form-input
              id="input-rateOvertime"
              v-model="rateOvertime.rateValue"
              :state="validationRateOvertime"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationRateOvertime">
              Stawka np: 10.5
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- DATE FROM -->
          <b-form-group class="col" label="Obowiązuje od:" label-for="datepicker-rateOvertime">
            <b-form-datepicker
              id="datepicker-rateOvertime"
              :date-format-options="{ year: 'numeric', month: 'long', day: undefined }"
              hide-header
              no-highlight-today
              locale="pl"
              required
              v-model="rateOvertime.dateFrom"
            ></b-form-datepicker>
          </b-form-group>
        </div>

        <b-button class="pl-5 pr-3" variant="progas" :disabled="rateOverSaveDisabled" type="submit"
          >Zapisz
          <b-icon
            v-if="rateOverSaveIcon"
            class="pl-2"
            scale="1.8"
            icon="save"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateOverSavedIcon"
            class="pl-2"
            scale="2.6"
            icon="check"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateOverErrorIcon"
            class="pl-2"
            scale="1.6"
            icon="x-circle"
            variant="danger"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="rateOverBusyIcon"
            icon="arrow-clockwise"
            animation="spin-pulse"
            font-scale="1"
          ></b-icon>
        </b-button>
      </b-form>
      <template #footer>
        <div class="d-flex justify-content-end">
          <b-button class="button-my" variant="progas" @click="showRateOvertimeHistoryModal"
            >Historia</b-button
          >
        </div>
      </template>
    </b-card>

    <!-- Info modal -->
    <!-- <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal> -->

    <b-modal
      ref="rateHistoryModal"
      centered
      :title="rateHistoryModal.title"
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
        <b-table :items="rateAll" :fields="fieldsRateAll" id="table">
          <!-- ----------------------------------AKCJA --------------------------------- -->
          <template #cell(action)="row">
            <b-button-group>
              <!-- DELETE -->
              <b-button
                v-if="hasAccessRateDelete"
                size="sm"
                @click="deleteRate(row.item, row.index, $event.target)"
                class="mr-2 bg-danger"
                title="Usuń stawkę"
              >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>
        </b-table>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { employeeMixin } from "@/mixins/employee";
import { rateMixin } from "@/mixins/rate";
export default {
  name: "Employee",
  mixins: [errorMixin, employeeMixin, rateMixin],
  data() {
    return {
      idEmployee: 0,
      isEdit: false,
      whichRate: "",
      optionsNrDaysOffAnnually: [0, 20, 26],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },

      //employee
      selectedRate: 0,
      optionsEmployeesTypes: [],
      optionsWorktime: [],
      // isEmployee: false,

      empSaveIcon: true,
      empBusyIcon: false,
      empSavedIcon: false,
      empSaveDisabled: false,
      empErrorIcon: false,

      rateRegSaveIcon: true,
      rateRegBusyIcon: false,
      rateRegSavedIcon: false,
      rateRegSaveDisabled: false,
      rateRegErrorIcon: false,

      rateOverSaveIcon: true,
      rateOverBusyIcon: false,
      rateOverSavedIcon: false,
      rateOverSaveDisabled: false,
      rateOverErrorIcon: false,
    };
  },
  mounted() {
    // let idTemp = this.$route.params.idUser;
    this.isEdit = this.$route.params.isEdit;
    // console.log("TempID: " + idTemp + ", edit: " + this.$route.params.isEdit);
    // this.idUser = idTemp;
    this.idEmployee = this.$route.params.idEmployee;
    //  this.getEmployee(idEmployee);
    this.getEmployeeIfEdit();
    console.log("mounted");
  },
  created() {
    console.log("created");
    this.fillOptions();
  },
  computed: {
    ...mapGetters(["getToken"]),

    hasAccessRateRead() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return (
          token2.authorities.includes("HR_RATE_READ_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessRateWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return (
          token2.authorities.includes("HR_RATE_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessRateDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_RATE_DELETE_ALL: " + token2.authorities.includes('HR_RATE_DELETE_ALL'))
        return (
          token2.authorities.includes("HR_RATE_DELETE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessEmployeeWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return (
          token2.authorities.includes("HR_EMPLOYEE_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    validationFirstName() {
      return this.employee.firstName.length > 0 && this.employee.firstName.length <= 10;
    },
    validationLastName() {
      return this.employee.lastName.length > 0 && this.employee.lastName.length <= 20;
    },
    validationStreet() {
      return this.employee.street.length > 0 && this.employee.street.length <= 50;
    },
    validationInfo() {
      return this.employee.otherInfo.length <= 150;
    },
    validationCity() {
      return this.employee.city.length > 0 && this.employee.city.length <= 50;
    },
    validationZip() {
      return (
        (this.employee.zip.length <= 6 && /(^\d{2}-\d{3}$)/.test(this.employee.zip)) ||
        (this.employee.zip.length <= 5 && /(^\d{5})/.test(this.employee.zip))
      );
    },
    validationDayOffLeft() {
      return (
        this.employee.numberDaysOffLeft.length > 0 &&
        this.employee.numberDaysOffLeft.length <= 5 &&
        (/(^[+-]?([0-9]*[.])?[0-9]$)/.test(this.employee.numberDaysOffLeft) ||
          /^[0-9]+$/.test(this.employee.numberDaysOffLeft))
      );
    },

    validationRateRegular() {
      return (
        this.rateRegular.rateValue.length > 0 &&
        this.rateRegular.rateValue.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.rateRegular.rateValue) ||
          /^[0-9]+$/.test(this.rateRegular.rateValue))
      );
    },
    validationRateOvertime() {
      return (
        this.rateOvertime.rateValue.length > 0 &&
        this.rateOvertime.rateValue.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.rateOvertime.rateValue) ||
          /^[0-9]+$/.test(this.rateOvertime.rateValue))
      );
    },
    validationPesel() {
      return this.employee.pesel.length == 0 || /^\d{11}$/.test(this.employee.pesel);
    },

    validationEmail() {
      return (
        this.employee.email.length == 0 ||
        (this.employee.email.length <= 100 && this.employee.email.includes("@"))
      );
    },
    validationTelNumber() {
      return this.employee.telNumber.length <= 20;
    },
  },
  methods: {
    formatDate(value, event) {
      return moment(value).format("YYYY-MM");
    },
    //-------------------------------------------EMPLOYEE-------------------------------------------

    //
    //get employee if edit
    //
    getEmployeeIfEdit() {
      console.log("getEmployeeIfEdit()) - start, ID = " + this.idEmployee);
      if (this.isEdit == "true") {
        this.loadingEmployee = true;
        this.getEmployeeFromDb(this.idEmployee).then((response) => {
          this.employee = response.data;
          this.loadingEmployee = false;
        });
        if (this.hasAccessRateRead) {
          this.getRateRegularFromDb(this.idEmployee).then((response) => {
            this.rateRegular = response.data;
          });
          this.getRateOvertimeFromDb(this.idEmployee).then((response) => {
            this.rateOvertime = response.data;
          });
        }
      }
    },

    getEmployee(id) {
      console.log("getEmployee() - start");
      this.employee = this.getEmployeesFromDb(id);
    },

    fillOptions() {
      console.log("fillOptions() - start for TYPE");
      this.getEmployeeTypeFromDb().then((types) => {
        //  console.log(JSON.stringify(response.data));
        this.convertToOptionsEmployeeType(types.data);
      });

      console.log("fillOptions() - continue for WORKTIME");
      this.getEmployeeWorktimeFromDb().then((worktime) => {
        //  console.log(JSON.stringify(response.data));
        this.convertToOptionsEmployeeWorktime(worktime.data);
      });
    },

    saveEmployee() {
      this.empSaveDisabled = true;
      this.changeStatusIconEmp(true, false, false);
      // console.log("validEMployee: " + this.validEmployee());
      if (!this.validEmployee()) {
        this.changeStatusIconEmp(false, false, true);
        this.empSaveDisabled = false;
        this.displaySmallMessage("warning", "Niepoprawne dane.");
      } else {
        if (this.employee.id == 0) {
          this.employee.employmentStatus = "HIRED";
          this.addEmployeeDB()
            .then((response) => {
              this.employee.id = response.data;
              this.displaySmallMessage("success", "Dodano pracownika.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIconEmp(false, true, false);
              this.empSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIconEmp(false, false, true);
              this.empSaveDisabled = false;
              this.validateError(e);
            });
        } else {
          this.updateEmployeeDb()
            .then((response) => {
              this.employee = response.data;
              this.displaySmallMessage("success", "Zaktualizowano dane pracownika.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIconEmp(false, true, false);
              this.empSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIconEmp(false, false, true);
              this.empSaveDisabled = false;
              this.validateError(e);
            });
        }
      }
    },

    validEmployee() {
      return (
        this.validationFirstName &&
        this.validationLastName &&
        this.validationStreet &&
        this.validationCity &&
        this.validationInfo &&
        this.validationZip &&
        this.validationDayOffLeft &&
        this.validationPesel &&
        this.validationEmail &&
        this.validationTelNumber
      );
    },

    changeStatusIconEmp(busy, save, error) {
      this.empBusyIcon = busy;
      this.empErrorIcon = error;
      this.empSavedIcon = save;
    },
    // //-------------------------------------------RATE-------------------------------------------
    //
    //otwiera okno ze spisem wszystkich stawek podstawowych pracownika
    //
    showRateRagularHistoryModal() {
      this.rateHistoryModal.title = "Stawka podstawowa";
      this.getRateRegularAllFromDb(this.idEmployee).then((response) => {
        // console.log(JSON.stringify(response.data));
        this.whichRate = "regular";
        this.rateAll = [];
        response.data.forEach((e) => {
          let rateType = e.rateType == "PER_HOUR" ? " zł/h" : " zł/mc";
          let rate = {
            idRate: e.idRate,
            rateValue: e.rateValue + rateType,
            dateFrom: moment(e).format("MMMM YYYY"),
          };
          this.rateAll.push(rate);
        });
        this.$refs["rateHistoryModal"].show();
      });
    },

    //
    //otwiera okno ze spisem wszystkich stawek nadliczbowych pracownika
    //
    showRateOvertimeHistoryModal() {
      this.rateHistoryModal.title = "Stawka nadgodzinowa";
      this.getRateOvertimeAllFromDb(this.idEmployee).then((response) => {
        // console.log(JSON.stringify(response.data));
        this.rateOvertime.idRate = "";
        this.rateAll = [];
        response.data.forEach((e) => {
          // console.log(e);
          let rate = {
            idRate: e.idRate,
            rateType: e.rateType,
            dateFrom: moment(e).format("MMMM YYYY"),
            rateValue: e.rateValue,
          };
          this.rateAll.push(rate);
        });
        this.$refs["rateHistoryModal"].show();
      });
    },

    //
    //zapisuje nową stawkę podstawową do DB
    //
    saveRateRegular() {
      console.log("saveRateRegular() - start");
      this.changeStatusIconRateReg(true, false, false);
      this.rateRegSaveDisabled = true;
      if (this.employee.id == 0) {
        this.displaySmallMessage("warning", "Musisz najpierw zapisać pracownika.");
      } else if (this.hasAccessRateWrite) {
        if (this.validationRateRegular) {
          this.addNewRateRagularDb(this.employee.id)
            .then((response) => {
              console.log("SUCCESS");
              this.displaySmallMessage("success", "Dodano stawkę podstawową.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIconRateReg(false, true, false);
              this.rateRegSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIconRateReg(false, false, true);
              this.rateRegSaveDisabled = false;
              if (e.response.status == 409) {
                console.log(JSON.stringify("ERROR 409"));
                // console.log(JSON.stringify(e.response.data));
                let rate = e.response.data;
                this.editRate(rate);
              } else {
                this.validateError(e);
              }
            });
        } else {
          this.changeStatusIconRateReg(false, false, true);
          this.rateRegSaveDisabled = false;
          this.displaySmallMessage("warning", "Niepoprawne dane.");
        }
      } else {
        this.changeStatusIconRateReg(false, false, true);
        this.rateRegSaveDisabled = false;
        this.displaySmallMessage("warning", "Nie masz uprawnień do zapisu.");
      }
    },

    //
    //zapisuje nową stawkę podstawową do DB
    //
    saveRateOvertime() {
      console.log("saveRateOvertime() - start");
      this.changeStatusIconRateOver(true, false, false);
      this.rateOverSaveDisabled = true;
      if (this.employee.id == 0) {
        this.displaySmallMessage("warning", "Musisz najpierw zapisać pracownika.");
      } else if (this.hasAccessRateWrite) {
        if (this.validationRateOvertime) {
          this.addNewRateOvertimeDb(this.employee.id)
            .then((response) => {
              this.displaySmallMessage("success", "Dodano stawkę nadgodzinową.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIconRateOver(false, true, false);
              this.rateOverSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIconRateOver(false, false, true);
              this.rateOverSaveDisabled = false;
              this.validateError(e);
            });
        } else {
          this.changeStatusIconRateOver(false, false, true);
          this.rateOverSaveDisabled = false;
          this.displaySmallMessage("warning", "Niepoprawne dane.");
        }
      } else {
        this.changeStatusIconRateOver(false, false, true);
        this.rateOVerSaveDisabled = false;
        this.displaySmallMessage("warning", "Nie masz uprawnień do zapisu.");
      }
    },

    //
    //edit rate
    //
    editRate(rate) {
      this.$bvModal
        .msgBoxConfirm(
          `Stawka obowiązująca od tej daty (${moment(rate.dateFrom).format(
            "MMM YYYY"
          )}) już istnieje.Czy chcesz ją zastąpić?`,
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
          if (value) {
            console.log("which rate: " + this.whichRate);
            if (this.whichRate == "regular") {
              //  console.log("przed EDIT: "+rate);
              this.editRateRegularDB(this.idEmployee, rate).then((response) => {
                // console.log("po EDIT: "+JSON.stringify(response.data));
                this.displaySmallMessage("success", "Zaaktualizowano stawkę podstawową.");
                this.changeStatusIconRateReg(false, true, false);
              });
            }
            if (this.whichRate == "overtime") {
              // console.log("przed EDIT: "+rate);
              this.editRateRegularDB(this.idEmployee, rate).then((response) => {
                // console.log("po EDIT: "+JSON.stringify(response.data));
                this.displaySmallMessage("success", "Zaaktualizowano stawkę nadgodzinową.");
                this.changeStatusIconRateReg(false, true, false);
              });
            }
          }
        })
        .catch((err) => {
          this.validateError(e);
        });
    },

    changeStatusIconRateReg(busy, save, error) {
      this.rateRegBusyIcon = busy;
      this.rateRegErrorIcon = error;
      this.rateRegSavedIcon = save;
    },

    changeStatusIconRateOver(busy, save, error) {
      this.rateOverBusyIcon = busy;
      this.rateOverErrorIcon = error;
      this.rateOverSavedIcon = save;
    },

    //
    //delete rate
    //
    deleteRate(item, index, button) {
      this.$bvModal
        .msgBoxConfirm(`Czy chcesz usunąć stawkę:\n ${item.rateValue} zł od ${item.dateFrom}?`, {
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
            if (this.whichRate == "regular") {
              this.deleteRateRegularDB(item.idRate).then((response) => {
                this.getRateRegularAllFromDb(this.idEmployee).then((response) => {
                  // console.log(JSON.stringify(response.data));
                  this.rateAll = response.data;
                });
                this.displaySmallMessage("success", "Usunięto stawkę podstawową.");
              });
            }
            if (this.whichRate == "overtime") {
              this.deleteRateOvertimeDB(item.idRate).then((response) => {
                this.getRateOvertimeAllFromDb(this.idEmployee).then((response) => {
                  // console.log(JSON.stringify(response.data));
                  this.rateAll = response.data;
                });
                this.displaySmallMessage("success", "Usunięto stawkę nadgodzinową.");
              });
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    //---------------------------------------  CONVERT TO OPTION ----------------------------------------------------
    convertToOptionsEmployeeType(types) {
      console.log("convert to convertToOptionsEmployeeType...");
      // console.log(JSON.stringify(types));
      types.forEach((e) => {
        let opt = {
          value: e.name,
          text: e.viewName,
        };
        this.optionsEmployeesTypes.push(opt);
        // console.log(e.name + " - " + e.viewName);
      });
    },

    convertToOptionsEmployeeWorktime(wt) {
      console.log("convert to convertToOptionsEmployeeWorktime...");
      // console.log(JSON.stringify(wt));
      wt.forEach((e) => {
        let opt = {
          value: e.name,
          text: e.viewName,
        };
        this.optionsWorktime.push(opt);
        // console.log(e.name + " - " + e.viewName);
      });
    },
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
