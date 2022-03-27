import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HrCalculateSalaryView from '../views/HrCalculateSalaryView';
import HrAddWorkTimeView from '../views/HrAddWorkTimeView.vue';
import TaskCalendarView from '../views/TaskCalendarView.vue'
import MapsView from '@/views/MapsView.vue';
import LoginView from '@/views/LoginView.vue';
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
  },
  {
      path: '/tasks/TaskCalendar',
      name: 'TaskCalendar',
      component: TaskCalendarView,
      props: true
  },
  {
    path: '/tasks/maps',
    name: 'Maps',
    component: MapsView,
    props: true
},
{
  path: '/login',
  name: 'Login',
  component: LoginView,
  props: true
}
// ,
// {
//   łapie tu wszystkie zapytania nie złapane wyżej
//   path: '*',
//   name: 'NotFoundView',
//   component: NotFoundView,
//   props: true
// }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
