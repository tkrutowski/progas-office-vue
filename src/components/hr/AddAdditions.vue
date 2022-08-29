<template>
  <div id="main">
    <b-container fluid="" id="container">
      <h1>Wpisywanie dodatków</h1>
      <hr style="border: 0px; background: rgba(255, 245, 0, 0.8); height: 1px" />
      <b-row align-h="center">
        <b-col>
          <b-form class="" @submit.prevent="addAddition">
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

            <!--                    DATE         -->
            <div id="date-amount">
              <b-form-group class="max-width mr-2" label="Data:" label-for="input-hired-date">
                <b-form-input
                  id="input-hired-date"
                  v-model="additionDateString"
                  type="date"
                  @change="onDateChange"
                  required
                ></b-form-input>
              </b-form-group>

              <!--                    AMOUNT         -->
              <b-form-group class="max-width ml-2" label="Kwota:" label-for="input-amount">
                <b-form-input
                  id="input-amount"
                  v-model="salaryAddition.amount"
                  :state="validationAmount"
                  placeholder=""
                  required
                ></b-form-input>
                <b-form-invalid-feedback :state="validationAmount">
                  Kwota np: 1048.52 lub 3280
                </b-form-invalid-feedback>
              </b-form-group>
            </div>

            <!--                     ADDITION TYPE                       -->
            <div id="addition-type">
              <b-form-group
                class="max-width mr-4"
                label="Rodzaj dodatku:"
                label-for="input-additionType"
              >
                <b-form-select
                  id="input-additionType"
                  v-model="selectedAdditionType"
                  :options="optionAdditionType"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Wybierz rodzaj dodatku --
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
              <div id="btn-new-addition">
                <b-button class="mt-3"  style="width: 100px" 
                variant="progas"
                 v-b-modal.newAdditionTypeModal
                  >Nowy</b-button>
              </div>
            </div>

            <!-- OTHER INFO -->
            <b-form-group class="max-width" label="Dodatkowe informacje:" label-for="input-info">
              <b-form-input
                id="input-info"
                v-model="salaryAddition.otherInfo"
                :state="validationAdditionInfo"
                placeholder=""
              ></b-form-input>
              <b-form-invalid-feedback :state="validationAdditionInfo">
                Pole nie może mieć więcej niż 100 znaków.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- BTN CANCEL -->
            <b-button
              class="mt-3 mr-2"
              style="width: 120px"
              type="reset"
              variant="progas"
              @click="cancelAddition"
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
              :items="additionsAll"
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
                    v-if="hasAccessAdditionWrite"
                    size="sm"
                    @click="editAddition(row.item, row.index, $event.target)"
                    class="mr-2"
                    variant="progas"
                    title="Edycja dodatku."
                  >
                    Edit
                  </b-button>
                  <!-- DELETE -->
                  <b-button
                    v-if="hasAccessAdditionDelete"
                    size="sm"
                    @click="deleteAddition(row.item, row.index, $event.target)"
                    class="mr-2 bg-danger"
                    title="Usuń dodatek."
                  >
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </template>
            </b-table>
            <div id="additionSum">Razem: {{ additionSum }} zł</div>
          </div>
        </b-col>
      </b-row>
          <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
       <!-- MODAL - NEW ADDITION TYPE -->
    <b-modal
      id="newAdditionTypeModal"
      centered
      title="Nowy rodzaj dodatku"
      header-bg-variant="dark"
      header-text-variant="progas"
      body-bg-variant="dark"
      body-text-variant="progas"
      footer-bg-variant="dark"
      footer-text-variant="progas"
      ok-title="Zapisz"
      ok-variant="progas"
      cancel-title="Anuluj"
      cancel-variant="progas"
      @ok="addNewAdditionType"
    >
      <div>
  <b-form-group class="max-width" label="Nazwa:" label-for="input-new-type">
              <b-form-input
                ref="focusThis"
                id="input-new-type"
                v-model="newAdditionTypeName"
                :state="validationAdditionType"
                placeholder="wpisz nazwę..."
                autofocus
              ></b-form-input>
              <b-form-invalid-feedback :state="validationAdditionType">
                Pole musi mieć między 3 a 30 znaków.
              </b-form-invalid-feedback>
            </b-form-group>
      </div>
    </b-modal>
    </b-container>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { additionMixin } from "@/mixins/additions";
