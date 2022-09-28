import router from "@/router";
import axios from "axios";
export const employeeMixin = {
  data() {
    return {
      // urlTeam: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",

      loadingEmployee: false,

      employees:[],

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
      },
    };
  },
  methods: {
    //
    //Pobiera pracowników w zależności od uprawnień (do droplist)
    //
    async getEmployees(status) {
      console.log("START - getEmployees()");
      this.loadingEmployee = true;
      console.log("hasRead: " + this.hasRead);
      console.log("hasReadAll: " + this.hasReadAll);
      if (this.hasRead && !this.hasReadAll) {
        let idEmp = this.$store.getters.getUser.idEmployee;
        console.log("idEmpl: " + idEmp);
        await this.getEmployeeFromDb(idEmp).then((response) => {
          // console.log(JSON.stringify(response.data));
          this.employees = [];
          this.employee = response.data;
          this.employees.push(employee);
          this.convertToOptionsEmployee();
          this.loadingEmployee=false;
        });
      } else {
        if (this.hasReadAll) {
          await this.getEmployeesFromDb(status).then((response) => {
            this.employees = response.data;
            this.convertToOptionsEmployee();
            this.loadingEmployee=false;
          });
        }
      }
      console.log("END - getEmployees()");
      return;
    },
    //------------------------------------------------DB-------------------------------------------
    //
    //get employee by ID from DB
    //
    async getEmployeeFromDb(employeeID) {
      console.log("START - getEmployeeFromDb() ID = " + employeeID);
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
          console.log("END - getEmployeeFromDb()");
          
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get HIRED/FIRED/ALL employees
    async getEmployeesFromDb(empStatus) {
      console.log("START - getEmployeesFromDb(" + empStatus + ")");
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
        console.log("END - getEmployeesFromDb(" + empStatus + ")");
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get employeeType
    getEmployeeTypeFromDb() {
      console.log("START - getEmployeeTypeFromDb()");
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
        console.log("END - getEmployeeTypeFromDb()");
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //Get worktime
    getEmployeeWorktimeFromDb() {
      console.log("START - getEmployeeWorktimeFromDb()");
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
        console.log("END - getEmployeeWorktimeFromDb()");
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
      console.log("START - addEmployeeDB()");
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
          console.log("END - addEmployeeDB()");
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
      console.log("START - updateEmployeeDb()");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .put(this.urlEmpl + `/api/employee`, this.employee, header)
        .then((response) => {
          console.log("END - updateEmployeeDb()");
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
      console.log("START - deleteEmployeeDB()");
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
          console.log("END - deleteEmployeeDB()");
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
      console.log("START - setEmploymentStatusDb()");
      console.log("employee id: " + employeeID + ", status: " + newStatus);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer "+ this.$store.getters.getToken
        },
      };
      let params={
        value : newStatus
      }
      return axios
      .put(this.urlEmpl + `/api/employee/employeetype/` + employeeID, params, header)
      .then((response) => {
        // JSON responses are automatically parsed.
        this.displaySmallMessage("success", "Zaaktualizowano status pracownika.");
        console.log("END - setEmploymentStatusDb()");
        return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },


  },
};
