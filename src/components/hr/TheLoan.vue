<template>
  <b-container id="container">
    <div class="text-left">
      <b-link class="text-progas" href="/hr/loan/all">--powrót do listy pożyczek--</b-link>
    </div>
    <b-card
      :title="isEdit == 'false' ? 'Dodawanie nowej pożyczki pracownika' : 'Edycja pożyczki'"
      bg-variant="dark"
    >
      <b-button
        v-show="loadingLoan"
        style="height: fit-content"
        variant="progas"
        class="ml-3"
        disabled
      >
        <b-spinner small></b-spinner>
        <span class="sr-only">Loading...</span>
      </b-button>
      <b-form @submit.stop.prevent="saveLoan" autocomplete="off">
        <!-- ROW-1 -->
        <div class="row">
          <!-- EMPLOYEE -->
          <b-form-group class="col" label="Pracownik:" label-for="input-employee">
            <div style="display: flex">
              <b-form-select
                v-model="loan.idEmployee"
                :options="optionsEmployee"
                :disabled="employeeDisabled"
                class="mb-3"
                id="employeeSelect"
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
          </b-form-group>
        </div>

        <!-- ROW-2 -->
        <div class="row">
          <!-- NAME -->
          <b-form-group class="col" label="Nazwa:" label-for="input-name">
            <b-form-input
              id="input-name"
              v-model="loan.name"
              :state="validationName"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationName">
              Nie może mieć więcej niż 50 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-3 -->
        <div class="row">
          <!-- DATE -->
          <b-form-group class="col" label="Data:" label-for="input-date">
            <b-form-input id="input-date" v-model="loan.date" type="date" required></b-form-input>
          </b-form-group>
        </div>

        <!-- ROW-4 -->
        <div class="row">
          <!--                    AMOUNT  LOAN       -->
          <b-form-group class="col" label="Kwota:" label-for="input-amount">
            <b-form-input
              id="input-amount"
              v-model="loan.amount"
              :state="validationAmountLoan"
              placeholder=""
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="validationAmountLoan">
              Kwota np: 1048.52 lub 3280
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-5 -->
        <div class="row">
          <!--                    AMOUNT LOAN INSTALLMENT        -->
          <b-form-group class="col" label="Wysokość raty:" label-for="input-amount">
            <b-form-input
              id="input-amount"
              v-model="loan.installmentAmount"
              :state="validationAmountInstallment"
              placeholder=""
              required
              title="Proponowna wysokość raty."
            ></b-form-input>
            <b-form-invalid-feedback :state="validationAmountInstallment">
              Kwota np: 1048.52 lub 3280
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- ROW-6 -->
        <div class="row">
          <!-- OTHER_INFO -->
          <b-form-group class="col" label="Inne informacje:" label-for="other-info">
            <b-form-textarea
              id="other-info"
              v-model="loan.otherInfo"
              rows="3"
              max-rows="6"
              :state="validationInfo"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="validationInfo">
              Pole nie może mieć więcej niż 150 znaków.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <b-button class="pl-5 pr-3" variant="btn-progas-save" :disabled="btnSaveDisabled" type="submit"
          >Zapisz
          <!-- <b-icon class="pl-2"  scale="1.8" icon="arrow-bar-up" variant="success"  aria-hidden="true"></b-icon> -->
          <b-icon
            v-if="iconSave"
            class="pl-2"
            scale="1.8"
            icon="save"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="iconSaved"
            class="pl-2"
            scale="2.6"
            icon="check"
            variant="success"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="iconError"
            class="pl-2"
            scale="1.6"
            icon="x-circle"
            variant="danger"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="iconBusy"
            icon="arrow-clockwise"
            animation="spin-pulse"
            font-scale="1"
          ></b-icon>
        </b-button>
      </b-form>
      <template #footer> </template>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { employeeMixin } from "@/mixins/employee";
