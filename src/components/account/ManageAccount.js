import { Grid, makeStyles, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PageHeader from "../utility/PageHeader"
import { Form, useForm } from "../../utils/useForm"
import db from "./../../config/firebase"
import { auth } from 'firebase'
import Controls from "./../../controls/Controls"
import Notification from "./../../controls/Notification"
import { useProgress } from "../../utils/useProgress"
import useAccount from "./useAccount"
import { SettingsInputSvideoTwoTone } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}))
const ManageAccount = () => {




    const {saveUserData,getUserData} = useAccount({auth,db})

    
    const initialValue = {
        firstName: '',
        lastName: '',
        number: '',
        companyName: ''
    }
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const { input, setInput, error, setError, handleInput,handleValidate } = useForm(initialValue)
    const { progressForm, setProgressForm } = useProgress()
    const [user, setUser] = useState()

    useEffect(() => {
        setProgressForm(true)

        if (auth().currentUser) {
           getUserData().then(res =>{
            setUser(res.data())
           })
        }
        setProgressForm(false)

    }, [auth().currentUser])


    useEffect(() => {

        let isRepeated = false

        if(!isRepeated){
            if (user) {
                setInput({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    number: user.number,
                    companyName: user.companyName
                })
            }
        }
        return () =>{
            isRepeated = true
        }
    }, [user])


    const validate = () => {
        const regEx_number = /^[0-9]/
        const regEx_char = /^[a-zA-Z]/
        const temp = {}
        temp.firstName = (input.firstName) ? (regEx_char.test(input.firstName)) ? '' : 'Enter valid input' : 'Enter first name'
        temp.lastName = (input.lastName) ? (regEx_char.test(input.lastName)) ? '' : 'Enter valid input' : 'Enter last name'
        temp.number = (input.number) ? (input.number.length == 10) ? (regEx_number.test(input.number)) ? '' : 'Enter valid number' : 'Mobile should be 10 digit' : 'Enter mobile number'
        temp.companyName = (input.companyName) ? '' : 'Enter Company name'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == '')
    }

    const handleSubmit = (e) => {

        e.preventDefault()
 
    

        if (validate()) {
            setProgressForm(true)
            saveUserData(input).then(() => {
                setNotify({
                    isOpen: true,
                    message: 'Profile Updated successfullt !!',
                    type: 'success'
                })
            })
            .catch(err => {
                setNotify({
                    isOpen: true,
                    message: 'Profile Updated faield !!',
                    type: 'error'
                })
               
            })
        }
        setProgressForm(false)
    }



    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <PageHeader title="Edit Profile" />
            <Form onSubmit={handleSubmit}>
                <Grid container justify="center" alignItems="center">
                    <Grid container xs={12} md={6} spacing={2} >
                        <Grid item xs={12} md={6}>
                            <Controls.Input
                                error={error.firstName}
                                label="First Name"
                                value={input.firstName}
                                name="firstName"
                                onChange={handleInput}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controls.Input
                                error={error.lastName}

                                label="Last Name"
                                value={input.lastName}
                                name="lastName"
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controls.Input
                                error={error.number}
                                label="Mobile Number"
                                value={input.number}
                                name="number"
                                onChange={handleInput}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controls.Input
                                error={error.companyName}

                                label="Company Name"
                                value={input.companyName}
                                name="companyName"
                                onChange={handleInput}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controls.Button
                                label="Update"
                                type="submit"
                                disabled={progressForm}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </Paper >
    )
}

export default ManageAccount
