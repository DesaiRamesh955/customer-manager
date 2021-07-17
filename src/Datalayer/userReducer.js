import { userAction } from "./actionTypes"

export const userInitialState = {
    user: localStorage.getItem('user') ? localStorage.getItem('user') : null
}


const userReducer = (state, action) => {
    switch (action.type) {

        case userAction.SIGN_IN:
            localStorage.setItem('user', action.user)
            return {
                ...state,
                user: action.user

            };
        case userAction.SIGN_OUT:
            localStorage.removeItem('user')
            return {
                ...state,
                user: null
            };

        default:
            return state;
    }
}

export default userReducer