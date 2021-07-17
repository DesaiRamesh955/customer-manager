import firebase from "firebase"

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const provider = new firebase.auth.GoogleAuthProvider()


export { provider }
export default db