import { loanMixin } from "@/mixins/loan";
export default {
  name: "Loan",
  mixins: [errorMixin, employeeMixin, loanMixin],
  data() {
    return {
      idLoan: 0,
      isEdit: false,

      //employee
      selectedEmployee: 0,
      employeeDisabled: false,
      optionsEmployee: [],

      iconSave: true,
      iconBusy: false,
      iconSaved: false,
      btnSaveDisabled: false,
      iconError: false,
    };
  },
  mounted() {
    console.log("mounted");
    // let idTemp = this.$route.params.idUser;
    this.isEdit = this.$route.params.isEdit;
    // console.log("TempID: " + idTemp + ", edit: " + this.$route.params.isEdit);
    this.idLoan = this.$route.params.idLoan;
    this.getLoanIfEdit();
  },
  created() {
    console.log("created");
    // this.getEmployees();
  },
  computed: {
    ...mapGetters(["getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return (
          token2.authorities.includes("HR_LOAN_READ_ALL") ||
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
        return token2.authorities.includes("HR_LOAN_READ");
      } catch (error) {
        return false;
      }
    },

    validationName() {
      return this.loan.name.length > 0 && this.loan.name.length <= 50;
    },
    validationInfo() {
      return this.loan.otherInfo.length <= 150;
    },

    validationAmountLoan() {
      return (
        this.loan.amount.length > 0 &&
        this.loan.amount.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.loan.amount) || /^[0-9]+$/.test(this.loan.amount))
      );
    },
    validationAmountInstallment() {
      return (
        this.loan.installmentAmount.length > 0 &&
        this.loan.installmentAmount.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.loan.installmentAmount) ||
          /^[0-9]+$/.test(this.loan.installmentAmount))
      );
    },
  },
  methods: {
    //-------------------------------------------LOAN-------------------------------------------

    //
    //get loan if edit
    //
    async getLoanIfEdit() {
      console.log("START - getLoanIfEdit()), idLoan = " + this.idLoan + ", isEdit: " + this.isEdit);
      if (this.isEdit == "true") {
        this.loadingLoan = true;
        await this.getEmployees("ALL");
        this.getLoanByIdFromDb(this.idLoan).then((response) => {
          this.loan = response.data;
          // console.log(JSON.stringify(this.loan));
          this.employeeDisabled = true;
          this.loadingLoan = false;
        });
      } else {
        this.getEmployees("HIRED");
      }
      console.log("END - getLoanIfEdit()), ID = " + this.idLoan);
    },

    saveLoan() {
      this.btnSaveDisabled = true;
      this.changeStatusIcon(true, false, false);
      if (!this.validLoan()) {
        this.changeStatusIcon(false, false, true);
        this.btnSaveDisabled = false;
        this.displaySmallMessage("warning", "Niepoprawne dane.");
      } else {
        if (this.loan.idLoan == 0) {
          this.loan.loanStatus = "TO_PAY";
          this.addLoanToDB()
            .then((response) => {
              this.loan.idLoan = response.data;
              this.displaySmallMessage("success", "Dodano nową pożyczkę.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIcon(false, true, false);
              this.btnSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIcon(false, false, true);
              this.btnSaveDisabled = false;
              this.validateError(e);
            });
        } else {
          this.updateLoanDb()
            .then((response) => {
              // this.loan = response.data;
              this.displaySmallMessage("success", "Zaktualizowano pożyczkę pracownika.");
              // console.log(JSON.stringify(response.data));
              this.changeStatusIcon(false, true, false);
              this.btnSaveDisabled = false;
            })
            .catch((e) => {
              this.changeStatusIcon(false, false, true);
              this.btnSaveDisabled = false;
              this.validateError(e);
            });
        }
      }
    },

    validLoan() {
      return (
        this.validationName &&
        this.validationAmountInstallment &&
        this.validationInfo &&
        this.validationAmountLoan
      );
    },

    changeStatusIcon(busy, save, error) {
      this.iconBusy = busy;
      this.iconError = error;
      this.iconSaved = save;
    },
    //---------------------------------------  CONVERT TO OPTION ----------------------------------------------------
    convertToOptionsEmployee() {
      console.log("START - convertToOptionsEmployee()");
      this.employees.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsEmployee.push(opt);
        console.log(e.id + " " + e.lastName);
      });
      console.log("END - convertToOptionsEmployee()");
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
