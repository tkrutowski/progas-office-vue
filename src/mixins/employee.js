import router from "@/router";
import axios from "axios";
export const employeeMixin = {
  data() {
    return {
      // urlTeam: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",

      loading: false,

      employee: {
        id: 0,
        firstName: "",
        lastName: "",
        city: "",
        street: "",
        zip: "",
        numberDaysOffLeft: "0.0",
        numberDaysOffAnnually: "0",
        pesel: "",
        email: "",
        telNumber: "",
        hiredDate: "",
        releaseDate: "",
        nextMedicalExaminationDate: "",
        nextBhpTrainingDate: "",
        employeeType: "",
        worktime: "",
        employmentStatus: "",
        otherInfo:""
        //   enabled: true,
        //   notLocked: true,
        //   idEmployee: 0
      },
    };
  },
  methods: {
    //
    //Pobiera pracowników w zależności od uprawnień
    //
    getEmployees() {
      console.log("getEmployees() - start");
      this.loading = true;
      console.log("hasRead: " + this.hasRead);
      console.log("hasReadAll: " + this.hasReadAll);
      if (this.hasRead && !this.hasReadAll) {
        let idEmp = this.$store.getters.getUser.idEmployee;
        console.log("idEmpl: " + idEmp);
        this.getEmployeeFromDb(idEmp).then((response) => {
          // console.log(JSON.stringify(response.data));
          this.employees = [];
          this.employees.push(response.data);
          this.convertToOptionsEmployee();
          this.loading=false;
        });
      } else {
        if (this.hasReadAll) {
          this.getEmployeesFromDb("HIRED").then((response) => {
            this.employees = response.data;
            this.convertToOptionsEmployee();
            this.loading=false;
          });
        }
      }
    },
    //------------------------------------------------DB-------------------------------------------
    //
    //get employee by ID from DB
    //
    getEmployeeFromDb(employeeID) {
      console.log("getEmployeeFromDb() - start, ID = " + employeeID);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(this.urlEmpl + `/api/employee/query/` + employeeID, header)
        .then((response) => {
          console.log("Odpowiedz HTTP: " + response.status + ", " + response.statusText);
          //   let employee = response.data;
          // console.log(JSON.stringify(response.data));
          console.log("getEmployeeFromDb() - end");
          
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get HIRED/FIRED employees
    getEmployeesFromDb(empStatus) {
      console.log("getEmployeesFromDb(" + empStatus + ") - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(this.urlEmpl + `/api/employee/query?status=` + empStatus, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getEmployeesFromDb() - Ilosc employees[]: " + response.data.length);
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get employeeType
    getEmployeeTypeFromDb() {
      console.log("getEmployeeTypeFromDb() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(this.urlEmpl + `/api/employee/employeetype`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getEmployeesFromDb() - Ilosc employeeType[]: " + response.data.length);
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get employeeType
    getEmployeeWorktimeFromDb() {
      console.log("getEmployeeWorktimeFromDb() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(this.urlEmpl + `/api/employee/employeeworktime`, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log("getEmployeesFromDb() - Ilosc employeeWorktime[]: " + response.data.length);
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //add EMPLOYEE into db
    //
    addEmployeeDB() {
      console.log("addEmployeeDB() - start");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
        .post(this.urlEmpl + `/api/employee`, this.employee, {
          headers,
        })
        .then((response) => {
          this.employee.id = response.data;
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //
    //update EMPLOYEE
    //
    updateEmployeeDb() {
      console.log("updateEmployeeDb() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .put(this.urlEmpl + `/api/employee`, this.employee, header)
        .then((response) => {
          console.log("end updateEmployeeDb()");
         return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

     //
    //delete employee from db
    //
    deleteEmployeeDB(employeeID) {
      console.log("deleteEmployeeDB() - start");
      // const token=this.$store.getters.getToken;
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': "Bearer "+ this.$store.getters.getToken
      };

      return axios
        .delete(this.urlEmpl + `/api/employee/` + employeeID, {
          headers,
        })
        .then((response) => {
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
     //
    //update employment status
    //
    setEmploymentStatusDb(employeeID, newStatus) {
      console.log("setEmploymentStatusDb() - start");
      console.log("employee id: " + employeeID + ", status: " + newStatus);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           Authorization: "Bearer "+ this.$store.getters.getToken
        },
      };
      // const param ={
        let params = {
          value: newStatus,
        } 
      // };
      return axios
        .put(this.urlEmpl + `/api/employee/employeetype/` + employeeID, params, header)
      .then((response) => {
          // JSON responses are automatically parsed.
          this.displaySmallMessage("success", "Zaaktualizowano status pracownika.");
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },


  },
};
