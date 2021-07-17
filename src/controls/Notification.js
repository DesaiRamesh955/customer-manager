import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        top: theme.spacing(9)
    }
}))

const Notification = ({ notify, setNotify, duration }) => {
    const classes = useStyles()
    const handleClose = (event, reason) => {
        if (reason != "clickaway") {

            setNotify({
                ...notify,
                isOpen: false
            })
        }
    }

    return (
        <Snackbar
            className={classes.root}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={notify.isOpen}
            autoHideDuration={notify.duration || 3000}
            onClose={handleClose}
        >
            <Alert
                severity={notify.type}
                onClose={handleClose}
            >
                {notify.message}
            </Alert>
        </Snackbar>
    )
}

export default Notification
