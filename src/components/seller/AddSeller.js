import { Grid, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { Form, useForm } from "../../utils/useForm"
import Notification from "../../controls/Notification"
import Controls from "../../controls/Controls"
import { useProgress } from "../../utils/useProgress"

import db from "../../config/firebase"
import firebase from "firebase"


// icons 

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({

    btn: {
        marginRight: theme.spacing(1)
    }
}))
const AddSeller = () => {

    const initialValue = {
        sellername: '',
        companyName: '',
        officeNumber: '',
        personalNumber: '',
        address: '',
        date: new Date()
    }
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const { progressForm, setProgressForm } = useProgress()

    const validate = () => {
        const regEx_number = /^[0-9]/
        const regEx_char = /^[a-zA-Z]/
        const temp = {}

        temp.sellername = (input.sellername) ? (regEx_char.test(input.sellername)) ? '' : 'Enter valid input' : 'Enter seller name'
        temp.companyName = (input.companyName) ? (regEx_char.test(input.companyName)) ? '' : 'Enter valid input' : 'Enter company name'

        temp.officeNumber = (input.officeNumber) ? (regEx_number.test(input.officeNumber)) ? '' : 'Enter valid number' : 'Enter office number'
        temp.personalNumber = (input.personalNumber != '') ? (input.personalNumber.length == 10) ? (regEx_number.test(input.personalNumber)) ? '' : 'Enter valid number' : 'Mobile should be 10 digit' : ''
        temp.address = (input.address) ? '' : 'Enter address'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            setProgressForm(true)
            db.collection('sellers')
                .add({
                    ...input,
                    user: firebase.auth().currentUser.uid
                })
                .then(seller => {
                    setNotify({
                        isOpen: true,
                        message: "Seller added successfully !",
                        type: 'success'
                    })
                    setInput(initialValue)
                    setProgressForm(false)
                })
                .catch(error => {
                    setNotify({
                        isOpen: true,
                        message: "Seller added failed !",
                        type: 'error'
                    })
                    setProgressForm(false)
                })
        }
    }

    const classes = useStyles()
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Controls.Input
                            error={error.sellername}
                            label="Seller Name"
                            name="sellername"
                            value={input.sellername}
                            onChange={handleInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Controls.Input
                            error={error.companyName}
                            label="Company/Firm Name"
                            name="companyName"
                            value={input.companyName}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Controls.Input
                            error={error.officeNumber}
                            label="Office number"
                            name="officeNumber"
                            value={input.officeNumber}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Controls.Input
                            error={error.personalNumber}
                            label="Personal number (optional)"
                            name="personalNumber"
                            value={input.personalNumber}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Controls.Input
                            error={error.address}
                            label="Address"
                            name="address"
                            value={input.address}
                            onChange={handleInput}
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <Controls.Button
                            className={classes.btn}
                            label="Add"
                            type="submit"
                            startIcon={<AddIcon />}
                            disabled={progressForm}
                        />
                        <Controls.Button
                            className={classes.btn}
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

export default AddSeller
