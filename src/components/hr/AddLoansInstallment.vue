<template>
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie pożyczek</h1>
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
          href="/hr/AddWorkTime"
          :disabled="!hasAccessAddWorktime"
          >Godzin</b-button
        >
        <b-button variant="outline-progas" href="/hr/AddAdvances" :disabled="!hasAccessHrAdvance"
          >Zaliczek</b-button
        >
      </div>
      <b-row align-h="center">
        <b-col>
          <b-form class="" @submit.prevent="addLoanInstallment">
            <!--                    EMPLOYEE          -->
            <div>
              <label class="form-label mt-5 max-width" for="employeeSelect">
                Wybierz pracownika:
                <div style="display: flex">
                  <b-form-select
                    v-model="selectedEmployee"
                    :options="optionsEmployee"
                    :disabled="employeeDisabled"
                    class="mb-3"
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

            <!--                     LOAN                       -->
            <div id="loan-type">
              <b-form-group class="max-width" label="Wybierz pożyczkę:" label-for="input-loan">
                <div style="display: flex">
                  <b-form-select
                    id="input-loan"
                    v-model="selectedLoan"
                    :options="optionLoans"
                    @change="onLoanChange"
                    :disabled="loanDisabled"
                    required
                  >
                    <!-- This slot appears above the options from 'options' prop -->
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Wybierz pożyczkę --
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-button
                    v-if="loadingLoan"
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

            <!--                    DATE         -->
            <div id="date-amount">
              <b-form-group class="max-width mr-2" label="Data:" label-for="input-date">
                <b-form-input
                  id="input-date"
                  v-model="loanDateString"
                  type="date"
                  @change="onDateChange"
                  required
                ></b-form-input>
              </b-form-group>

              <!--                    AMOUNT         -->
              <b-form-group class="max-width ml-2" label="Kwota:" label-for="input-amount">
                <b-form-input
                  id="input-amount"
                  v-model="loanInsallment.amount"
                  :state="validationAmount"
                  placeholder=""
                  required
                ></b-form-input>
                <b-form-invalid-feedback :state="validationAmount">
                  np: 100.52 lub 300 nie większa niż <b> {{ amountLeftToPay }}</b
                  >.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>

            <!-- OTHER INFO -->
            <b-form-group class="max-width" label="Dodatkowe informacje:" label-for="input-info">
              <b-form-input
                id="input-info"
                v-model="loanInsallment.otherInfo"
                :state="validationLoanInstalmentInfo"
                placeholder=""
              ></b-form-input>
              <b-form-invalid-feedback :state="validationLoanInstalmentInfo">
                Pole nie może mieć więcej niż 100 znaków.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- BTN CANCEL -->
            <b-button
              class="mt-3 mr-2"
              style="width: 120px"
              type="reset"
              variant="progas"
              @click="cancelLoanInstallment"
              v-if="employeeDisabled"
              >Anuluj
            </b-button>

            <!-- BTN SAVE -->
            <b-button class="mt-3" style="width: 120px" type="submin" variant="btn-progas-save"
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
          </b-form>
        </b-col>

        <!--                TABELA-->
        <b-col>
          <div class="mt-5">
            <b-table
              class="pt-3"
              :busy="isBusy"
              :items="loanInsallments"
              :fields="fields"
              :tbody-tr-class="rowClass"
              id="table"
              responsive="sm"
              thead-tr-class="text-progas"
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
                    v-if="hasAccessLoanWrite"
                    size="sm"
                    @click="editLoanInstallment(row.item)"
                    class="mr-2"
                    variant="progas"
                    title="Edycja raty pożyczki."
                  >
                    Edit
                  </b-button>
                  <!-- DELETE -->
                  <b-button
                    v-if="hasAccessLoanDelete"
                    size="sm"
                    @click="deleteLoanInstallment(row.item)"
                    class="mr-2 bg-danger"
                    title="Usuń ratę pożyczki."
                  >
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </template>
            </b-table>
            <div id="loanSum">Razem: {{ loanInstallmentSum }} zł</div>
          </div>
        </b-col>
      </b-row>
      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { loanMixin } from "@/mixins/loan";
