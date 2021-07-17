import { Paper, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { Tabs, TabPanel } from "./../../controls/Tabs"
import AddSeller from "./AddSeller"
import ShowSeller from "./ShowSeller"

// icons

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


const ManageSeller = () => {
    const TabItem = [

        { title: 'Show seller' },
        { title: 'Add seller' }
    ]
    const [selectedTab, setSelectedTab] = useState(0)

    const classes = useStyles()
    return (

        <Paper className={classes.paper}>

            <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                centered
                items={TabItem}
            />


            <TabPanel value={selectedTab} index={0} component={<ShowSeller />} />
            <TabPanel value={selectedTab} index={1} component={<AddSeller />} />

        </Paper>

    )
}

export default ManageSeller
