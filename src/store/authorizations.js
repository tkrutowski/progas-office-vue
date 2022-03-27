const authorizations = {
    state: {
        token: "",
        userState: {
            isAuthenticated: true,
            username: "focik",
            userFirstName: "Tomek"
        }
    },
    mutations: {
        updateToken(state, newToken){
            state.token = newToken;
        },
        updateAuthenticateState(state, userState){
            state.userState = userState;
        }
    },
    getters:{
        getToken(state){
            return state.token;
        },
        getAuthenticationState(state){
            return state.userState;
        }
    }
};

export default authorizations;