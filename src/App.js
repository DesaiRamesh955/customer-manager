import React, { useEffect } from 'react';
import { auth } from "firebase"

import { userAction } from "./Datalayer/actionTypes"
import { Switch, Route } from "react-router-dom"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Appbar from "./components/utility/Appbar"
import PageNotfound from "./components/utility/PageNotfound"
import Verify from "./components/auth/Verify"

import { useStateValue } from "./Datalayer/StateProvider"
import Home from "./components/Home"
import ForgetPassword from './components/auth/Forgetpassword';
const App = () => {


  // const history = useHistory()
  const [{ userReducer }, dispatch] = useStateValue()



  useEffect(() => {

    auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: userAction.SIGN_IN,
          user: user
        })
      } else {
        dispatch({
          type: userAction.SIGN_OUT
        })
      }
    })

  }, [userReducer.user])


  return !userReducer.user ? (
    <div className="app">
      <Appbar />
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/forgetpassword">
          <ForgetPassword />
        </Route>

        <Route exact path="/Signup">
          <Signup />
        </Route>

        <Route exact>
          <PageNotfound />
        </Route>

      </Switch>

    </div>
  ) : userReducer.user && userReducer.user.emailVerified == false ? (
    <div className="app">
      <Verify />
    </div>
  ) : (
        <div className="app">
          <Home />
        </div>
      )
}

export default App;
