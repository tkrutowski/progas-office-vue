import router from "@/router";
import axios from "axios";
export const loanMixin = {
  data() {
    return {
      // urlEmpl: "http://localhost:8089",
      // urlEmpl: "http://localhost:8082",
      // urlEmpl: "http://192.168.1.33:8082",
      urlEmpl: "https://docker.focikhome.synology.me",

      loadingLoan: false,

      loanInsallment: {
        idLoanInstallment: 0,
        idLoan: 0,
        amount: "",
        date: "",
        otherInfo: "",
        ownRepayment: false,
      },

      loan:{
         idLoan:0,
         idEmployee:0,
         amount:"",
         name:"",
         date:"",
         installmentAmount:"",
         otherInfo:"",
         loanStatus:"",
         installmentDtoList:[]
    },

      loansAll: [],
      loanInsallments: [],
    };
  },
  methods: {


    // ------------------------------------------------LOAN--------------------------------------
    getLoansByAccess(status) {
      console.log("START - getLoansByAccess(status: "+ status+")");
      // this.isBusy = true;
      console.log("hasRead: " + this.hasRead);
      console.log("hasReadAll: " + this.hasReadAll);
      if (this.hasRead && !this.hasReadAll) {
        let idEmp = this.$store.getters.getUser.idEmployee;
        console.log("idEmpl: " + idEmp);
        this.getLoansFromQueryDb(idEmp, "ALL");
      } else {
        if (this.hasReadAll) {
          this.getLoansFromQueryDb(0, status);
          }
        }
        console.log("END - getLoansByAccess(status: "+ status+")");
    },



    getLoansFromQueryDb(idEmployee, loanStatus) {
      console.log("START - getLoansFromDb(idEmployee: "+idEmployee+", status: "+loanStatus+")");
      this.isBusy = true;
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
      .get(this.urlEmpl + `/api/employee/loan/query/`+ idEmployee+`?status=`+loanStatus, header)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        this.loansAll = response.data;
        console.log("getLoansFromQueryDb() - Ilosc loans[]: " + response.data.length);
        this.isBusy=false;
        this.displayRadio(this.selectedDisplay);
        
        console.log("END - getLoansFromQueryDb(idEmployee: "+idEmployee+", status: "+loanStatus+")");
        })
        .catch((e) => {
          this.isBusy=false;
          this.validateError(e);
        });
    },

   
    getLoansByStatusFromDb(loanStatus, withInstallment) {
      console.log("START - getLoansByStatusFromDb(status: "+loanStatus+", withInstallment: "+withInstallment+")");
      this.isBusy = true;
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
      .get(this.urlEmpl + `/api/employee/loan/status?status=`+loanStatus+`&installment=`+withInstallment, header)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        this.loansAll = response.data;
        console.log("getLoansFromDb() - Ilosc loans[]: " + response.data.length);
        this.isBusy=false;
        this.displayRadio(this.selectedDisplay);{
          // this.convertToOptionsLoans();
          console.log("END - getLoansByStatusFromDb(status: "+loanStatus+", withInstallment: "+withInstallment+")");
          }
        })
        .catch((e) => {
          this.isBusy=false;
          this.validateError(e);
        });
    },


    getLoanByIdFromDb(idLoan) {
      console.log("START - getLoanByIdFromDb(idLoan: "+idLoan+")");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(this.urlEmpl + `/api/employee/loan/`+ idLoan, header)
        .then((response) => {
          // JSON responses are automatically parsed.
          // console.log(JSON.stringify(response.data));
          console.log("END - getLoanByIdFromDb(idLoan: "+idLoan+")");
          return  response;
        })
    },

    addLoanToDB() {
      console.log("START - addLoanToDB()");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
      .post(this.urlEmpl + `/api/employee/loan`, this.loan, {
        headers,
      })
      .then((response) => {
          console.log("END - addLoanToDB()");
          return response;
        });
    },

    async updateLoanDb() {
      console.log("START - updateLoanDb()");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      return axios
      .put(this.urlEmpl + `/api/employee/loan`, this.loan, {
        headers,
      })
      .then((response) => {
          console.log("END - updateLoanDb()");
          return response;
        });
    },

    async deleteLoanDB(idLoan) {
      console.log("START - deleteLoanDB(id: " + idLoan + ")");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      
      return axios
      .delete(this.urlEmpl + `/api/employee/loan/` + idLoan, {
        headers,
      })
      .then((response) => {
          console.log("END - deleteLoanDB(id: " + idLoan + ")");
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    //
    //update loan status
    //
    async setLoanStatusDb(loanID, newStatus) {
      console.log("START - setLoanStatusDb()");
      console.log("loan id: " + loanID + ", status: " + newStatus);
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
      .put(this.urlEmpl + `/api/employee/loan/status/` + loanID, params, header)
      .then((response) => {
        // JSON responses are automatically parsed.
        console.log("END - setLoanStatusDb()");
        return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },


    // ------------------------------------------------LOAN INSTALLMENT-------------------------------------
    
    //get loan installment from all loans in given date without own repaymant
    getLoanInstallmentsAllByEmployeeFromDB(idEmployee, date) {
      console.log("START - getLoanInstallmentsAllByEmployeeFromDB(idEmployee: "+idEmployee+",date: "+date+")");
      this.isBusy = true;
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      axios
      .get(
        this.urlEmpl + `/api/employee/loan/installment/` + idEmployee + `/all?date=` + date,
        header
        )
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          this.loanInsallments = response.data;
          // console.log(JSON.stringify("Ilość: "+this.loanInsallments.size()));
          let sum = 0;
          response.data.forEach((element) => {
            sum = sum + parseFloat(element.amount);
          });
          this.loanInstallmentSum = sum.toFixed(2);
          this.isBusy = false;
          console.log("END - getLoanInstallmentsAllByEmployeeFromDB(idEmployee: "+idEmployee+",date: "+date+")");
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

    getLoanInstallmentsByLoanIdFromDB(idLoan) {
      console.log("START - getLoanInstallmentsByLoanIdFromDB(id: "+idLoan+")");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      };
      return axios
        .get(
          this.urlEmpl + `/api/employee/loan/installment/` + idLoan, header
          )
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            console.log("END - getLoanInstallmentsByLoanIdFromDB(id: "+idLoan+")");
          return response;
        });
    },

    async addLoanInstallmentToDB() {
      console.log("START - addLoanInstallmentToDB()");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
     
      return axios
      .post(this.urlEmpl + `/api/employee/loan/installment`, this.loanInsallment, {
        headers,
      })
      .then((response) => {
          console.log("END - addLoanInstallmentToDB()");
          return response;
        });
    },

    async editLoanInstallmentDB() {
      console.log("START - editLoanInstallmentDB()");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
     
      return axios
      .put(this.urlEmpl + `/api/employee/loan/installment`, this.loanInsallment, {
        headers,
      })
      .then((response) => {
          console.log("END - editLoanInstallmentDB()");
          return response;
        });
    },


    async deleteLoanInstallmentDB(idLoanInstallment) {
      console.log("START - deleteLoanInstallmentDB(id: " + idLoanInstallment + ")");
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + this.$store.getters.getToken,
      };
      
      return axios
      .delete(this.urlEmpl + `/api/employee/loan/installment/` + idLoanInstallment, {
        headers,
      })
      .then((response) => {
          console.log("END - deleteLoanInstallmentDB(id: " + idLoanInstallment + ")");
          return response;
        })
        .catch((e) => {
          this.validateError(e);
        });
    },

  },
};
