import router from "@/router";
import axios from "axios";
export const employeeMixin = {
  data() {
    return {
      // urlTeam: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",
    
        
    };
  },
    methods: {
        //
    //Pobiera pracowników w zależności od uprawnień
    //
    getEmployees() {
      console.log("getEmployees() - start");
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
        });
      } else {
        if (this.hasReadAll) {
          this.getEmployeesFromDb("HIRED")
          .then((response) => {
            this.employees = response.data;
          this.convertToOptionsEmployee();
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
                  'Authorization': "Bearer "+ this.$store.getters.getToken
              },
          };
          return axios
              .get(this.urlEmpl + `/api/employee/query/` + employeeID, header)
              // .get(`http://localhost:8082/api/employee/query/` + employeeID, header)
              .then((response) => {
                  console.log("Odpowiedz HTTP: " + response.status + ", " + response.statusText);
                  //   let employee = response.data;
                  console.log(JSON.stringify(response.data));
                  return response;
              })
          .catch((e) => {
            this.validateError(e);
          });
      },
      
      //
      //Get HIRED/FIRED employee
      getEmployeesFromDb(empStatus) {
        console.log("getEmployeesFromDb("+empStatus+") - start");
        return axios
          .get(this.urlEmpl+`/api/employee/query?status=`+empStatus)
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log("getEmployeesFromDb() - Ilosc employees[]: " + response.data.length);
              return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },
    },
}