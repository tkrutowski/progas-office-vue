import router from "@/router";
import axios from "axios";
export const userMixin = {
  data() {
    return {
      // urlUser: "http://localhost:8089",
      // urlUser: "http://localhost:8082",
      urlUser: "https://docker.focikhome.synology.me",
      
      idUser: 0,
      isEdit: false,
      user: {
        id: 0,
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        username: "",
        enabled: true,
        notLocked: true,
        idEmployee: 0
      },
   
    };
  },
    methods: {
    //
    //get user from DB
    //
    getUserFromDb(userID) {
      console.log("getUserFromDb() - start, ID = " + userID);
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Authorization': "Bearer "+ this.$store.getters.getToken
        },
      };
      axios
        .get(this.urlUser + `/api/user/` + userID, header)
        .then((response) => {
          this.user = response.data;
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          console.log("getUserFromDb(): " + this.user);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //
    //add USER into db
    //
    addUserDB() {
      console.log("addUserDB() - start");
            console.log("updateUser() - employeeID: "+this.user.idEmployee);
      // console.log("updateUser() - employeeID: "+this.user.idEmployee);
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
        'Authorization': "Bearer "+ this.$store.getters.getToken
      };
      axios
        .post(this.urlUser + `/api/user`, this.user, {
          headers,
        })
        .then((response) => {
          this.displaySmallMessage("success", "Dodano użytkownika.");
          this.resetForm();
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //
    //update user
    //
    updateUserDb() {
      console.log("updateUser() - start");
      const header = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
         'Authorization': "Bearer "+ this.$store.getters.getToken
        },
      };
      axios
        .put(this.urlUser + `/api/user/update`, this.user, header)
        .then((response) => {
          this.user = response.data;
          this.displaySmallMessage("success", "Zaaktualizowano użytkownika.");
          console.log(
            "Odpowiedz HTTP: " + response.status + ", " + response.statusText
          );
          console.log("after updateUser(): " + this.user);
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    },
}