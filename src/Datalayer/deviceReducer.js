import { replaceAction } from "./actionTypes"
export const deviceInitialState = {
    products: []

}


const deviceReducer = (state, action) => {
    switch (action.type) {

        case replaceAction.SET_REPLACE:

            return {
                ...state,
                products: action.products
            };

        default:
            return state;
    }
}

export default deviceReducer