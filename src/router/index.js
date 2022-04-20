import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HrCalculateSalaryView from '../views/HrCalculateSalaryView';
import HrAddWorkTimeView from '../views/HrAddWorkTimeView.vue';
import TaskCalendarView from '../views/TaskCalendarView.vue'
import MapsView from '@/views/MapsView.vue';
import LoginView from '@/views/LoginView.vue';
import UsersView from '@/views/UsersView.vue';
import UsersProfileView from '@/views/UserProfileView.vue';
import UserRolesView from '@/views/UserRolesView.vue';
import UserView from '@/views/UserView.vue';
import ErrorView from '@/views/ErrorView.vue'
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
},
{
  path: '/user/all',
  name: 'Users',
  component: UsersView,
  props: true
},
{
  path: '/user/profile',
  name: 'UserProfile',
  component: UsersProfileView,
  props: true
},
{
  path: '/user/add',
  name: 'User',
  component: UserView,
  props: true
},
{
  path: '/user/roles',
  name: 'UserRoles',
  component: UserRolesView,
  props: true
},
{
  path: '/error',
  name: 'Error',
  component: ErrorView,
  props: true
},
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
