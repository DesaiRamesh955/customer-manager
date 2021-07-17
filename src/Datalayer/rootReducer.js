import combineReducers from 'react-combine-reducers';
import userReducer, { userInitialState } from "./userReducer"
import progressReducer, { progressInitialState } from "./progressReducer"
import deviceReducer, { deviceInitialState } from "./deviceReducer"
export const [rootReducer, rootInitialstate] = combineReducers({
    userReducer: [userReducer, userInitialState],
    progressReducer: [progressReducer, progressInitialState],
    deviceReducer: [deviceReducer, deviceInitialState]

});