import { Paper, makeStyles, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Controls from "../../controls/Controls"
import { Form, useForm } from "../../utils/useForm"
import Notification from "../../controls/Notification"
import { useProgress } from "../../utils/useProgress"
// here style 
import db from "../../config/firebase"
import firebase from "firebase"
import PageHeader from '../utility/PageHeader'
const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },
    btn: {
        marginRight: theme.spacing(1)
    },
    typography: {
        margin: theme.spacing(2)

    }
}))


const AddCustomer = () => {

    const initialValue = {
        fname: '',
        lname: '',
        mobile: null,
        device: '',
        address: '',
        date: new Date(),
        problem: '',
        notes: ''
    }

    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const [devices, setDevices] = useState([])
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const { progressForm, setProgressForm } = useProgress()

    useEffect(() => {


        if (firebase.auth().currentUser) {
            db.collection('devices')
                .where('user', '==', firebase.auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setDevices(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                title: doc.data().device
                            }
                        ))
                    )
                ))
        }



    }, [firebase.auth().currentUser])


    const validate = () => {
        const regEx_number = /^[0-9]/
        const regEx_char = /^[a-zA-Z]/
        const temp = {}

        temp.fname = (input.fname) ? (regEx_char.test(input.fname)) ? '' : 'Enter valid input' : 'Enter first name'
        temp.lname = (input.lname) ? (regEx_char.test(input.lname)) ? '' : 'Enter valid input' : 'Enter last name'
        temp.mobile = (input.mobile) ? (input.mobile.length == 10) ? (regEx_number.test(input.mobile)) ? '' : 'Enter valid number' : 'Mobile should be 10 digit' : 'Enter mobile number'
        temp.device = (input.device) ? '' : 'Select device'
        temp.address = (input.address) ? '' : 'Enter address'
        temp.problem = (input.problem) ? '' : 'Enter problem'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(input.date.getDate())
        if (validate()) {
            setProgressForm(true)
            db.collection("customers").add({
                fname: input.fname,
                lname: input.lname,
                mobile: input.mobile,
                device: input.device,
                address: input.address,
                date: input.date,
                problem: input.problem,
                notes: input.notes,
                delivered: false,
                status: 'Pending',
                paid_value: 0,
                return_date: '',
                user: firebase.auth().currentUser.uid
            })
                .then(customer => {
                    setNotify({
                        isOpen: true,
                        message: "Customer added successfully !",
                        type: 'success'
                    })
                    setInput(initialValue)
                    setProgressForm(false)
                })
                .catch(error => {
                    setNotify({
                        isOpen: true,
                        message: "Customer added failed !",
                        type: 'error'
                    })
                    setProgressForm(false)
                })

            setInput(initialValue)
        }
    }




    const classes = useStyles()
    return (

        <Paper className={classes.paper}>
            <PageHeader title="Add Customer" />
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container item xs={12} spacing={2}>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                error={error.fname}
                                label="First Name"
                                name="fname"
                                value={input.fname}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                error={error.lname}
                                label="Last Name"
                                name="lname"
                                value={input.lname}
                                onChange={handleInput}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                error={error.mobile}
                                label="Mobile number"
                                name="mobile"
                                value={input.mobile}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                error={error.address}
                                label="Address"
                                name="address"
                                value={input.address}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Select
                                error={error.device}
                                label="Device"
                                name="device"
                                value={input.device}
                                onChange={handleInput}
                                options={devices}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                error={error.problem}
                                label="Problem"
                                name="problem"
                                value={input.problem}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.Input
                                label="Notes (optional)"
                                name="notes"
                                value={input.notes}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controls.DatePicker
                                error={error.date}
                                label="Date"
                                name="date"
                                value={input.date}
                                onChange={handleInput}
                            />
                        </Grid>





                        <Grid item xs={12}>
                            <Controls.Button
                                className={classes.btn}
                                label="Submit"
                                type="submit"
                                disabled={progressForm}
                            />
                            <Controls.Button
                                label="Reset"
                                onClick={e => setInput(initialValue)}
                                variant="text"
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

export default AddCustomer
