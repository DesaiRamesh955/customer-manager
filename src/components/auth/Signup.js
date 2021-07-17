import { Grid, makeStyles, Paper, LinearProgress } from '@material-ui/core'
import React, { useState } from 'react'
import Controls from "./../../controls/Controls"
import Notification from './../../controls/Notification'
import db from "./../../config/firebase"
import { Form, useForm } from "./../../utils/useForm"
import { useProgress } from "./../../utils/useProgress"
import firebase, { auth } from "firebase"
import { useHistory } from "react-router-dom"


const useStyles = makeStyles({

    padding: {
        padding: "20px",
    },
    margin: {
        margin: "8px",
    },

    gridContainer: {
        height: "90vh"
    }


})
const Signup = () => {
    const history = useHistory()
    const initialValue = {
        fname: '',
        lname: '',
        email: '',
        number: '',
        password: ''
    }
    const { input, setInput, handleInput, error, setError } = useForm(initialValue)
    const { progressForm, setProgressForm } = useProgress()
    const [emailExist, setEmailExist] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })



    const validate = () => {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const temp = {}
        temp.fname = (input.fname) ? '' : 'Please enter firt name'
        temp.lname = (input.lname) ? '' : 'Please enter last name'

        temp.email = (input.email) ? (regEx.test(input.email)) ? '' : 'Enter valid email address' : 'Enter email address'

        temp.number = (input.number) ? (input.number.length == 10) ? '' : 'Number should be 10 digit' : 'Please enter number'
        temp.password = (input.password) ? (input.password.length > 5) ? '' : 'Password should be minimun 6 character' : 'Please enter password'

        setError({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            setProgressForm(true)
            auth().createUserWithEmailAndPassword(input.email, input.password)
                .then(user => {


                    const currentUser = auth().currentUser

                    currentUser.updateProfile({
                        displayName: `${input.fname} ${input.lname}`
                    }).then(() => {
                        const _user = {
                            uid: user.user.uid,
                            first_name: input.fname,
                            last_name: input.lname,
                            email: input.email,
                            number: input.number,
                            created_at: firebase.firestore.FieldValue.serverTimestamp()
                        }
                        db.collection("users").doc(user.user.uid).set(_user).then(user => {
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


                })
                .catch(error => {
                    setEmailExist(true)
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
            <Grid className={`${classes.gridContainer} ${classes.padding}`} container justify="center" alignItems="center" >
                <Grid item container xs={12} sm={8} md={4}>
                    <Paper className={classes.padding} elevation={3}>

                        <Form onSubmit={handleSubmit}>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6}>

                                    <Controls.Input
                                        error={error.fname}
                                        onChange={handleInput}
                                        label="First Name" value={input.fname} name="fname" />

                                </Grid>
                                <Grid item xs={12} sm={6}>

                                    <Controls.Input
                                        error={error.lname}
                                        onChange={handleInput}
                                        label="last Name" value={input.lname} name="lname" />

                                </Grid>

                                <Grid item xs={12}>
                                    <Controls.Input
                                        error={emailExist ? 'Email already exist' : error.email}
                                        onChange={handleInput}
                                        label="Email" value={input.email} name="email" />

                                </Grid>

                                <Grid item xs={12}>
                                    <Controls.Input
                                        error={error.number}
                                        onChange={handleInput}
                                        label="Number" value={input.number} name="number" />

                                </Grid>

                                <Grid item xs={12}>
                                    <Controls.Input
                                        error={error.password}
                                        onChange={handleInput}
                                        type="password" label="Password" value={input.password} name="password" />

                                </Grid>
                                <Grid item xs={12}>
                                    <Controls.Button
                                        disabled={progressForm}
                                        type="submit"
                                        label="Signup"
                                    />
                                </Grid>
                            </Grid>
                        </Form>

                    </Paper>
                </Grid>
            </Grid >

            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>


    )
}

export default Signup
