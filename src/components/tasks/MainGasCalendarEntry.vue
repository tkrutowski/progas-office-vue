<template>
  <div id="container" class="container-fluid">
    <div id="title">
      <h6 align="center" style="padding-top: 10px"><strong>GAZOCIĄG</strong></h6>
      <!--            <h6 class="subText"><strong>Nr zad.:</strong> {{taskNo}}</h6>-->
      <span class="mainText"><strong>Nr zad.: </strong></span>
      <span class="subText">{{ taskNo }}</span>
    </div>

    <div id="address">
      <p class="mainText"><strong>Adres:</strong></p>
      <p class="subText">{{ address }}</p>
    </div>

    <div id="msg">
      <b-form-textarea
        v-b-modal="'info' + taskNo"
        class="form-control"
        rows="3"
        v-bind:value="msg"
        readonly
      ></b-form-textarea>
    </div>

    <!--        Powiadomienia-->
    <div>
      <b-button v-b-toggle="'collapse' + idTeam" class="m-1" v-if="edit">...</b-button>
      <b-collapse :id="'collapse' + idTeam">
        <b-card no-body style="color: black; padding: 0.3rem">
          Powiadomienia:
          <!--                    <div  v-b-modal="'customer'+taskNo" id="customer" class="notification " :style="checkCustomer() ? {'background-color':'rgba(0,255,0,0.8)'} :{'background-color':'rgb(154,154,154)'} ">-->
          <!--                        <h6>Klient: </h6><h6>{{mailCustomerDate}}</h6>-->
          <!--                    </div>-->

          <div
            v-b-modal="'surveyor' + taskNo"
            id="surveyor"
            class="notification"
            :style="
              checkSurveyor()
                ? { 'background-color': 'rgba(0,255,0,0.8)' }
                : { 'background-color': 'rgb(154,154,154)' }
            "
          >
            <h6>Geodeda:</h6>
            <h6>{{ mailSurveyorDate }}</h6>
          </div>
        </b-card>
      </b-collapse>

      <!-- The modal  info-->
      <b-modal
        :id="'info' + taskNo"
        centered
        title="Informacje"
        @show="copyToInfo"
        @ok="assignValueInfo"
        ok-variant="progas"
      >
        <b-textarea id="input-info" v-model="tempInfo" rows="6" locale="pl"></b-textarea>
      </b-modal>

      <!-- The modal  surveyor-->
      <b-modal
        :id="'surveyor' + taskNo"
        centered
        title="Powiadomienie geodety"
        @show="resetIfNullSurveyor"
        @ok="assignValueSurveyor"
        ok-variant="progas"
      >
        <p class="my-6">Wybierz datę powiadomienia geodety</p>
        <div>
          <b-calendar v-model="tempDate" locale="pl" block></b-calendar>
        </div>
        <div class="modalWindow">
          <b-button variant="danger" @click="clearModalSurveyor">Wyczyść</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { errorMixin } from "@/mixins/error";
import { taskMixin } from "@/mixins/task";
export default {
  components: {},
  mixins: [errorMixin, taskMixin],
  name: "MainGasCalendarEntry",
  data() {
    return {
    };
  },
  props: {
    idEntry: Number,
    msg: String,
    taskNo: String,
    address: String,
    mailStatusSurveyor: String,
    mailSurveyorDate: String,
    tempDate: String,
    tempInfo: String,
    edit: Boolean,
    idTeam: Number,
  },
  methods: {
      //----------------------------------------------------DB-----------------------------------------------------
    putSurveyorDB() {
      console.log("putSurveyorDB() - start");
      axios
        .put(
          this.urlTask +
            `/api/taskcalendar/change_status/surveyor/` +
            this.idEntry +
            `?date=` +
            this.mailSurveyorDate +
            "&status=" +
            this.mailStatusSurveyor
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          let temp = response.data;
          // console.log("putSurveyorDB() - Success: " + temp);
          this.displaySmallMessage("success", "Zaaktualizowano dane.");
        })
        .catch((e) => {
           this.validateError(e);
        });
    },
    putMessageDB() {
      console.log("putMessageDB() - start");
      axios
        .put(this.urlTask + `/api/taskcalendar/msg/` + this.idEntry + `?msg=` + this.msg)
        .then((response) => {
          // JSON responses are automatically parsed.
          let temp = response.data;
          // console.log("putMessageDB() - Success: " + temp);
          this.displaySmallMessage("success", "Zaaktualizowano dane.");
        })
        .catch((e) => {
          this.validateError(e);
        });
    },
    //-----------------------------------------------------------------------------------------------------------
    checkSurveyor() {
      let isMail = false;
      if (this.mailStatusSurveyor === "SENT") {
        isMail = true;
      }
      return isMail;
    },
    //INFO MODAL
    copyToInfo() {
      this.tempInfo = this.msg;
    },
    assignValueInfo() {
      if (this.edit) {
        this.msg = this.tempInfo;
        //zapis do bazy
        this.putMessageDB();
      } else {
        this.displaySmallMessage("danger", "Nie masz uprawnień do edycji.");
      }
    },
    //SURVEYOR
    resetIfNullSurveyor() {
      this.tempDate = this.mailSurveyorDate;
    },
    assignValueSurveyor() {
      this.mailSurveyorDate = this.tempDate;
      this.tempDate != ""
        ? (this.mailStatusSurveyor = "SENT")
        : (this.mailStatusSurveyor = "NOT_SEND");
      //zapis do bazy
      this.putSurveyorDB();
    },
    clearModalSurveyor() {
      this.tempDate = "";
    },
  },
};
</script>

<style scoped>
.notification {
  padding: 8px 5px 1px;
  text-align: left;
  display: flex;
  flex-direction: row;
  /*align-self: flex-end;*/
  justify-content: space-between;
  margin-bottom: 5px;
}
#container {
  /*border: black 2px solid;*/
  /*border-radius: 10px;*/
  padding-bottom: 10px;
  margin-bottom: 10px;
  background-color: rgba(47, 47, 47, 0.8);
  /*background-color: rgba(97,93,92,0.8);*/
  /*border: 0.1px solid rgba(255,245,0,0.8);*/
  color: rgba(255, 245, 0, 0.8);
  min-width: 160px;
}
#title {
  text-align: left;
}

#address {
  text-align: left;
}
#cabinet {
  text-align: left;
}

.modalWindow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  /*align-content: center;*/
}

.mainText {
  color: rgb(225, 225, 225);
  padding-top: 10px;
  margin: 0px 0px 0px 0px;
}

.subText {
  color: rgb(154, 154, 154);
}
</style>
