import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HrCalculateSalaryView from '../views/HrCalculateSalaryView';
import HrAddWorkTimeView from '../views/HrAddWorkTimeView.vue';
import HrAdditionsView from '../views/HrAddAdditionsView.vue';
import HrAddLoanInstallmentView from '../views/HrAddLoanInstallmentView.vue';
import HrAdvancesView from '../views/HrAddAdvencesView.vue';
import HrEmployeesView from '../views/HrEmployeesView.vue';
import HrLoansView from '../views/HrLoansView.vue';
import TaskCalendarView from '../views/TaskCalendarView.vue'
import MapsView from '@/views/MapsView.vue';
import LoginView from '@/views/LoginView.vue';
import UsersView from '@/views/UsersView.vue';
import UsersProfileView from '@/views/UserProfileView.vue';
import UserRolesView from '@/views/UserRolesView.vue';
import UserView from '@/views/UserView.vue';
import ErrorView from '@/views/ErrorView.vue'
import HrEmployeeView from '../views/HrEmployeeView.vue';
import HrLoanView from '../views/HrLoanView.vue';

import HrPrintView  from '../views/HrPrintPDFView.vue';
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
    path: '/hr/AddAdditions',
    name: 'AddAdditions',
    component: HrAdditionsView,
    props: true
},
{
  path: '/hr/AddLoanInstallment',
  name: 'AddLoanInstallment',
  component: HrAddLoanInstallmentView,
  props: true
},
{
  path: '/hr/AddAdvances',
  name: 'AddAdvances',
  component: HrAdvancesView,
  props: true
},
{
    path: '/hr/employee/all',
    name: 'TheEmployees',
    component: HrEmployeesView,
    props: true
},
{
  path: '/hr/employee/worktime/print',
  name: 'TheHrPrintPDF',
  component: HrPrintView,
  props: true
},
{
  path: '/hr/employee',
  name: 'TheEmployee',
  component: HrEmployeeView,
  props: true
},
{
  path: '/hr/loan/all',
  name: 'TheLoans',
  component: HrLoansView,
  props: true
},
{
  path: '/hr/loan',
  name: 'TheLoan',
  component: HrLoanView,
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
