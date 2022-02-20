<template>
    <div>
        <div id="logo-back">
            <img id="logo" alt="Vue logo" src="../assets/logo.png">
            <h1 id="name">ProgasOffice</h1>
        </div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="/">Home</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav id="test">

                    <b-nav-item-dropdown text="Pracownicy" right>
                        <b-dropdown-item href="#" disabled>Lista pracowników</b-dropdown-item>
                        <b-dropdown-item href="/hr/AddWorkTime">Wpisywanie godzin</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Wpisywanie dodatków</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Wpisywanie zaliczek</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Wpisywanie pożyczek</b-dropdown-item>
                        <b-dropdown-item href="/hr/CalculateSalary">Oblicznie wypłat</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Lista pożyczek</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item href="#" disabled>Klienci</b-nav-item>
                    <b-nav-item href="#" disabled>Finanse</b-nav-item>

                    <b-nav-item-dropdown text="Zadania" right>
                        <b-dropdown-item href="#" disabled>Gazociąg</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Przyłącze</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Wewnętrzna</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Terminarz</b-dropdown-item>
                        <b-dropdown-item href="../TaskCalendar" >Kalendarz</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Koordynator</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Geodeta</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Projektant</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Projektant org. ruchu</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Inspektor</b-dropdown-item>
                        <b-dropdown-item href="#" disabled>Dane adresowe</b-dropdown-item>
                    </b-nav-item-dropdown>

<!--                    <b-nav-item href="#" :active="isTaskActive">Zadania</b-nav-item>-->
                    <b-nav-item href="#" disabled>Pojazdy</b-nav-item>
                    <b-nav-item href="#" disabled>Ustawienia</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                    </b-nav-form>



                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template #button-content>
                            <em>{{userName}}</em>
                        </template>
                        <b-dropdown-item href="#">Profil użytkownika</b-dropdown-item>
                        <b-dropdown-item href="#">Wyloguj</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
   
    </div>
</template>

<script>
    export default {
        name: "MainMenu",
        data(){
            return{
                userName: "zaloguj się",
                isHrActive: false,
                isCustomerActive: false,
                isFinanceActive: false,
                isTaskActive: false,
                isVehiclesActive: false,
                isSettingActive: false
            }
        },
        methods:{
            changeHrActive(){
                this.isHrActive = true;
                this.isCustomerActive = false;
                this.isFinanceActive = false;
                this.isTaskActive = false;
                this.isVehiclesActive = false;
                this.isSettingActive = false;
            }
        }
    }
</script>

<style scoped>
    #logo{
        /*display: block;*/
        width: 150px;
        margin-left: 50px;
        /*float: left;*/
    }
    #logo-back{
        display: flex;
        justify-content: space-between;
        /*float: left;*/
        height: 150px;
        width: auto;
        background-color: rgb(97,93,92);
    }
    #name{
        color: rgba(255,245,0,0.8);
        padding-top: 50px;
        padding-right: 50px;
    }
</style>