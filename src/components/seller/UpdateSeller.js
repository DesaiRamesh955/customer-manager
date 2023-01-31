import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import { Form, useForm } from "../../utils/useForm"
import Controls from "../../controls/Controls"
import { useProgress } from "../../utils/useProgress"

import db from "../../config/firebase"


// icons 

import UpdateIcon from '@material-ui/icons/Update';


const useStyles = makeStyles(theme => ({

    btn: {
        marginRight: theme.spacing(1)
    }
}))
const UpdateSeller = ({ seller, setNotify, setDialog }) => {

    const initialValue = {
        sellername: seller.data.sellername,
        companyName: seller.data.companyName,
        officeNumber: seller.data.officeNumber,
        personalNumber: seller.data.personalNumber,
        address: seller.data.address
    }
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)
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
            db.collection('sellers').doc(seller.id)
                .set({
                    ...input,
                    update_at: new Date()
                }, { merge: true })
                .then(() => {
                    setNotify({
                        isOpen: true,
                        message: "Seller updated successfully !",
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
                        message: "Seller updated failed !",
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
                    <Grid item xs={12} md={6}>
                        <Controls.Input
                            error={error.sellername}
                            label="Seller Name"
                            name="sellername"
                            value={input.sellername}
                            onChange={handleInput}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controls.Input
                            error={error.companyName}
                            label="Company/Firm Name"
                            name="companyName"
                            value={input.companyName}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controls.Input
                            error={error.officeNumber}
                            label="Office number"
                            name="officeNumber"
                            value={input.officeNumber}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controls.Input
                            error={error.personalNumber}
                            label="Personal number (optional)"
                            name="personalNumber"
                            value={input.personalNumber}
                            onChange={handleInput}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                            label="update"
                            type="submit"
                            startIcon={<UpdateIcon />}
                            disabled={progressForm}
                        />

                    </Grid>
                </Grid>
            </Form>

        </>
    )
}

export default UpdateSeller
