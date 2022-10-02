<template>
  <b-container fluid id="container">
    <b-row class="mt-5">
      <b-col>
        <!-- --------------------------------- TABELA ---------------------------------- -->
        <b-table
          striped
          small
          :busy="isBusy"
          :items="loanListDisplay"
          :fields="fields"
          :tbody-tr-class="rowClass"
          id="table"
          responsive="sm"
          thead-tr-class="table-bg text-dark"
        >
          <!-- ICON BUSY -->
          <template #table-busy>
            <div class="text-center text-progas my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>

          <template #cell(status)="row">
            <!-- ---------------------------- Status icons -------------------------------- -->
            <div>
              <!-- Enabled -->
              <b-button
                v-if="row.item.loanStatus == 'PAID_OFF'"
                size="sm"
                variant="outline"
                @click="changeLoanStatus(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4 pt-1"
                  scale="1.3"
                  icon="credit-card-fill"
                  variant="success"
                  aria-hidden="true"
                  title="Zmień status pożyczki na NIE-SPŁACONA"
                ></b-icon>
              </b-button>
              <b-button
                v-else
                size="sm"
                variant="outline"
                @click="changeLoanStatus(row.item, row.index, $event.target)"
              >
                <b-icon
                  class="pr-4"
                  scale="1.3"
                  icon="credit-card-fill"
                  variant="danger"
                  aria-hidden="true"
                  title="Zmień status pożyczki na SPŁACONA"
                ></b-icon>
              </b-button>
            </div>
          </template>

          <!-- ----------------------------------AKCJA --------------------------------- -->
          <template #cell(action)="row">
            <b-button-group>
              <!-- DETAILS -->
              <b-button
                size="sm"
                @click="row.toggleDetails"
                variant="progas"
                class="mr-2"
                title="Rozwiń szczegóły"
              >
                <b-icon icon="three-dots" aria-hidden="true"></b-icon>
              </b-button>
              <!-- OWN PAYMENT -->
              <b-button
                v-if="hasAccessLoanWrite"
                size="sm"
                @click="showOwnPaymentModal(row.item)"
                variant="progas"
                class="mr-2"
                title="Wpłata własna"
              >
                <b-icon icon="cash" aria-hidden="true"></b-icon>
              </b-button>
              <!-- LOAN INSTALLMENT -->
              <b-button
                v-if="hasAccessLoanRead"
                size="sm"
                @click="showLoanInstallmentHistoryModal(row.item)"
                class="mr-2 bg"
                variant="progas"
                title="Historia wpłat"
              >
                <b-icon icon="list" aria-hidden="true"></b-icon>
              </b-button>
              <!-- EDIT -->
              <b-button
                v-if="hasAccessLoanWrite"
                size="sm"
                @click="editLoan(row.item)"
                class="mr-2"
                variant="progas"
                title="Edycja pożyczki"
              >
                Edit
              </b-button>
              <!-- DELETE -->
              <b-button
                v-if="hasAccessLoanDelete"
                size="sm"
                @click="deleteLoan(row.item, row.index, $event.target)"
                class="mr-2 bg-danger"
                title="Usuń pożyczkę"
              >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>

          <!-- --------------------DETAILS----------------------- -->
          <template #row-details="row">
            <b-card id="details-loan">
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-left">Inne informacje: {{ row.item.otherInfo }}</b-col>
              </b-row>
            </b-card>
          </template>
        </b-table>
      </b-col>

      <!-- ----------------------------------SIDE CARD --------------------------------- -->
      <b-col cols="12" md="auto" class="mb-3">
        <b-card id="card-info" bg-variant="dark" header-tag="header">
          <template #header>
            <b-button variant="progas" @click="newLoan">Nowa pożyczka</b-button>
          </template>

          <b-card-text class="text-left pl-3 mb-1">Wszystkie / {{ calculateAll }}</b-card-text>
          <b-card-text class="text-left pl-3 mb-1 color-green"
            >Spłacone / {{ calculatePaid }}</b-card-text
          >
          <b-card-text class="text-left pl-3 mb-1 color-red"
            >Nie spłacone / {{ calculateToPay }}</b-card-text
          >
          <!-- <div class="text-center px-xl-3"> -->
          <!-- </div> -->
          <hr class="my-4" style="color: yellow; background-color: yellow" />

          <b-form-group label="Wyświetl:">
            <b-form-radio
              v-model="selectedDisplay"
              class="pb-1"
              value="ALL"
              @change="displayRadio($event)"
              >Wszystkie
            </b-form-radio>
            <b-form-radio
              v-model="selectedDisplay"
              class="color-green pb-1"
              value="PAID_OFF"
              @change="displayRadio($event)"
              >Spłacone</b-form-radio
            >
            <b-form-radio
              v-model="selectedDisplay"
              class="color-red pb-1"
              value="TO_PAY"
              @change="displayRadio($event)"
              >Nie spłacone</b-form-radio
            >
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <!-- Display loan installment -->
    <b-modal
      ref="loanInstallmentHistoryModal"
      centered
      title="Zapłacone raty"
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
        <b-table :items="loanInsallments" :fields="fieldsLoanInstallment" id="table">
          <!-- ----------------------------------AKCJA --------------------------------- -->
          <template #cell(ownRepayment)="row">
            <div>
              <b-icon
                v-if="row.item.ownRepayment"
                class="pr-4 pt-1"
                scale="1.9"
                icon="check"
                variant="success"
                aria-hidden="true"
              ></b-icon>
            </div>
          </template>

          <template #cell(action)="row">
            <b-button-group>
              <!-- DETAILS -->
              <b-button
                size="sm"
                @click="row.toggleDetails"
                variant="progas"
                class="mr-2"
                title="Rozwiń szczegóły"
              >
                <b-icon icon="three-dots" aria-hidden="true"></b-icon>
              </b-button>
              <!-- DELETE -->
              <b-button
                v-if="hasAccessLoanDelete && row.item.ownRepayment"
                size="sm"
                @click="deleteLoanInstallment(row.item)"
                class="mr-2 bg-danger"
                title="Usuń wpłatę własną."
              >
                <b-icon icon="trash" aria-hidden="true"></b-icon>
              </b-button>
            </b-button-group>
          </template>
          <!-- --------------------DETAILS----------------------- -->
          <template #row-details="row">
            <b-card id="details">
              <b-row class="mb-2">
                <b-col sm="12" class="text-sm-left"
                  >Inne informacje: {{ row.item.otherInfo }}</b-col
                >
              </b-row>
            </b-card>
          </template>
        </b-table>
      </div>
    </b-modal>

    <!-- Add own payment -->
    <b-modal
      ref="ownPaymentModal"
      centered
      title="Wpłata własna"
      header-bg-variant="dark"
      header-text-variant="progas"
      body-bg-variant="dark"
      body-text-variant="progas"
      footer-bg-variant="dark"
      footer-text-variant="progas"
    >
      <div>
        <h5 class="text-danger text-center">"Wpłata własna" nie odejmuje się od wypłaty!"</h5>
        <b-form class="" @submit.prevent="addOwnPaymant">
          <!--                    DATE         -->
          <div id="date-amount">
            <b-form-group class="max-width" label="Data:" label-for="input-date">
              <b-form-input
                id="input-date"
                v-model="loanInsallment.date"
                type="date"
                required
              ></b-form-input>
            </b-form-group>

            <!--                    AMOUNT         -->
            <b-form-group class="max-width" label="Kwota:" label-for="input-amount">
              <b-form-input
                id="input-amount"
                v-model="loanInsallment.amount"
                :state="validationAmount"
                placeholder=""
                required
                autofocus
              ></b-form-input>
              <b-form-invalid-feedback :state="validationAmount">
                Kwota np: 1048.52 lub 3280 nie większa niż {{ amountLeftToPay }}.
              </b-form-invalid-feedback>
            </b-form-group>

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
          </div>
        </b-form>
        <p>* pozostało do spłaty: {{ amountLeftToPay }} zł.</p>
      </div>
      <template #modal-footer>
        <b-button variant="progas-cancel" @click="resetLoanInstallmentModal"> Anuluj </b-button>
        <b-button type="submin" variant="progas-save" @click="addOwnPaymant"> Zapisz </b-button>
      </template>
    </b-modal>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>
