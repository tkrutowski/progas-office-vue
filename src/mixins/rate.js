import router from "@/router";
import axios from "axios";
export const rateMixin = {
  data() {
    return {
      // urlRate: "http://localhost:8089",
      urlRate: "http://localhost:8082",
      // urlRate: "http://192.168.1.33:8082",
      // urlRate: "https://docker.focikhome.synology.me",
    
      fieldsRateAll: [
        {
          key: "rateValue",
          label: "Stawka",
        },
        // {
        //   key: "rateType",
        //   label: "Rodzaj",
        // },
        {
          key: "dateFrom",
          label: "Obowiązuje od",
        }
       ],
      
      rateRegular:{
        idRate: 0,
        rateType: "",
        dateFrom:"",
        rateValue:""
      },

      rateOvertime:{
        idRate: 0,
        dateFrom:"",
        rateValue:""
      },

      rateHistoryModal: {
        title: "",
      },

      rateAll: [],
    };
  },
    methods: {
  
    //------------------------------------------------DB-------------------------------------------
   
      //Get RateRegular
      getRateRegularFromDb(idEmployee) {
        console.log("getRateRegularFromDb() - start");
        const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      };
        return axios
          .get(this.urlRate+`/api/rate/`+ idEmployee +`/regular`, header)
          .then((response) => {
             console.log(JSON.stringify(response.data));
              return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },

      //Get RateRegular ALL
      getRateRegularAllFromDb(idEmployee) {
        console.log("getRateRegularAllFromDb() - start");
        const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      };
        return axios
          .get(this.urlRate+`/api/rate/`+ idEmployee +`/regular/all`, header)
          .then((response) => {
             console.log(JSON.stringify(response.data));
              return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },
    

      //Get RateOvertime
      getRateOvertimeFromDb(idEmployee) {
        console.log("getRateOvertimeFromDb() - start");
        const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      };
        return axios
          .get(this.urlRate+`/api/rate/`+ idEmployee +`/overtime`, header)
          .then((response) => {
             console.log(JSON.stringify(response.data));
              return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },

      
      //Get RateOvertime ALL
      getRateOvertimeAllFromDb(idEmployee) {
        console.log("getRateOvertimeAllFromDb() - start");
        const header = {
          headers: {
              "Content-type": "application/json; charset=UTF-8",
              'Authorization': "Bearer "+ this.$store.getters.getToken
          },
      };
        return axios
          .get(this.urlRate+`/api/rate/`+ idEmployee +`/overtime/all`, header)
          .then((response) => {
             console.log(JSON.stringify(response.data));
              return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },

      addNewRateRagularDb(idEmployee) {
        console.log("addNewRateRagularDb() - start");
        //usuwanie ID żeby dodało jako nowe
        this.rateRegular.idRate="";
        const header = {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
           'Authorization': "Bearer "+ this.$store.getters.getToken
          },
        };
        return axios
          .post(this.urlRate+`/api/rate/`+ idEmployee +`/regular`, this.rateRegular, header)
          .then((response) => {
            this.rateRegular = response.data;
            return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },

      //
      //Add RateOvertime
      //
      addNewRateOvertimeDb(idEmployee) {
        console.log("addNewRateOvertimeDb() - start");
        //usuwanie ID żeby dodało jako nowe
        this.rateOvertime.idRate="";
        const header = {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
           'Authorization': "Bearer "+ this.$store.getters.getToken
          },
        };
        return axios
          .post(this.urlRate+`/api/rate/`+ idEmployee +`/overtime`, this.rateOvertime, header)
          .then((response) => {
            this.rateOvertime = response.data;
            return response;
          })
          .catch((e) => {
            this.validateError(e);
          });
      },
    },
}