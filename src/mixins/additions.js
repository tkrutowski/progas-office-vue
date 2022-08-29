import router from "@/router";
import axios from "axios";
export const additionMixin = {
  data() {
    return {
      // urlEmpl: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",

      salaryAddition: {
        id: 0,
        idEmployee: 0,
        amount: "",
        date: "",
        otherInfo: "",
        additionType: "",
        additionTypeId: 0,
      },

      additionsAll: [],
      additionTypes: [],
    };
  },
  methods: {
    getAdditionTypesFromDb() {
      console.log("getAdditionTypesFromDb() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(this.urlEmpl + `/api/employee/salary/addition/additiontype`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.additionTypes = response.data;
          console.log("getAdditionTypesFromDb() - Ilosc Types[]: " + this.additionTypes.length);
          if (this.additionTypes.length > 0) {
            this.convertToOptionsAdditionTypes();
          }
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    getAdditionsFromDB(idEmployee, date) {
      console.log("getAdditionsFromDB() - start");
      this.isBusy = true;
      console.log("selected employee: " + this.selectedEmployee);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(
          this.urlEmpl + `/api/employee/salary/addition/` + idEmployee + `/all?date=` + date,
          header
        )
        .then((response) => {
          this.additionsAll = response.data;
          let sum = 0;
          response.data.forEach((element) => {
            sum = sum + parseFloat(element.amount);
          });
          this.additionSum = sum.toFixed(2);
          this.isBusy = false;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    addAdditionToDB() {
      console.log("addAdditionToDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .post(this.urlEmpl + `/api/employee/salary/addition`, this.salaryAddition, {
          headers,
        })
        .then((response) => {
          return response;
        });
    },

    editAdditionDB() {
      console.log("editAdditionDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .put(this.urlEmpl + `/api/employee/salary/addition`, this.salaryAddition, {
          headers,
        })
        .then((response) => {
          return response;
        });
    },

    deleteAdditionDB(additionId) {
      console.log("deleteAdditionDB() - start id: " + additionId);
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };

      return axios
        .delete(this.urlEmpl + `/api/employee/salary/addition/` + additionId, {
          headers,
        })
        .then((response) => {
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },


    addAdditionTypeDB(type) {
      console.log("addAdditionTypeDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .post(this.urlEmpl + `/api/employee/salary/addition/additiontype?typeName=`+type, null, {
          headers,
        })
        .then((response) => {
          return response;
        });
    },
  },
};
