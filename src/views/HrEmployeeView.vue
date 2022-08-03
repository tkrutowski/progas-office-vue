<template>
<div>
    <EmployeeVue/>
  </div>
</template>

<script>
// @ is an alias to /src
// import Menu from '@/components/TheHeader.vue';
import EmployeeVue from "@/components/hr/TheEmployee.vue";
export default {
  name: 'EmployeeView',
  components: {
    EmployeeVue
},
};
</script>
