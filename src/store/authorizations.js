const authorizations = {
    state: {
        token: "null",
        isAuthenticated: false,
        user: {
            id:0,
            username: "test",
            firstName: "Test",
            idEmployee: 0
        },
        userPrivileges: []
    },
    mutations: {
        updateToken(state, newToken){
            state.token = newToken;
        },
        updateAuthenticateState(state, isAuth){
            state.isAuthenticated = isAuth;
        },
        updateUser(state, u){
            state.user = u;
        },
        updateUserPrivileges(state, priv){
            state.userPrivileges = priv;
        }
    },
    getters:{
        getToken(state){
            return state.token;
        },
        getAuthenticationState(state){
            return state.isAuthenticated;
        },  
        getUser(state){
            return state.user;
        },  
        getUserFirstName(state){
            return state.user.firstName;
        },
        getUserId(state){
            return state.user.id;
        },
        getUserPrivileges(state){
            return state.userPrivileges;
        }
    }
};

export default authorizations;