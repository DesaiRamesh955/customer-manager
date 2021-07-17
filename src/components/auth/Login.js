import { Grid, LinearProgress, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import Controls from "../../controls/Controls"
import { Form, useForm } from "../../utils/useForm"
import Notification from "../../controls/Notification"
import { useProgress } from "../../utils/useProgress"
import { auth } from "firebase"
import firebase from "firebase"
import db from "../../config/firebase"
import { provider } from "../../config/firebase"
import React, { useState } from 'react'
import { useStateValue } from "../../Datalayer/StateProvider"
import { userAction } from "../../Datalayer/actionTypes"
import { Link } from 'react-router-dom'
import logo from "./../../g.png"

import { useHistory } from "react-router-dom"
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
    },
    logo: {
        height: '20px',

        objectFit: "contain"
    }


}))
const Login = () => {
    const history = useHistory()
    const initialValue = {
        username: '',
        password: ''
    }

    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const [{ }, dispatch] = useStateValue()
    const { progressForm, setProgressForm } = useProgress()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const validate = () => {
        const temp = {}
        temp.username = (input.username) ? '' : 'Please enter username'

        temp.password = (input.password) ? '' : 'Please enter password'

        setError({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)
            auth().signInWithEmailAndPassword(input.username, input.password)
                .then(user => {
                    dispatch({
                        type: userAction.SIGN_IN,
                        user: user
                    })
                    setProgressForm(false)
                })
                .catch(error => {
                    setNotify({
                        isOpen: true,
                        message: 'invalid credential',
                        type: 'error'
                    })
                    setProgressForm(false)
                })

        }
    }
    const signinwithGoogle = () => {
        auth().signInWithPopup(provider)
            .then(user => {
                dispatch({
                    type: userAction.SIGN_IN,
                    user: user
                })
                const _user = {
                    uid: user.user.uid,
                    first_name: user.user.displayName.split(' ')[0],
                    last_name: user.user.displayName.split(' ')[1],
                    email: user.user.email,
                    photoURL: user.user.photoURL,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                }
                db.collection("users").doc(user.user.uid).set(_user,{merge: true})
                    .then(user => {
                        setInput(initialValue)
                        setNotify({
                            isOpen: true,
                            message: "User created successfully!",
                            type: 'success'
                        })
                        setProgressForm(false)
                        history.push("/")
                    })
                    .catch(error => {
                        setProgressForm(false)
                    })
            })
            .catch(error => {
                setNotify({
                    isOpen: true,
                    message: "User created failed!",
                    type: 'error'
                })
                setProgressForm(false)
            })
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
                                <Grid item sm>
                                    <Controls.Input
                                        error={error.password}
                                        onChange={handleInput}
                                        type="password" label="Password" value={input.password} name="password" />
                                </Grid>
                                <Grid item sm container justify="space-between" spacing={1}>
                                    <Grid item container justify="space-between">
                                        <Controls.Button
                                            disabled={progressForm}
                                            type="submit"
                                            label="signin"

                                        />
                                        <Controls.Button
                                            disabled={progressForm}
                                            type="button"
                                            label="signin with google"
                                            startIcon={<img src={logo} className={classes.logo} />}
                                            variant="contained"
                                            color="default"
                                            disableElevation
                                            onClick={signinwithGoogle}
                                        />
                                    </Grid>

                                    <Grid item>

                                        <Controls.Button
                                            disabled={progressForm}
                                            type="button"
                                            variant='text'
                                            label={<Link className={classes.text} to="/forgetpassword">Forget password ? </Link>}

                                        />
                                    </Grid>
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

export default Login
