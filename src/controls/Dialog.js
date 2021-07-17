import React from 'react'
import { Dialog as MuiDialog, DialogTitle, DialogContent, makeStyles, Typography } from "@material-ui/core"
import Controls from "./../controls/Controls"
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        top: theme.spacing(5),
        padding: theme.spacing(2)
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    }
}))




const Dialog = ({ dialog, setDialog, children }) => {


    const handleClose = () => {
        setDialog({
            ...dialog,
            isOpen: false
        })
    }
    const classes = useStyles()
    return (
        <MuiDialog
            open={dialog.isOpen}

            classes={{ paper: classes.root }}
        >
            <DialogTitle>
                <div className={classes.title}>
                    <Typography variant="h6" component="div">
                        {dialog.title}
                    </Typography>
                    <Controls.ActionButton
                        onClick={handleClose}
                        color="secondary"
                        type="button"
                    > <CloseIcon /> </Controls.ActionButton>
                </div>



            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </MuiDialog>
    )
}

export default Dialog
