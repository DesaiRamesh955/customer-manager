import React, { useEffect, useState } from 'react'
import { Form, useForm } from "../../utils/useForm"
import Controls from "../../controls/Controls"
import db from "../../config/firebase"
import firebase from "firebase"
import { useProgress } from "../../utils/useProgress"
import moment from "moment"
import { makeStyles, Grid } from '@material-ui/core'
import UpdateIcon from '@material-ui/icons/Update';


const useStyles = makeStyles(theme => ({
    btn: {
        marginRight: theme.spacing(1)
    },
    typography: {
        margin: theme.spacing(1)

    }

}))
const UpdateCustomer = ({ id, setDialog, setNotify }) => {

    const STATUS = [
        { id: 'pending', title: 'Pending' },
        { id: 'complete', title: 'Complete' },
        { id: 'calceled', title: 'Canceled' },
    ]
    const initialValue = {
        fname: '',
        lname: '',
        mobile: '',
        device: '',
        address: '',
        date: new Date(),
        problem: '',
        notes: '',
        paid_value: 0,
        status: '',
        deliverd: false

    }
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const [devices, setDevices] = useState([])
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

    useEffect(() => {


        db.collection('customers')
            .doc(id)
            .get()
            .then(snapshopt => {
                setInput({
                    fname: snapshopt.data().fname,
                    lname: snapshopt.data().lname,
                    mobile: snapshopt.data().mobile,
                    device: snapshopt.data().device,
                    address: snapshopt.data().address,
                    date: moment(snapshopt.data().date.toDate()), //firebase.firestore.Timestamp.fromDate(nsnapshopt.data().date.toDate())
                    problem: snapshopt.data().problem,
                    notes: snapshopt.data().notes,
                    paid_value: snapshopt.data().paid_value,
                    status: snapshopt.data().status,
                    delivered: snapshopt.data().delivered
                })
            })

    }, [])


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
        temp.paid = (input.paid_value) ? (input.paid_value.length > 0 && regEx_number.test(input.paid_value)) ? '' : 'Enter valid amount' : 'Enter paid amount'
        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }



    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)

            db.collection('customers').doc(id)
                .set({
                    fname: input.fname,
                    lname: input.lname,
                    mobile: input.mobile,
                    device: input.device,
                    address: input.address,
                    date: input.date.toDate(),
                    problem: input.problem,
                    notes: input.notes,
                    paid_value: input.paid_value,
                    return_date: input.deliverd ? new Date() : null,
                    status: input.status,
                    delivered: input.delivered,
                    updateAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
                .then(() => {
                    setProgressForm(false)
                    setNotify({
                        isOpen: true,
                        message: 'Customer update successfully !!',
                        type: 'success'
                    })
                    setDialog({
                        isOpen: false
                    })
                }).catch(error => {
                    setProgressForm(false)
                    setNotify({
                        isOpen: true,
                        message: 'Customer update failed !!',
                        type: 'error'
                    })
                })
        }
    }
    const classes = useStyles()

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container item xs={12} spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.fname}
                                label="First Name"
                                name="fname"
                                value={input.fname}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.lname}
                                label="Last Name"
                                name="lname"
                                value={input.lname}
                                onChange={handleInput}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.mobile}
                                label="Mobile number"
                                name="mobile"
                                value={input.mobile}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.address}
                                label="Address"
                                name="address"
                                value={input.address}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.Select
                                error={error.device}
                                label="Device"
                                name="device"
                                value={input.device}
                                onChange={handleInput}
                                options={devices}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.problem}
                                label="Problem"
                                name="problem"
                                value={input.problem}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                label="Notes (optional)"
                                name="notes"
                                value={input.notes}
                                onChange={handleInput}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.DatePicker
                                error={error.date}
                                label="Date"
                                name="date"
                                value={input.date}
                                onChange={handleInput}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controls.Input
                                error={error.paid}
                                label="Paid"
                                value={input.paid_value}
                                name="paid_value"
                                onChange={handleInput}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <Controls.Select
                                label="Status"
                                name="status"
                                value={input.status}
                                onChange={handleInput}
                                options={STATUS}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controls.CheckBox
                                label="Deliverd"
                                name="deliverd"
                                value={input.deliverd}
                                onChange={handleInput}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Controls.Button
                                className={classes.btn}
                                label="Update"
                                startIcon={<UpdateIcon />}
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

        </>
    )
}

export default UpdateCustomer
