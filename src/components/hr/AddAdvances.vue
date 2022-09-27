<template>
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie zaliczek</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-row align-h="center">
        <b-col>
          <b-form class="" @submit.prevent="addAdvance">
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

            <!--                    DATE         -->
            <div id="date-amount">
              <b-form-group class="max-width mr-2" label="Data:" label-for="input-hired-date">
                <b-form-input
                  id="input-hired-date"
                  v-model="advanceDateString"
                  type="date"
                  @change="onDateChange"
                  required
                ></b-form-input>
              </b-form-group>

              <!--                    AMOUNT         -->
              <b-form-group class="max-width ml-2" label="Kwota:" label-for="input-amount">
                <b-form-input
                  id="input-amount"
                  v-model="salaryAdvance.amount"
                  :state="validationAmount"
                  placeholder=""
                  required
                ></b-form-input>
                <b-form-invalid-feedback :state="validationAmount">
                  Kwota np: 1048.52 lub 3280
                </b-form-invalid-feedback>
              </b-form-group>
            </div>

          
            <!-- OTHER INFO -->
            <b-form-group class="max-width" label="Dodatkowe informacje:" label-for="input-info">
              <b-form-input
                id="input-info"
                v-model="salaryAdvance.otherInfo"
                :state="validationAdvanceInfo"
                placeholder=""
              ></b-form-input>
              <b-form-invalid-feedback :state="validationAdvanceInfo">
                Pole nie może mieć więcej niż 100 znaków.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- BTN CANCEL -->
            <b-button
              class="mt-3 mr-2"
              style="width: 120px"
              type="reset"
              variant="progas"
              @click="cancelAdvance"
              v-if="employeeDisabled"
              >Anuluj
            </b-button>

            <!-- BTN SAVE -->
            <b-button class="mt-3" style="width: 120px" type="submin" variant="progas"
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
              :items="advancesAll"
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
                    v-if="hasAccessAdvanceWrite"
                    size="sm"
                    @click="editAdvance(row.item, row.index, $event.target)"
                    class="mr-2"
                    variant="progas"
                    title="Edycja zaliczki."
                  >
                    Edit
                  </b-button>
                  <!-- DELETE -->
                  <b-button
                    v-if="hasAccessAdvanceDelete"
                    size="sm"
                    @click="deleteAdvance(row.item, row.index, $event.target)"
                    class="mr-2 bg-danger"
                    title="Usuń zaliczkę."
                  >
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </template>
            </b-table>
            <div id="advanceSum">Razem: {{ advancesSum }} zł</div>
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
import { errorMixin } from "@/mixins/error";
import { advanceMixin } from "@/mixins/advance";
import { mapGetters } from "vuex";
import { employeeMixin } from "@/mixins/employee";
import jwt_decode from "jwt-decode";
export default {
  name: "SalaryAdVances",
  mixins: [errorMixin, advanceMixin, employeeMixin],
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
      btnSaveTitle: "Dodaj",

      busyIcon: false,
      savedIcon: false,
      errorIcon: false,

      optionsEmployee: [],

      selectedEmployee: null,

      advanceDateString: "",
      advanceDateMonthOld: "",
      advanceDateYearOld: "",
      advanceDate: moment(),

      advancesSum: 0,

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
    this.advanceDateString = this.advanceDate.format("YYYY-MM-DD");
    this.advanceDateMonthOld = this.advanceDate.format("MM");
    this.advanceDateYearOld = this.advanceDate.format("YYYY");
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return (
          token2.authorities.includes("HR_ADVANCE_READ_ALL") ||
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
        return token2.authorities.includes("HR_ADVANCE_READ");
      } catch (error) {
        return false;
      }
    },
    hasAccessAdvanceWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_ADVANCE_WRITE_ALL: " + token2.authorities.includes('HR_ADVANCE_WRITE_ALL'))
        return (
          token2.authorities.includes("HR_ADVANCE_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessAdvanceDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_ADVANCE_DELETE_ALL: " + token2.authorities.includes('HR_ADVANCE_DELETE_ALL'))
        return (
          token2.authorities.includes("HR_ADVANCE_DELETE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    validationAmount() {
      return (
        this.salaryAdvance.amount.length > 0 &&
        this.salaryAdvance.amount.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.salaryAdvance.amount) ||
          /^[0-9]+$/.test(this.salaryAdvance.amount))
      );
    },
    validationAdvanceInfo() {
      return this.salaryAdvance.otherInfo.length <= 100;
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
      this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null) {
        this.getAdvancesFromDB(this.selectedEmployee, this.advanceDateString);
      }
    },

    onDateChange() {
       this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null) {
        this.advanceDate = moment(this.advanceDateString);
        let newMonth = moment(this.advanceDateString).format("MM");
        let newYear = moment(this.advanceDateString).format("YYYY");
        if (this.advanceDateMonthOld != newMonth || this.advanceDateYearOld != newYear) {
          this.getAdvancesFromDB(this.selectedEmployee, this.advanceDateString);

          this.advanceDateMonthOld = this.advanceDate.format("MM");
          this.advanceDateYearOld = this.advanceDate.format("YYYY");
        }
      }
    },

    //
    // add advance
    //
    addAdvance() {
      this.changeIconStatus(true, false, false);
      this.btnDisabled = true;

      if (this.selectedEmployee > 0 && this.isValidAdvance()) {
        this.salaryAdvance.idEmployee = this.selectedEmployee;
        this.salaryAdvance.date = this.advanceDateString;
        // console.log(JSON.stringify(this.salaryAdvance));
        if (this.isEdit) {
            this.editAdvanceDB()
            .then((response) => {
              this.displaySmallMessage("success", "Zaktualizowano zaliczkę.");
              this.getAdvancesFromDB(this.selectedEmployee, this.advanceDateString);
              // console.log(JSON.stringify(response.data));
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              //reset
              this.cancelAdvance();
            })
            .catch((e) => {
              this.changeIconStatus(false, false, true);
              this.btnDisabled = false;
              this.validateError(e);
            });
        } else {
          this.addAdvanceToDB()
            .then((response) => {
              this.displaySmallMessage("success", "Dodano zaliczkę.");
              this.getAdvancesFromDB(this.selectedEmployee, this.advanceDateString);
              // console.log(JSON.stringify(response.data));
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              //reset
              this.cancelAdvance();
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

    isValidAdvance() {
      return this.validationAmount && this.validationAdvanceInfo;
    },

    changeIconStatus(busy, save, error) {
      this.busyIcon = busy;
      this.errorIcon = error;
      this.savedIcon = save;
    },

    //  
    //edit advance
    //
    editAdvance(item, index, button) {
      console.log("editAdvance(): " + item.id);
      // console.log(JSON.stringify(item));
      this.employeeDisabled = true;
      this.isEdit=true;
      this.btnSaveTitle = "Zapisz";
      this.advanceDateString = item.date;
      this.salaryAdvance.amount = item.amount;
      this.salaryAdvance.otherInfo = item.otherInfo;
      this.salaryAdvance.id=item.id;
    },

    //
    //delete advance
    //
    deleteAdvance(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      // this.infoModal.content = JSON.stringify(item, null, 2);
      this.$bvModal
        .msgBoxConfirm(`Czy chcesz usunąć zaliczkę:\n z dnia ${item.date} na kwotę ${item.amount} zł?`, {
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
            this.deleteAdvanceDB(item.id).then((response) => {
              this.getAdvancesFromDB(this.selectedEmployee, this.advanceDateString);
              this.displaySmallMessage("success", "Usunięto dodatek.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

 
    cancelAdvance() {
      console.log("cancelAdvance()");
      this.employeeDisabled = false;
      this.btnSaveTitle = "Dodaj";
      this.isEdit = false;
      this.resetForm();
    },
    resetForm() {
      this.salaryAdvance.otherInfo = "";
      this.salaryAdvance.amount = "";
      this.salaryAdvance.id = null;
    },
     resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
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

.worktime1 {
  /*background-color: rgba(229, 29, 29);*/
  color: red;
}

#btn-new-advance {
  width: 100px;
  display: flex;
  align-items: center;
}

#advance-type {
  display: flex;
  justify-content: space-around;
}

#date-amount {
  display: flex;
  justify-content: space-around;
}
.max-width {
  width: -webkit-fill-available;
}

#advanceSum {
  text-align: justify;
  font-size: large;
}
</style>
