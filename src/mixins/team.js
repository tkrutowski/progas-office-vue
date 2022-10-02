import router from "@/router";
import axios from "axios";
export const teamMixin = {
  data() {
    return {
      // urlTeam: "http://localhost:8089",
      // urlTeam: "http://localhost:8082",
      // urlTeam: "http://192.168.1.33:8082",
      urlTeam: "https://docker.focikhome.synology.me",
    
        
    };
  },
    methods: {
      
      getTeamsFromDb() {
        console.log("getTeamsFromDb() - start");
        const header = {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': "Bearer " + this.$store.getters.getToken
            },
        };
        axios.get(this.urlTeam + `/api/teams`, header)
            .then(response => {
                // JSON responses are automatically parsed.
                this.allTeams = response.data;
                console.log("getTeamsFromDb() - Ilosc teams[]: " + this.allTeams.length);
            })
            .catch(e => {
                this.validateError(e);
            });
    },


    getTeamFromDb(idTeam) {
        console.log("START - getTeamFromDb(idTeam: "+idTeam+")");
        const header = {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': "Bearer " + this.$store.getters.getToken
          },
        };
        axios.get(this.urlTeam + `/api/teams/` + idTeam, header)
        .then(response => {
          // console.log(JSON.stringify(response.data));
          this.allTeams = [];
          this.allTeams.push(response.data);
          console.log("getTeamFromDb() - Ilosc teams[]: " + this.allTeams.length);
        })
        .catch(e => {
          this.validateError(e);
        });
        console.log("END - getTeamFromDb(idTeam: "+idTeam+")");
      },
    },
}