<script>
import router from "@/router";
import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
import { errorMixin } from "@/mixins/error";
import { employeeMixin } from "@/mixins/employee";
import moment from "moment";
import { loanMixin } from "@/mixins/loan";
export default {
  name: "Loans",
  mixins: [errorMixin, employeeMixin, loanMixin],
  data() {
    return {
      timeAlmostUp: 30,
      fields: [
        {
          key: "employee",
          label: "Pracownik",
          sortable: true,
        },
        {
          key: "name",
          label: "Nazwa",
        },
        {
          key: "amount",
          label: "Kwota",
          isActive: true,
          sortable: true,
        },
        {
          key: "date",
          label: "Data",
          sortable: true,
        },
        {
          key: "installmentAmount",
          label: "Rata",
        },
        {
          key: "amountToPay",
          label: "Do spłaty",
          sortable: true,
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "action",
          label: "Akcja",
        },
      ],
      fieldsLoanInstallment: [
        {
          key: "date",
          label: "Data",
        },
        {
          key: "amount",
          label: "Kwota",
        },
        {
          key: "ownRepayment",
          label: "Wpłata własna",
          class: "text-center",
        },
        {
          key: "action",
          label: "Akcja",
        },
      ],
      isBusy: false,
      loanListDisplay: [],
      loanInstallmentSum: 0,
      selectedDisplay: "TO_PAY",
      amountLeftToPay: 0,

      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  created() {
    this.getLoansByAccess("ALL");
    moment.locale("pl");
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
    hasAccessLoanRead() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_LOAN_READ_ALL: " + token2.authorities.includes('HR_LOAN_READ_ALL'))
        return (
          token2.authorities.includes("HR_LOAN_READ_ALL") ||
          token2.authorities.includes("HR_LOAN_READ") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
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
    calculateAll() {
      return this.loansAll.length;
    },
    calculatePaid() {
      let count = 0;
      this.loansAll.forEach((loan) => {
        if (loan.loanStatus == "PAID_OFF") {
          count++;
        }
      });
      return count;
    },
    calculateToPay() {
      let count = 0;
      this.loansAll.forEach((loan) => {
        if (loan.loanStatus == "TO_PAY") {
          count++;
        }
      });
      return count;
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
      // if (!item || type !== 'row') return
      //if (item.isHoliday === true) return "table-dark";
      return "color-progas-yellow";
    },

    showLoanInstallmentHistoryModal(item) {
      this.getLoanInstallmentsByLoanIdFromDB(item.idLoan)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          response.data.forEach((element) => {
            let sum = 0;
            sum = sum + parseFloat(element.amount.replace(",", "."));
            this.loanInstallmentSum = sum.toFixed(2);
          });
          this.loanInsallments = response.data;
          this.$refs["loanInstallmentHistoryModal"].show();
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //add new loan
    //
    newLoan() {
      console.log("newLoan()");
      if (this.hasAccessLoanWrite) {
        router.push({
          name: "TheLoan",
          params: { idLoan: 0, isEdit: "false" },
        });
      } else this.displaySmallMessage("danger", "Nie masz uprawnień do dodawania pożyczek.");
    },

    //
    //add own payment
    //
    showOwnPaymentModal(item) {
      console.log("START - showOwnPaymentModal()");
      this.getLoanByIdFromDb(item.idLoan).then((response) => {
        this.loan = response.data;
        let leftToPay = 0;
        response.data.installmentDtoList.forEach((element) => {
          leftToPay = leftToPay + parseFloat(element.amount.replace(",", "."));
        });
        this.amountLeftToPay = (
          parseFloat(response.data.amoun.replace(",", ".")) - leftToPay
        ).toFixed(2);
        this.loanInsallment.date = moment().format("YYYY-MM-DD");
        (this.loanInsallment.idLoan = item.idLoan),
          (this.loanInsallment.ownRepayment = true),
          (this.loanInsallment.amount = ""),
          (this.loanInsallment.othetInfo = ""),
          this.$refs["ownPaymentModal"].show();
      });
      console.log("END - showOwnPaymentModal()");
    },

    async addOwnPaymant() {
      console.log("START - addOwnPaymant()");
      if (this.validationAmount && this.validationLoanInstalmentInfo) {
        // console.log(JSON.stringify(this.loanInsallment));
        await this.addLoanInstallmentToDB();
        this.$refs["ownPaymentModal"].hide();

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
          } else {
            this.getLoansByAccess("ALL");
          }
        });
      }
      console.log("END - addOwnPaymant()");
    },

    //
    //edit loan
    //
    editLoan(item) {
      console.log("editLoan(): " + item.idLoan);
      router.push({
        name: "TheLoan",
        params: { idLoan: item.idLoan, isEdit: "true" },
      });
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
              this.getLoansByAccess("ALL");
              this.displaySmallMessage("success", "Zmieniono status pożyczki.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    //
    //change status loan
    //
    changeLoanStatus(item) {
      console.log("START - changeLoanStatus id: " + item.idLoan + ", status: " + item.loanStatus);
      if (this.hasAccessLoanWrite) {
        this.$bvModal
          .msgBoxConfirm(
            `Czy chcesz zmienić status pożyczki: ${item.name} pracownika:
        ${item.employee} na
         ${item.loanStatus == "TO_PAY" ? "SPŁACONA" : "NIE SPŁACONA"}?`,
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
            // console.log(value);
            if (value) {
              this.setLoanStatusDb(
                item.idLoan,
                item.loanStatus == "TO_PAY" ? "PAID_OFF" : "TO_PAY"
              ).then((response) => {
                this.getLoansByAccess("ALL");
              });
            }
          })
          .catch((err) => {
            // An error occurred
          });
      } else this.displaySmallMessage("danger", "Nie masz uprawnień do zmiany statusu pożyczki.");
    },

    //
    //delete loan
    //
    deleteLoan(item, index, button) {
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć pożyczkę pracownika\n ${item.employee} na kwotę ${item.amount}zł?`,
          {
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
          }
        )
        .then((value) => {
          if (value) {
            this.deleteLoanDB(item.idLoan).then((response) => {
              this.getLoansByAccess("ALL");
              this.displaySmallMessage("success", "Usunięto pożyczkę.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    //
    //delete loan installment
    //
    deleteLoanInstallment(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć ratę pożyczki z dnia ${item.date} na kwotę ${item.amount}zł?`,
          {
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
          }
        )
        .then((value) => {
          if (value) {
            this.deleteLoanInstallmentDB(item.idLoanInstallment).then(async (response) => {
              this.getLoanInstallmentsByLoanIdFromDB(item.idLoan).then((response) => {
                this.loanInsallments = response.data;
              });
              this.displaySmallMessage("success", "Usunięto ratę pożyczki.");
              if (response.status == 204) {
                await this.setLoanStatusDb(item.idLoan, "TO_PAY");
              }
              this.getLoansByAccess("ALL");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    resetLoanInstallmentModal() {
      this.loanInsallment.date = moment().format("YYYY-MM-DD");
      this.idLoan = 0;
      this.ownRepayment = false;
      this.amount = "";
      this.date = "";
      this.othetInfo = "";
      this.$refs["ownPaymentModal"].hide();
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    //-------------------------------------------DISPLAY-------------------------------------------
    displayRadio(event) {
      console.log("DisplayRadio(): " + event);
      if (event == "ALL") {
        this.loanListDisplay = [];
        this.loansAll.forEach((loan) => {
          this.loanListDisplay.push(loan);
        });
      } else if (event == "PAID_OFF") {
        this.loanListDisplay = [];
        this.loansAll.forEach((loan) => {
          if (loan.loanStatus == "PAID_OFF") {
            this.loanListDisplay.push(loan);
          }
        });
      } else if (event == "TO_PAY") {
        this.loanListDisplay = [];
        this.loansAll.forEach((loan) => {
          if (loan.loanStatus == "TO_PAY") {
            this.loanListDisplay.push(loan);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
#container {
  color: rgba(255, 245, 0, 0.8);
  margin-top: 20px;
}

#card-info {
  width: 200px;
}

#table {
  color: rgba(255, 245, 0, 0.8);
}

#details {
  background-color: #343a40;
  border-block-color: rgba(255, 245, 0, 0.8);
  color: rgba(255, 245, 0, 0.8);
}

#details-loan {
  background-color: #343a40;
  border-block-color: rgba(255, 245, 0, 0.8);
  color: rgba(255, 245, 0, 0.8);
}
/deep/.table-bg {
  background-color: rgba(255, 245, 0, 0.8);
  /* color: rgb(97, 93, 92); */
}
</style>
