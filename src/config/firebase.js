import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyBm3Jg-l_8YkU7hDgrMtsm_2B0F2hPc3SE",
    authDomain: "customer-1d2c1.firebaseapp.com",
    databaseURL: "https://customer-1d2c1.firebaseio.com",
    projectId: "customer-1d2c1",
    storageBucket: "customer-1d2c1.appspot.com",
    messagingSenderId: "820421734962",
    appId: "1:820421734962:web:dbe160a9566b7ea765422b"
  };
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const provider = new firebase.auth.GoogleAuthProvider()


export { provider }
export default db