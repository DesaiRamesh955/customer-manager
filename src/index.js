import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './Datalayer/StateProvider'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from "react-router-dom"
import { rootReducer, rootInitialstate } from "./Datalayer/rootReducer"

const outerTheme = createMuiTheme({

  palette: {
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f1f3f6" //"#f4f5fd"
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  },

});
ReactDOM.render(
  <ThemeProvider theme={outerTheme}>
    <StateProvider initialState={rootInitialstate} reducer={rootReducer}>

      <Router>
        <App />

      </Router>
    </StateProvider>
  </ThemeProvider >
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
