import { mapGetters } from "vuex";
import jwt_decode from "jwt-decode";
export const privilegesEmployee = { 
  data() {
    return {
      rateAll: [],
    };
  },
  computed: {
    ...mapGetters(["getAuthenticationState", "getUserFirstName", "getToken"]),
    isAdmin() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_ADMIN: " + token2.authorities.includes('ROLE_ADMIN'))
        return token2.authorities.includes("ROLE_ADMIN");
      } catch (error) {
        return false;
      }
    },

    hasAccessEmployeeWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return token2.authorities.includes("ROLE_HR_EMPLOYEE_WRITE_ALL");
      } catch (error) {
        return false;
      }
    },

    hasAccessRateWrite() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return token2.authorities.includes("ROLE_HR_RATE_WRITE_ALL") ||
        token2.authorities.includes("ROLE_ADMIN");
      } catch (error) {
        return false;
      }
    },

    hasAccessRate() {
      try {
        let token2 = jwt_decode(this.getToken);
        // console.log("token: ROLE_HR_WORKTIME: " + token2.authorities.includes('ROLE_HR_WORKTIME'))
        return token2.authorities.includes("ROLE_HR_RATE_READ_ALL");
      } catch (error) {
        return false;
      }
    },

   

  },
 methods: {},
}
