import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HrCalculateSalaryView from '../views/HrCalculateSalaryView';
import HrAddWorkTimeView from '../views/HrAddWorkTimeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
      path: '/hr/CalculateSalary',
      name: 'CalculateSalary',
      component: HrCalculateSalaryView,
      props: true
  },
  {
      path: '/hr/AddWorkTime',
      name: 'AddWorkTime',
      component: HrAddWorkTimeView,
      props: true
  }

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
