import { Paper, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Tabs, TabPanel } from "./../../controls/Tabs"
import AddReplace from "./Addreplace"
import ShowPendingReplace from './ShowPendingReplace'
import ShowRecieved from "./ShowRecieved"
import { replaceAction } from "./../../Datalayer/actionTypes"
import { useStateValue } from "./../../Datalayer/StateProvider"
import db from "./../../config/firebase"
import { auth } from 'firebase'
import ShowReturn from './ShowReturn'
import ShowCanceled from './ShowCanceled'
const useStyles = makeStyles(theme => ({
    paper: {
        flexGrow: 1,
    },
    btn: {
        marginRight: theme.spacing(1)
    },
    typography: {
        margin: theme.spacing(2)

    },
    tabs: {
        borderBottom: `1px solid ${theme.palette.primary.light}`
    }
}))

const MangeReplace = () => {

    const [{ }, dispatch] = useStateValue()
    const [products, setProducts] = useState([])


    useEffect(() => {
        if (auth().currentUser) {
            db.collection('warrantyDevice')
                .where("user", "==", auth().currentUser.uid)
                .onSnapshot(snapshot => {
                    setProducts(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                ...doc.data()
                            }
                        ))
                    )

                })
        }


    }, [auth().currentUser])

    useEffect(() => {
        dispatch({
            type: replaceAction.SET_REPLACE,
            products: products,
        })
    }, [products])
    const TabItem = [

        { title: 'Add Replacement' },
        { title: 'Pending Replacement' },
        { title: 'Recieved Replacement' },
        { title: 'Return Replacement' },
        { title: 'Canceled Replacement' },
    ]
    const [selectedTab, setSelectedTab] = useState(0)

    const classes = useStyles()
    return (

        <Paper className={classes.paper}>

            <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab} 
                items={TabItem}
                variant="scrollable"
            />


            <TabPanel value={selectedTab} index={0} component={<AddReplace />} />
            <TabPanel value={selectedTab} index={1} component={<ShowPendingReplace />} />
            <TabPanel value={selectedTab} index={2} component={<ShowRecieved />} />
            <TabPanel value={selectedTab} index={3} component={<ShowReturn />} />
            <TabPanel value={selectedTab} index={4} component={<ShowCanceled />} />

        </Paper>
    )
}

export default MangeReplace
