import { Grid, LinearProgress, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import Controls from "./../../controls/Controls"
import { Form, useForm } from "./../../utils/useForm"
import Notification from "./../../controls/Notification"
import { useProgress } from "./../../utils/useProgress"
import { auth } from "firebase"
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


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
const ForgetPassword = () => {

    const initialValue = {
        username: ''
    }

    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const { progressForm, setProgressForm } = useProgress()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const validate = () => {
        const temp = {}
        temp.username = (input.username) ? '' : 'Please enter username'
        setError({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)

            auth().sendPasswordResetEmail(input.username)
                .then(user => {

                    setInput(initialValue)
                    setNotify({
                        isOpen: true,
                        message: `We have sent an email to ${input.username}`,
                        type: 'success'
                    })
                    setProgressForm(false)
                })
                .catch(error => {

                    if (error.code === "auth/user-not-found") {
                        setNotify({
                            isOpen: true,
                            message: ` ${input.username} user not found`,
                            type: 'error'
                        })

                    } else if (error.code === "auth/invalid-email") {
                        setNotify({
                            isOpen: true,
                            message: 'Invalid email address',
                            type: 'error'
                        })
                    } else {
                        setNotify({
                            isOpen: true,
                            message: 'Something went wrong',
                            type: 'error'
                        })
                    }

                    setProgressForm(false)
                })
        }
    }

    const classes = useStyles()
    return (
        <>
            {
                progressForm ? <LinearProgress /> : ''
            }
            <Grid className={classes.gridContainer} container justify="center" alignItems="center" >

                <Grid item xs={11} sm={8} md={4}>
                    <Paper className={classes.padding} elevation={3}>

                        <Form onSubmit={handleSubmit}>
                            <Grid item container direction="column" spacing={2}>
                                <Grid item sm>
                                    <Controls.Input
                                        error={error.username}
                                        onChange={handleInput}
                                        label="Username" value={input.username} name="username" />
                                </Grid>

                                <Grid item sm container justify="space-between">
                                    <Controls.Button
                                        disabled={progressForm}
                                        type="submit"
                                        label="Reset"

                                    />

                                    <Controls.Button
                                        disabled={progressForm}
                                        type="submit"
                                        variant='text'
                                        label={<Link className={classes.text} to="/">Signin </Link>}

                                    />
                                </Grid>
                            </Grid>
                        </Form>
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

export default ForgetPassword
