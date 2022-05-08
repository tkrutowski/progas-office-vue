import router from "@/router";
export const errorMixin = {
    
    methods: {
        displaySmallMessage(variant = null, msg) {
            this.$bvToast.toast(`${msg}`, {
              title: "Informacja",
              variant: variant,
              solid: true,
            });
          },
          displayLargeMessage(variant = null, msg) {
            this.$bvToast.toast(`${msg}`, {
              title: "Informacja",
              variant: variant,
              solid: true,
              toaster: "b-toaster-top-full",
            });
          },


        validateError(e) {
            console.log(
              "validating error: " +
              e.response.status +
              ", status: " +
              e.response.data.httpStatus +
              ", message: " +
              e.response.data.message
            );
             
            
             if(e.response.status == 401){
                router.push({
                    name: "Error",
                       params: { error: 401},
                  });
            }
            else      
            if(e.response.status == 503){
               router.push({
              name: "Error",
                 params: { error: 503},
            });
            }
            else{
              let msgError =
              "error: " + e.response.status + ";    " + e.response.data.message;
              this.displayLargeMessage("danger", msgError);
            }
          },
    },
}