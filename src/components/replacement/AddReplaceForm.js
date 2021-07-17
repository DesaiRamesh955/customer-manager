import { Grid, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Form, useForm } from "./../../utils/useForm"
import Control from "./../../controls/Controls"
import db from "../../config/firebase"
import firebase from "firebase"
import { useProgress } from "./../../utils/useProgress"
import Notification from "./../../controls/Notification"
import { auth } from 'firebase'




const useStyles = makeStyles(theme => ({

    form: {
        marginTop: theme.spacing(2)
    },
    btn: {
        marginRight: theme.spacing(1)
    },
}))

const AddReplaceForm = () => {

    const initialValue = {
        customerName: '',
        number: '',
        serialNo: '',
        type: '',
        date: new Date(),
        device: '',
        from: '',
        to: '',
        by: '',
        status: '',

    }



    const statusOption = [
        { id: 'pending', title: "Pending" },
        { id: 'Recieved', title: "Recieved" },
        { id: 'canceled', title: "Canceled" },
        { id: 'return', title: "Return" },
    ]
    const typeOptions = [
        { id: "return", title: 'Return' },
        { id: 'replace', title: 'Repalce' },
        { id: 'warranty', title: "Warranty" },
        { id: 'repair', title: "Repair" },
    ]

    const [fromOption, setFromOption] = useState([])
    const [toOption, setToOption] = useState([])
    useEffect(() => {
        if (auth().currentUser) {
            db.collection('sellers')
                .orderBy('date', 'desc')
                .where('user', '==', auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setToOption(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                title: doc.data().companyName
                            }
                        ))
                    )
                ))

            db.collection("users")
                .where('uid', '==', auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setFromOption(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                title: doc.data().companyName
                            }
                        ))
                    )
                ))
        }
    }, [auth().currentUser])

    useEffect(() => {
        setProgressForm(true)

        if (firebase.auth().currentUser) {
            setInput({
                ...input,
                by: firebase.auth().currentUser.displayName
            })

            db.collection('devices')
                .orderBy('created_at', 'desc')
                .where('user', '==', firebase.auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setRecords(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                title: doc.data().device
                            }
                        ))
                    )
                ))
            setProgressForm(false)
        }


    }, [firebase.auth().currentUser])
    const [records, setRecords] = useState([])
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const { progressForm, setProgressForm } = useProgress()


    const validate = () => {
        const regEx_number = /^[0-9]/
        const regEx_char = /^[a-zA-Z]/
        const temp = {}

        temp.customerName = (input.customerName) ? (regEx_char.test(input.customerName)) ? '' : 'Enter valid input' : 'Please enter name'
        temp.number = (input.number) ? (input.number.length == 10) ? (regEx_number.test(input.number)) ? '' : 'Enter valid number' : 'Mobile should be 10 digit' : 'Enter mobile number'
        temp.serialNo = (input.serialNo) ? '' : 'Please enter serial number'
        temp.type = (input.type) ? '' : 'Please select type'

        temp.device = (input.device) ? '' : 'Select device'
        temp.from = (input.from) ? '' : 'Select from or add company name in profile'
        temp.to = (input.to) ? '' : 'Select to'
        temp.status = (input.status) ? '' : 'Please select status'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }



    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)
            db.collection('warrantyDevice')
                .add({
                    ...input,
                    user: firebase.auth().currentUser.uid
                })
                .then(() => {
                    setNotify({
                        isOpen: true,
                        message: 'Product add successfully!!',
                        type: 'success'
                    })

                    setInput({
                        ...initialValue,
                        by: firebase.auth().currentUser.displayName
                    })
                    setProgressForm(false)
                })
                .catch(error => {
                    setNotify({
                        isOpen: true,
                        message: 'Product added failed!!',
                        type: 'success'
                    })
                    setProgressForm(false)
                })
        }
    }

    const classes = useStyles()
    return (
        <>
            <Form onSubmit={handleSubmit} className={classes.form} >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Input
                            error={error.customerName}
                            label="Customer name"
                            name="customerName"
                            value={input.customerName}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Input
                            error={error.number}
                            label="Mobile number"
                            name="number"
                            value={input.number}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Input
                            error={error.serialNo}
                            label="S/N (serial number)"
                            name="serialNo"
                            value={input.serialNo.toUpperCase()}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Select
                            error={error.type}
                            label="Type"
                            name="type"
                            value={input.type}
                            options={typeOptions}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.DatePicker
                            label="Date"
                            value={input.date}
                            name="date"
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Select
                            error={error.device}

                            label="Device"
                            name="device"
                            value={input.device}
                            options={records}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>

                        <Control.Select
                            error={error.from}
                            label="From"
                            name="from"
                            value={input.from}
                            options={fromOption}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Select
                            error={error.to}

                            label="To"
                            name="to"
                            value={input.to}
                            options={toOption}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Select
                            error={error.status}
                            label="Status"
                            name="status"
                            value={input.status}
                            options={statusOption}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        <Control.Input
                            label="By"
                            name="by"
                            value={input.by}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Control.Button
                            className={classes.btn}
                            label="Submit"
                            type="submit"
                            disabled={progressForm}
                        />
                        <Control.Button
                            label="Reset"
                            type="button"
                            variant="text"
                            onClick={() => setInput(initialValue)}
                            disabled={progressForm}
                        />
                    </Grid>
                </Grid>
            </Form>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}

export default AddReplaceForm
