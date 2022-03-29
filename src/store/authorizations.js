const authorizations = {
    state: {
        token: "",
        isAuthenticated: false,
        user: {
            id:0,
            username: "test",
            firstName: "Test"
        }
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
        }
    }
};

export default authorizations;