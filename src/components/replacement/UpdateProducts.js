import { Grid, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Form, useForm } from "../../utils/useForm"
import Control from "../../controls/Controls"
import { useProgress } from "../../utils/useProgress"

import db from "../../config/firebase"
import { auth } from "firebase"
// icons 
import UpdateIcon from '@material-ui/icons/Update';


const useStyles = makeStyles(theme => ({

    btn: {
        marginRight: theme.spacing(1)
    }
}))
const UpdateProducts = ({ product, setNotify, setDialog }) => {
    console.log(product)

    const initialValue = {
        customerName: product.customerName,
        number: product.number,
        serialNo: product.serialNo,
        type: product.type,
        date: new Date(),
        device: product.device,
        from: product.from,
        to: product.to,
        by: product.by,
        status: product.status,

    }
    const fromOption = [
        { id: 'from', title: "Dhairya" }
    ]

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
    const [records, setRecords] = useState([])

    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const { progressForm, setProgressForm } = useProgress()
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

            db.collection('devices')
                .orderBy('created_at', 'desc')
                .where('user', '==', auth().currentUser.uid)
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
        }

    }, [auth().currentUser])
    const validate = () => {
        const regEx_number = /^[0-9]/
        const regEx_char = /^[a-zA-Z]/
        const temp = {}

        temp.customerName = (input.customerName) ? (regEx_char.test(input.customerName)) ? '' : 'Enter valid input' : 'Please enter name'
        temp.number = (input.number) ? (input.number.length == 10) ? (regEx_number.test(input.number)) ? '' : 'Enter valid number' : 'Mobile should be 10 digit' : 'Enter mobile number'
        temp.serialNo = (input.serialNo) ? '' : 'Please enter serial number'
        temp.type = (input.type) ? '' : 'Please select type'

        temp.device = (input.device) ? '' : 'Select device'
        temp.from = (input.from) ? '' : 'Select where from send'
        temp.to = (input.to) ? '' : 'Select where to send'
        temp.status = (input.status) ? '' : 'Please select status'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }

    const classes = useStyles()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)
            db.collection('warrantyDevice').doc(product.id)
                .set({
                    ...input,
                    update_at: new Date()
                }, { merge: true })
                .then(() => {
                    setNotify({
                        isOpen: true,
                        message: "Product updated successfully !",
                        type: 'success'
                    })
                    setDialog({
                        isOpen: false
                    })
                    setInput(initialValue)
                    setProgressForm(false)
                })
                .catch(error => {
                    setNotify({
                        isOpen: true,
                        message: "Product updated failed !",
                        type: 'error'
                    })
                    setProgressForm(false)
                })
        }
    }

    return (
        <Form onSubmit={handleSubmit} className={classes.form} >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Control.Input
                        error={error.customerName}
                        label="Customer name"
                        name="customerName"
                        value={input.customerName}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Input
                        error={error.number}
                        label="Mobile number"
                        name="number"
                        value={input.number}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Input
                        error={error.serialNo}
                        label="S/N (serial number)"
                        name="serialNo"
                        value={input.serialNo.toUpperCase()}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Select
                        error={error.type}
                        label="Type"
                        name="type"
                        value={input.type}
                        options={typeOptions}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.DatePicker
                        label="Date"
                        value={input.date}
                        name="date"
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Select
                        error={error.device}

                        label="Device"
                        name="device"
                        value={input.device}
                        options={records}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>

                    <Control.Select
                        error={error.from}
                        label="From"
                        name="from"
                        value={input.from}
                        options={fromOption}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Select
                        error={error.to}

                        label="To"
                        name="to"
                        value={input.to}
                        options={toOption}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Control.Select
                        error={error.status}
                        label="Status"
                        name="status"
                        value={input.status}
                        options={statusOption}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
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
                        label="Update"
                        type="submit"
                        startIcon={<UpdateIcon />}
                        disabled={progressForm}
                    />

                </Grid>
            </Grid>
        </Form>
    )
}

export default UpdateProducts
