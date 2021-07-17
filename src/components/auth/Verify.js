import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import Controls from "./../../controls/Controls"
import Notification from "./../../controls/Notification"
import { auth } from "firebase"
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    padding: {
        padding: theme.spacing(2.5),
    },
    margin: {
        marginBottom: theme.spacing(1),
    },

    gridContainer: {
        height: "90vh"
    },
    text: {
        textDecoration: "none"
    }


}))
const Verify = () => {
    const history = useHistory()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [email, setEmail] = useState('')
    const [disableBtn, setDisableBtn] = useState(false)


    useEffect(() => {

        if (auth().currentUser) {
            setEmail(auth().currentUser.email)

        }

    }, [auth().currentUser])


    const verfyEmail = () => {
        const user = auth().currentUser
        if (user) {
            user.sendEmailVerification()
                .then((useremail) => {
                    console.log(useremail)
                    setNotify({
                        isOpen: true,
                        message: `Verification link sent to ${email}`
                    })
                    setDisableBtn(true)
                    setTimeout(() => {

                        setDisableBtn(false)
                    }, 5000)

                })
        }
    }

    const classes = useStyles()
    return (
        <>

            <Grid className={classes.gridContainer} container justify="center" alignItems="center" >
                <Grid item xs={11} sm={8} md={4}>
                    <Paper className={classes.padding} elevation={3}>
                        <Typography variant="h6" component="div" className={classes.margin} color="error">
                            {email && `${email} not verified`}
                        </Typography>
                        <Grid item sm container justify="space-between">
                            <Controls.Button
                                disabled={disableBtn}
                                type="button"
                                label="Verify email"
                                onClick={verfyEmail}
                            />

                            <Controls.Button
                                variant="text"
                                type="button"
                                label="Signin"
                                onClick={() => auth().signOut()}
                            />
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}

export default Verify

