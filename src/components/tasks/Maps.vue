<template>
  <div id="container">
    <div id="buttons">
      <b-button
        class="btn btn-warning mt-3 button-view"
         @click="btnDirection_click"
          :pressed="isDirection">
        Jak dojechać
      </b-button>

      <b-button class="btn btn-warning mt-3 button-view" 
      @click="btnView_click"
      :pressed="isView">
        Widok celu
      </b-button>

      <b-button
        class="btn btn-warning mt-3 button-view"
        @click="btnStreetView_click"   
        :pressed="isStreetView">
        Street View
        </b-button>
    </div>

    <div v-if="isDirection">
      <iframe
        width="100%"
         :height= "heightDiv"
        frameborder="0"
        style="border: 0"
        :src="url_direction"
        allowfullscreen
      >
      </iframe>
    </div>

    <div v-if="isView">
     <b-img :src="url_view" fluid alt="Google maps image"></b-img>
    </div>


    <div id="view" v-if="isStreetView" >
      <iframe
        width="100%"
        :height= "heightDiv"
        frameborder="0"
        style="border: 0"
        :src="url_streetview"
        allowfullscreen
      >
      </iframe>
    </div>

  </div>
</template>

<script>
export default {
  name: "Maps",
  data() {
    return {
      url_direction: "https://www.google.com/maps/embed/v1/directions",
      url_view: "https://maps.googleapis.com/maps/api/staticmap",
      url_streetview: "https://www.google.com/maps/embed/v1/streetview",
      key: "?key=AIzaSyCuGZ67O4fm2GZLTlhYPHWYTHD-TPRZW4g",
      //  latitud: "52.082388888888888888888888888889",
      //  longitud: "16.622194444444444444444444444444",
      zoom: "&zoom=18",
      originLat: "52.449866933508986",
      originLong: "17.08871121669052",
      isDirection: false,
      isView: true,
      isStreetView: false,
      heightDiv: window.innerHeight-400,
      weightDiv: window.innerWidth,
      viewHeigth: 640, //max size
      viewWeight: 640, //max size
      lat1:this.$route.params.lat,
      long1:this.$route.params.long

    }
  },
  created() {
    this.calculateDirectionURL();
    this.calculateViewURL();
    this.calculateStreetViewURL();
  },
  methods: {
    calculateDirectionURL(){
      this.url_direction =
      this.url_direction +
      this.key +
      "&origin=" +
      this.originLat +
      "," +
      this.originLong +
      "&destination=" +
      this.$route.params.lat+
      "," +
      this.$route.params.long;
    },
     calculateViewURL() {
       if(window.innerWidth/2 < 640){
         this.viewWeight = window.innerWidth/2;
       }
       if(this.heightDiv/2 < 640){
         this.viewHeigth = this.heightDiv/2;
       }

      this.url_view =
      this.url_view +
      this.key +
      "&markers=size:small%7Ccolor:yellow%7C"+
      this.$route.params.lat +
      "," +
      this.$route.params.long +
      "&size="+this.viewWeight+"x"+this.viewHeigth+
      "&maptype=satellite"+
      "&scale=2";
    },
    calculateStreetViewURL(){
      this.url_streetview =
      this.url_streetview +
      this.key +
      "&location=" +
      this.$route.params.lat +
      "," +
      this.$route.params.long;
    },
    btnDirection_click() {
      this.isStreetView = false;
      this.isView = false;
      this.isDirection = true;
    },
    btnView_click() {
      this.isDirection = false;
      this.isStreetView = false;
      this.isView = true;
    },
    btnStreetView_click() {
      this.isDirection = false;
      this.isView = false;
      this.isStreetView = true;
    },
  },
  props: {
    latitude: String,
    longitude: String,
  },
};
</script>

<style scoped>
#container {
  display: block;
}

#buttons {
  display: flex;
  justify-content: center;
  /*float: left;*/
  /* height: 50px; */
  width: 50%;
  /* background-color: rgb(97,93,92); */
  padding: 20px;
  margin: auto;
}
#name {
  color: rgba(255, 245, 0, 0.8);
  padding-top: 50px;
  padding-right: 50px;
}
.button-view {
  background-color: rgba(255, 245, 0, 0.8);
  color: #2c3e50;
  border-color: rgb(108, 117, 125);
  width: 120px;
  margin: 20px;
  /* font-weight: bold; */
}

</style>