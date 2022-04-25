const types = {
    //Login
    login: '[Auth] Login',
    logout: '[Auth] Logout',

}
export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case types.login:
            return {

            }
        case types.logout:
            return {}

        default:
            return state;

    }
}