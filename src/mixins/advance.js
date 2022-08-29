import router from "@/router";
import axios from "axios";
export const advanceMixin = {
  data() {
    return {
      // urlEmpl: "http://localhost:8089",
      urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      // urlEmpl: "https://docker.focikhome.synology.me",

      salaryAdvance: {
        id: 0,
        idEmployee: 0,
        amount: "",
        date: "",
        otherInfo: "",
      },

      advancesAll: [],
    };
  },
  methods: {
 
    getAdvancesFromDB(idEmployee, date) {
      console.log("getAdvancesFromDB() - start");
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
          this.urlEmpl + `/api/employee/salary/advance/` + idEmployee + `/all?date=` + date,
          header
        )
        .then((response) => {
          this.advancesAll = response.data;
          let sum = 0;
          response.data.forEach((element) => {
            sum = sum + parseFloat(element.amount);
          });
          this.advancesSum = sum.toFixed(2);
          this.isBusy = false;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    addAdvanceToDB() {
      console.log("addAdvanceToDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .post(this.urlEmpl + `/api/employee/salary/advance`, this.salaryAdvance, {
          headers,
        })
        .then((response) => {
          return response;
        });
    },

    editAdvanceDB() {
      console.log("editAdvanceDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .put(this.urlEmpl + `/api/employee/salary/advance`, this.salaryAdvance, {
          headers,
        })
        .then((response) => {
          return response;
        });
    },

    deleteAdvanceDB(advanceId) {
      console.log("deleteAdvanceDB() - start id: " + advanceId);
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };

      return axios
        .delete(this.urlEmpl + `/api/employee/salary/advance/` + advanceId, {
          headers,
        })
        .then((response) => {
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
   
  },
};