import { mapGetters } from "vuex";
import { employeeMixin } from "@/mixins/employee";
import jwt_decode from "jwt-decode";
export default {
  name: "SalaryAdditions",
  mixins: [errorMixin, additionMixin, employeeMixin],
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
          key: "additionType",
          label: "Rodzaj",
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
      // loading: false,
      isBusy: false,
      isEdit: false,

      employeeDisabled: false,
      btnSaveTitle: "Dodaj",

      busyIcon: false,
      savedIcon: false,
      errorIcon: false,

      optionAdditionType: [],
      optionsEmployee: [],

      selectedEmployee: null,
      selectedAdditionType: null,

      additionDateString: "",
      additionDateMonthOld: "",
      additionDateYearOld: "",
      additionDate: moment(),

      additionSum: 0,

      newAdditionTypeName:"",

       infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  created() {
    moment.locale("pl");
    this.getEmployees();
    this.getAdditionTypesFromDb();
    this.selectedEmployee = null;
    // this.selectedAdditionType = 1;
    this.additionDateString = this.additionDate.format("YYYY-MM-DD");
    this.additionDateMonthOld = this.additionDate.format("MM");
    this.additionDateYearOld = this.additionDate.format("YYYY");
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getToken"]),
    hasReadAll() {
      try {
        let token2 = jwt_decode(this.getToken);
        return (
          token2.authorities.includes("HR_ADDITION_READ_ALL") ||
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
        return token2.authorities.includes("HR_ADDITION_READ");
      } catch (error) {
        return false;
      }
    },
    hasAccessAdditionWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_ADDITION_WRITE_ALL: " + token2.authorities.includes('HR_ADDITION_WRITE_ALL'))
        return (
          token2.authorities.includes("HR_ADDITION_WRITE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    hasAccessAdditionDelete() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: HR_ADDITION_DELETE_ALL: " + token2.authorities.includes('HR_ADDITION_DELETE_ALL'))
        return (
          token2.authorities.includes("HR_ADDITION_DELETE_ALL") ||
          token2.authorities.includes("ROLE_ADMIN")
        );
      } catch (error) {
        return false;
        // return true;
      }
    },
    validationAmount() {
      return (
        this.salaryAddition.amount.length > 0 &&
        this.salaryAddition.amount.length <= 7 &&
        (/(^\d+\.\d{0,2}$)/.test(this.salaryAddition.amount) ||
          /^[0-9]+$/.test(this.salaryAddition.amount))
      );
    },
    validationAdditionInfo() {
      return this.salaryAddition.otherInfo.length <= 100;
    },
    validationAdditionType() {
      return this.newAdditionTypeName.length <= 30 && this.newAdditionTypeName.length > 3;
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
        this.getAdditionsFromDB(this.selectedEmployee, this.additionDateString);
      }
    },

    onDateChange() {
       this.changeIconStatus(false, false, false);
      if (this.selectedEmployee != null) {
        this.additionDate = moment(this.additionDateString);
        let newMonth = moment(this.additionDateString).format("MM");
        let newYear = moment(this.additionDateString).format("YYYY");
        if (this.additionDateMonthOld != newMonth || this.additionDateYearOld != newYear) {
          this.getAdditionsFromDB(this.selectedEmployee, this.additionDateString);

          this.additionDateMonthOld = this.additionDate.format("MM");
          this.additionDateYearOld = this.additionDate.format("YYYY");
        }
      }
    },

    //
    // add addition
    //
    addAddition() {
      this.changeIconStatus(true, false, false);
      this.btnDisabled = true;

      if (this.selectedEmployee > 0 && this.isValidAddition()) {
        this.salaryAddition.idEmployee = this.selectedEmployee;
        this.salaryAddition.date = this.additionDateString;
        this.salaryAddition.additionType = this.selectedAdditionType;
        // console.log(JSON.stringify(this.salaryAddition));
        if (this.isEdit) {
            this.editAdditionDB()
            .then((response) => {
              this.displaySmallMessage("success", "Zaktualizowano dodatek.");
              this.getAdditionsFromDB(this.selectedEmployee, this.additionDateString);
              // console.log(JSON.stringify(response.data));
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              //reset
              this.cancelAddition();
            })
            .catch((e) => {
              this.changeIconStatus(false, false, true);
              this.btnDisabled = false;
              this.validateError(e);
            });
        } else {
          this.addAdditionToDB()
            .then((response) => {
              this.displaySmallMessage("success", "Dodano dodatek.");
              this.getAdditionsFromDB(this.selectedEmployee, this.additionDateString);
              // console.log(JSON.stringify(response.data));
              this.changeIconStatus(false, true, false);
              this.btnDisabled = false;
              //reset
              this.cancelAddition();
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

    isValidAddition() {
      return this.validationAmount && this.validationAdditionInfo;
    },

    changeIconStatus(busy, save, error) {
      this.busyIcon = busy;
      this.errorIcon = error;
      this.savedIcon = save;
    },

    //  
    //edit addition
    //
    editAddition(item, index, button) {
      console.log("editAddition(): " + item.id);
      // console.log(JSON.stringify(item));
      this.employeeDisabled = true;
      this.isEdit=true;
      this.btnSaveTitle = "Zapisz";
      this.additionDateString = item.date;
      this.selectedAdditionType = item.additionTypeId;
      this.salaryAddition.amount = item.amount;
      this.salaryAddition.otherInfo = item.otherInfo;
      this.salaryAddition.additionTypeId = item.additionTypeId;
      this.salaryAddition.id=item.id;
    },

    //
    //delete addition
    //
    deleteAddition(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      // this.infoModal.content = JSON.stringify(item, null, 2);
      this.$bvModal
        .msgBoxConfirm(`Czy chcesz usunąć dodatek:\n z dnia ${item.date} na kwotę ${item.amount} zł?`, {
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
            this.deleteAdditionDB(item.id).then((response) => {
              this.getAdditionsFromDB(this.selectedEmployee, this.additionDateString);
              this.displaySmallMessage("success", "Usunięto dodatek.");
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    //
    // add new additionType
    //
    addNewAdditionType(){
  
      console.log("New addition type: "+ this.newAdditionTypeName);
            this.addAdditionTypeDB(this.newAdditionTypeName).then((response) => {
              console.log("id dodatku: " + response.data);
              this.getAdditionTypesFromDb();
              this.displaySmallMessage("success", "Dodano nowy rodzaj dodatku.");
            })
             .catch((e) => {
          this.validateError(e);
        });;
         
    },

    cancelAddition() {
      console.log("cancelAddition()");
      this.employeeDisabled = false;
      this.btnSaveTitle = "Dodaj";
      this.isEdit = false;
      this.resetForm();
    },
    resetForm() {
      this.selectedAdditionType = null;
      this.salaryAddition.otherInfo = "";
      this.salaryAddition.amount = "";
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
    convertToOptionsAdditionTypes() {
      console.log("convertToOptionsAdditionTypes() ...");
      this.optionAdditionType=[];
      this.additionTypes.forEach((e) => {
        let opt = {
          value: e.id,
          text: e.name,
        };
        this.optionAdditionType.push(opt);
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

#btn-new-addition {
  width: 100px;
  display: flex;
  align-items: center;
}

#addition-type {
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

#additionSum {
  text-align: justify;
  font-size: large;
}
</style>
