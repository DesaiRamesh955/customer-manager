import db from "../config/firebase"
import firebase from "firebase"
const getData = () => {

    let devices = []

    db.collection('devices')
        .orderBy('created_at', 'desc')
        .where('user', '==', firebase.auth().currentUser.uid)
        .onSnapshot(snapshot => {

            snapshot.docs.map(doc => (
                devices.push({
                    id: doc.id,
                    title: doc.data().device
                })

            ))

        })
    return devices

}


export default getData
