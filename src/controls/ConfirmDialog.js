import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import Controls from "./Controls"
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        top: theme.spacing(5),
        padding: theme.spacing(2)
    },
    dialogContent: {
        textAlign: "center"
    },
    dialogAction: {
        justifyContent: "center"
    },
    dialogTitle: {
        textAlign: "center"
    },
    titleIcon: {
        justifyContent: "center",
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main,
        '& hover': {
            backgroundColor: theme.palette.secondary.light,
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem'
        }
    }
}))


function ConfirmDialog({ confirmDialog, setConfirmDialog }) {



    const handleClose = () => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
    }





    const classes = useStyles()
    return (
        <Dialog
            open={confirmDialog.isOpen}
            classes={{ paper: classes.root }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subtitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Controls.Button
                    label="No"
                    color="default"
                    onClick={handleClose}
                />
                <Controls.Button
                    label="Yes"
                    color="secondary"
                    onClick={confirmDialog.onConfirm}
                />
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
