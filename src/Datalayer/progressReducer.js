import { progressAction } from "./actionTypes"
export const progressInitialState = {
    progressForm: false
}


const progressReducer = (state, action) => {
    switch (action.type) {

        case progressAction.SET_PROGRESS:

            return {
                ...state,
                progressForm: action.progress,

            };

        default:
            return state;
    }
}

export default progressReducer