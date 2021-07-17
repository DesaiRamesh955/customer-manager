import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CardContent from "./CardContent"

import { auth } from "firebase"
import db from "../../config/firebase"
function Dashboard() {

    const [customers, setCustomers] = useState([])

    useEffect(() => {

        if (auth().currentUser) {
            db.collection('customers').onSnapshot(snapshot => (
                setCustomers(
                    snapshot.docs.map(doc => (
                        {
                            id: doc.id,
                            ...doc.data()
                        }
                    ))
                )
            ))

        }

    }, [auth().currentUser])


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
                <CardContent />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardContent />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardContent />
            </Grid>
        </Grid>
    )
}

export default Dashboard