import { mapGetters } from "vuex";
import { employeeMixin } from "@/mixins/employee";
import jwt_decode from "jwt-decode";
export default {
  name: "SalaryAddLoanInstallment",
  mixins: [employeeMixin, loanMixin, errorMixin],
  data() {
    return {
      fields: [
        {
          key: "date",
          label: "Data",
        },
        {
          key: "amount",
          label: "Kwota",
        },
        {
          key: "loanName",
          label: "Nazwa",
        },
        {
          key: "otherInfo",
          label: "Info",
        },
        {
          key: "action",
          label: "Akcja",
        },
      ],
      busyIcon: false,
      btnDisabled: false,

      isBusy: false,
      isEdit: false,

      employeeDisabled: false,
      loanDisabled: false,
      btnSaveTitle: "Dodaj",

      busyIcon: false,
      savedIcon: false,
      errorIcon: false,

      optionLoans: [],
      optionsEmployee: [],

      selectedEmployee: null,
      selectedLoan: null,

      loanDateString: "",
      loanDateMonthOld: "",
      loanDateYearOld: "",
      loanDate: moment(),

      loanInstallmentSum: 0,
      amountLeftToPay: 0,

      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  created() {
    moment.locale("pl");
    this.getEmployees("HIRED");
    this.selectedEmployee = null;
    this.selectedLoan = null;
    this.loanDateString = this.loanDate.format("YYYY-MM-DD");
    this.loanDateMonthOld = this.loanDate.format("MM");
    this.loanDateYearOld = this.loanDate.format("YYYY");
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
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
    hasAccessLoanWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_LOAN_WRITE_ALL: " + token2.authorities.includes('HR_LOAN_WRITE_ALL'))
        return (
          token2.authorities.includes("HR_LOAN_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessLoanDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_LOAN_DELETE_ALL: " + token2.authorities.includes('HR_LOAN_DELETE_ALL'))
        return (
          token2.authorities.includes("HR_LOAN_DELETE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
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
    hasAccessAddWorktime() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return (
          token2.authorities.includes("ROLE_HR_WORKTIME") ||
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
      }
    },
    validationAmount() {
      return (
        parseFloat(this.loanInsallment.amount) <= this.amountLeftToPay &&
        this.loanInsallment.amount.length > 0 &&
        this.loanInsallment.amount.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.loanInsallment.amount) ||
          /^[0-9]+$/.test(this.loanInsallment.amount))
      );
    },
    validationLoanInstalmentInfo() {
      return this.loanInsallment.otherInfo.length <= 100;
    },
  },
  methods: {
    rowClass(item, type) {
      return "text-progas";
      // if (!item || type !== 'row') return
      // if (item.isHoliday === true) return "table-dark";
      // if (item.isHoliday === true) return "worktime1"
      // if (item.isHoliday === true) return {
      //     classes: 'worktime-table',
      //     css: {"color": "blue"}
      // }
    },

    onEmployeeChange() {
      console.log("onEmployeeChange() - start");
      console.log("selectedEmployee: " + this.selectedEmployee);
      console.log("for date: " + this.loanDateString);
      this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null) {
        this.getLoansToCB(this.selectedEmployee, "TO_PAY");
        this.getLoanInstallmentsAllByEmployeeFromDB(this.selectedEmployee, this.loanDateString);
      }
      this.selectedLoan = null;
      this.amountLeftToPay = "...";
    },

    onLoanChange() {
      console.log("onLoanChange() - start");
      console.log("selectedEmployee: " + this.selectedEmployee);
      console.log("selectedLoan: " + this.selectedLoan);
      this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null && this.selectedLoan != null) {
        this.getLoanByIdFromDb(this.selectedLoan)
          .then((response) => {
            let leftToPay = 0;
            this.loan = response.data;
            this.loanInsallment.amount = this.loan.installmentAmount;
            response.data.installmentDtoList.forEach((element) => {
              leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
            });
            this.amountLeftToPay = (
              parseFloat(response.data.amount.replace(",", ".")) - leftToPay
            ).toFixed(2);
          })
          .catch((e) => {
            this.validateError(e);
          });
      }
    },

    onDateChange() {
      this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null) {
        this.loanDate = moment(this.loanDateString);
        let newMonth = moment(this.loanDateString).format("MM");
        let newYear = moment(this.loanDateString).format("YYYY");
        if (this.loanDateMonthOld != newMonth || this.loanDateYearOld != newYear) {
          this.getLoanInstallmentsAllByEmployeeFromDB(this.selectedEmployee, this.loanDateString);
          this.loanDateMonthOld = this.loanDate.format("MM");
          this.loanDateYearOld = this.loanDate.format("YYYY");
        }
      }
    },

    //
    // add loanInstallment
    //
    addLoanInstallment() {
      this.changeIconStatus(true, false, false);
      this.btnDisabled = true;

      if (this.selectedEmployee > 0 && this.selectedLoan > 0 && this.isValidLoan()) {
        this.loanInsallment.idLoan = this.selectedLoan;
        this.loanInsallment.date = this.loanDateString;
        // console.log(JSON.stringify(this.loanInsallment));
        if (this.isEdit) {
          this.editLoanInstallmentDB()
            .then((response) => {
              // console.log(JSON.stringify(response.data));
              this.getLoanInstallmentsAllByEmployeeFromDB(
                this.selectedEmployee,
                this.loanDateString
              );
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              this.displaySmallMessage("success", "Zaktualizowano ratę pożyczki.");
              //reset
              this.cancelLoanInstallment();
              this.getLoanByIdFromDb(this.loanInsallment.idLoan).then((response) => {
                let leftToPay = 0;
                response.data.installmentDtoList.forEach((element) => {
                  leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
                });
                this.amountLeftToPay = (
                  parseFloat(response.data.amount.replace(",", ".")) - leftToPay
                ).toFixed(2);
                if (this.amountLeftToPay == 0.0) {
                  this.payedLoan(this.loan.name, this.loan.amount, this.loan.idLoan);
                }
              });
            })
            .catch((e) => {
              this.changeIconStatus(false, false, true);
              this.btnDisabled = false;
              this.validateError(e);
            });
        } else {
          this.addLoanInstallmentToDB()
            .then((response) => {
              this.getLoanInstallmentsAllByEmployeeFromDB(
                this.selectedEmployee,
                this.loanDateString
              );
              // console.log(JSON.stringify(response.data));
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              this.displaySmallMessage("success", "Dodano ratę pożyczki.");
              //reset
              this.cancelLoanInstallment();
              this.getLoanByIdFromDb(this.loanInsallment.idLoan).then((response) => {
                let leftToPay = 0;
                response.data.installmentDtoList.forEach((element) => {
                  leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
                });
                this.amountLeftToPay = (
                  parseFloat(response.data.amount.replace(",", ".")) - leftToPay
                ).toFixed(2);
                if (this.amountLeftToPay == 0.0) {
                  this.payedLoan(this.loan.name, this.loan.amount, this.loan.idLoan);
                }
              });
            })
            .catch((e) => {
              console.log("error vue");
              this.changeIconStatus(false, false, true);
              this.btnDisabled = false;
              this.validateError(e);
            });
        }
      } else {
        this.displaySmallMessage("warning", "Niepoprawne dane.");
        this.changeIconStatus(false, false, true);
        this.btnDisabled = false;
      }
    },

    //
    //change payed loan status
    //
    payedLoan(name, amount, idLoan) {
      let msg = `Spłaciłeś pożyczkę ${name} na kwotę ${amount}zł? \n 
        Czy chcesz oznaczyć pożyczkę jako spłaconą?`;
      this.$bvModal
        .msgBoxConfirm(msg, {
          title: "Potwierdzenie",
          size: "sm",
          buttonSize: "sm",
          okVariant: "progas-save",
          okTitle: "TAK",
          cancelTitle: "NIE",
          cancelVariant: "progas-cancel",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.setLoanStatusDb(idLoan, "PAID_OFF").then((response) => {
              this.displaySmallMessage("success", "Zmieniono status pożyczki.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    isValidLoan() {
      return this.validationAmount && this.validationLoanInstalmentInfo;
    },

    changeIconStatus(busy, save, error) {
      this.busyIcon = busy;
      this.errorIcon = error;
      this.savedIcon = save;
    },

    //
    //edit loan installment
    //
    editLoanInstallment(item) {
      console.log("editLoanInstallment(): " + item.idLoanInstallment);
      // console.log(JSON.stringify(item));
      this.selectedLoan = item.idLoan;
      this.employeeDisabled = true;
      this.loanDisabled = true;
      this.isEdit = true;
      this.btnSaveTitle = "Zapisz";
      this.loanDateString = item.date;
      this.loanInsallment.amount = item.amount;
      this.loanInsallment.otherInfo = item.otherInfo;
      this.loanInsallment.idLoanInstallment = item.idLoanInstallment;
      this.getLoanByIdFromDb(this.selectedLoan).then((response) => {
        let leftToPay = 0;
        this.loan = response.data;
        response.data.installmentDtoList.forEach((element) => {
          leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
        });
        this.amountLeftToPay = (
          parseFloat(response.data.amount.replace(",", ".")) - leftToPay
        ).toFixed(2);

        if (this.amountLeftToPay == 0.0) {
          this.amountLeftToPay = item.amount;
          this.setLoanStatusDb(item.idLoan, "TO_PAY");
        } else {
          this.amountLeftToPay = (
            parseFloat(this.amountLeftToPay.replace(",", ".")) +
            parseFloat(item.amount.replace(",", "."))
          ).toFixed(2);
        }
      });
    },

    //
    //delete loan installment
    //
    deleteLoanInstallment(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć ratę:\n z dnia ${item.date} na kwotę ${item.amount} zł?`,
          {
            title: "Potwierdzenie",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "TAK",
            cancelTitle: "NIE",
            footerClass: "p-2",
            hideHeaderClose: true,
            centered: true,
          }
        )
        .then((value) => {
          if (value) {
            this.deleteLoanInstallmentDB(item.idLoanInstallment).then(async (response) => {
              this.getLoanInstallmentsAllByEmployeeFromDB(
                this.selectedEmployee,
                this.loanDateString
              );

              await this.getLoanByIdFromDb(item.idLoan).then((response) => {
                let leftToPay = 0;
                response.data.installmentDtoList.forEach((element) => {
                  leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
                });
                this.amountLeftToPay = (
                  parseFloat(response.data.amount.replace(",", ".")) - leftToPay
                ).toFixed(2);
              });

              this.displaySmallMessage("success", "Usunięto ratę pożyczki.");
              if (response.status == 204 && item.amount == this.amountLeftToPay) {
                this.setLoanStatusDb(item.idLoan, "TO_PAY");
              }
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    cancelLoanInstallment() {
      console.log("cancelLoanInstallment()");
      this.employeeDisabled = false;
      this.loanDisabled = false;
      this.btnSaveTitle = "Dodaj";
      this.isEdit = false;
      this.resetForm();
    },
    resetForm() {
      this.selectedLoan = null;
      this.loanInsallment.otherInfo = "";
      this.loanInsallment.amount = "";
      this.loanInsallment.idLoanInstallment = null;
      this.amountLeftToPay = "...";
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    //------------------------------------------------DB-------------------------------------
    getLoansToCB(idEmployee, loanStatus) {
      console.log(
        "START - getLoansToCB(idEmployee: " + idEmployee + ", status: " + loanStatus + ")"
      );
      this.isBusy = true;
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(
          this.urlEmpl + `/api/employee/loan/query/` + idEmployee + `?status=` + loanStatus,
          header
        )
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          this.loansAll = response.data;
          console.log("getLoansToCB() - Ilosc loans[]: " + response.data.length);
          this.isBusy = false;
          this.convertToOptionsLoans();

          console.log(
            "END - getLoansToCB(idEmployee: " + idEmployee + ", status: " + loanStatus + ")"
          );
        })
        .catch((e) => {
          this.isBusy = false;
          this.validateError(e);
        });
    },
    //---------------------------------------  CONVERT TO OPTION ----------------------------------------------------
    convertToOptionsEmployee() {
      console.log("convertToOptionsEmployee() ...");
      this.employees.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.lastName + " " + e.firstName,
        };
        this.optionsEmployee.push(opt);
        // console.log(e.id + " " + e.lastName);
      });
    },
    convertToOptionsLoans() {
      console.log("convertToOptionsLoans() ...");
      this.optionLoans = [];
      this.loansAll.forEach((e) => {
        let opt = {
          value: e.idLoan,
          text: e.name,
        };
        this.optionLoans.push(opt);
        // console.log(e.idLoan + " " + e.name);
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
  /* color: red; */
}

.text {
  margin-right: 5px;
}

#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

/* #btn-new-addition {
  width: 100px;
  display: flex;
  align-items: center;
} */

/* #addition-type {
  display: flex;
  justify-content: space-around;
} */

#date-amount {
  display: flex;
  justify-content: space-around;
}
.max-width {
  width: -webkit-fill-available;
}

#loanSum {
  text-align: justify;
  font-size: large;
}
</style>
