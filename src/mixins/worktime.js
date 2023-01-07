import router from "@/router";
import axios from "axios";
export const worktimeMixin = {
  data() {
    return {
      // urlTeam: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",

      loadingEmployee: false,

      workTimeList: [],
      employees: [],
      dayOffTypes: [],
      illnessTypes: [],

      optionDayOff: [],
      optionsEmployee: [],
      optionIllness: [],

      work: {
        idEmployee: "",
        date: "",
        startTime: "",
        stopTime: "",
      },
      illness: {
        idEmployee: "",
        date: "",
        idIllnessType: "",
      },
      dayOff: {
        idEmployee: "",
        date: "",
        idDayOffType: "",
      },
    };
  },
  methods: {
    //
    //get worktime
    //
    getWorkTimeAllFromDB(employeeID, date) {
      console.log("getWorkTimeAllFromDB() - start");
      this.isBusy = true;
      // console.log("selected employee: " + this.selectedEmployee);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      let url = this.urlEmpl + "/api/employee/worktime/" + employeeID + "?date=" + date;
      axios
        .get(url, header)
        .then((response) => {
          this.workTimeList = response.data;
          this.isBusy = false;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //delete employee from db
    //use AddWorkTime.vue
    async deleteWorkTimeDB(employeeID, date, workType) {
      console.log("START - deleteWorkTimeDB()");
      // const idUser=this.$store.getters.getUser.idEmployee;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };

      try {
        const response = await axios.delete(
          this.urlEmpl +
            `/api/employee/worktime/` +
            employeeID +
            "?date=" +
            date +
            "&type=" +
            workType,
          {
            headers,
          }
        );
        console.log("END - deleteWorkTimeDB()");
        return response;
      } catch (e) {
        this.validateError(e);
      }
    },

    //---------------------------------------------------- DB WORK ---------------------------------------------------------

    //
    //save worktime in DB
    //
    addWorkToDB() {
      console.log("START - addWorkToDB()");
      console.log("add praca: " + this.timeFrom + " - " + this.timeTo);
      this.work.idEmployee = this.selectedEmployee;
      this.work.date = this.workTimeDate.format("YYYY-MM-DD");
      this.work.startTime = this.timeFrom;
      this.work.stopTime = this.timeTo;
      //  console.log(JSON.stringify(this.work));
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .post(this.urlEmpl + "/api/employee/worktime?workType=WORK", this.work, header)
        .then((response) => {
          this.displaySmallMessage("success", "Dodano godziny pracy.");
          this.getWorkTimeAllFromDB(this.selectedEmployee, this.workTimeDate.format("YYYY-MM-DD"));
          this.changeStatusIcon(false, false, true, false);
        })
        .catch((e) => {
          this.changeStatusIcon(false, false, false, true);
          this.validateError(e);
        });
    },

    //---------------------------------------------------- DB DAYOFF ---------------------------------------------------------

    //
    //
    //used AddWorkTIme.vue
    getDayOffTypesFromDb() {
      console.log("START - getDayOffTypesFromDb()");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(this.urlEmpl + `/api/employee/worktime/dayofftype`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.dayOffTypes = response.data;
          console.log("getDayOffTypesFromDb() - Ilosc dayOffTypes[]: " + this.dayOffTypes.length);
          if (this.dayOffTypes.length > 0) {
            this.convertToOptionsDayOff();
          }
          console.log("END - getDayOffTypesFromDb()");
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //add dayoff
    //
    addDayOffToDB() {
      console.log("addDayOffToDB() - start");
      console.log("add dayOff: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.dayOff.idEmployee = this.selectedEmployee;
      this.dayOff.date = this.workTimeDate.format("YYYY-MM-DD");
      this.dayOff.idDayOffType = this.selectedDayOffType;
      //  console.log(JSON.stringify(this.dayOff));
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .post(this.urlEmpl + "/api/employee/worktime?workType=DAY_OFF", this.dayOff, header)
        .then((response) => {
          this.displaySmallMessage("success", "Dodano godziny urlopowe.");
          this.getWorkTimeAllFromDB(this.selectedEmployee, this.workTimeDate.format("YYYY-MM-DD"));
          this.changeStatusIcon(false, false, true, false);
        })
        .catch((e) => {
          this.changeStatusIcon(false, false, false, true);
          this.validateError(e);
        });
    },

    //---------------------------------------------------- DB ILLNESS ---------------------------------------------------------
    //
    //
    //use AddWorkTIme.vue
    getIllnessTypesFromDb() {
      console.log("START - getIllnessTypesFromDb()");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
        .get(this.urlEmpl + `/api/employee/worktime/illnesstype`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.illnessTypes = response.data;
          console.log(
            "getIllnessTypesFromDb() - Ilosc illnessTypes[]: " + this.illnessTypes.length
          );
          if (this.illnessTypes.length > 0) {
            this.convertToOptionsIllness();
          }
          console.log("END - getIllnessTypesFromDb()");
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //add illness
    //
    addIllnessToDB() {
      console.log("START - addWorkToDB()");
      console.log("add illness: " + this.workTimeDate.format("YYYY-MM-DD"));
      this.illness.idEmployee = this.selectedEmployee;
      this.illness.date = this.workTimeDate.format("YYYY-MM-DD");
      this.illness.idIllnessType = this.selectedIllnessType;
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      console.log(JSON.stringify(this.illness));
      axios
        .post(this.urlEmpl + "/api/employee/worktime?workType=ILLNESS", this.illness, header)
        .then((response) => {
          this.displaySmallMessage("success", "Dodano godziny chorobowe.");
          this.getWorkTimeAllFromDB(this.selectedEmployee, this.workTimeDate.format("YYYY-MM-DD"));
          this.changeStatusIcon(false, false, true, false);
          console.log("END - addWorkToDB()");
        })
        .catch((e) => {
          this.changeStatusIcon(false, false, false, true);
          this.validateError(e);
        });
    },
   
  },
};
