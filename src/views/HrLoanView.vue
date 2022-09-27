<template>
<div>
    <LoanVue/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoanVue from "@/components/hr/TheLoan.vue";
export default {
  name: 'LoanView',
  components: {
    LoanVue
},
};
</script>
