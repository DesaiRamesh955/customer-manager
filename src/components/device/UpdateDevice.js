import React, { useEffect } from 'react'
import { Form, useForm } from "./../../utils/useForm"
import Controls from "../../controls/Controls"
import db from "../../config/firebase"
import firebase from "firebase"
import { useProgress } from "./../../utils/useProgress"

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
const UpdateDevice = ({ deviceID, setDialog, setNotify }) => {

    const initialValue = {
        device: deviceID.title
    }
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)

    const { progressForm, setProgressForm } = useProgress()


    useEffect(() => {


        db.collection('devices')
            .doc(deviceID.id)
            .get()
            .then(snapshopt => {
                setInput({
                    device: snapshopt.data().device
                })
            })

    }, [])



    const validate = () => {
        const temp = {}
        temp.device = (input.device) ? '' : 'Enter device name'

        setError({
            ...temp
        })

        return Object.values(temp).every(x => x == '')
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setProgressForm(true)
            db.collection('devices').doc(deviceID.id)
                .set({
                    device: input.device,
                    updateAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
                .then(() => {
                    setProgressForm(false)
                    setNotify({
                        isOpen: true,
                        message: 'Device update successfully !!',
                        type: 'success'
                    })
                    setDialog({
                        isOpen: false
                    })
                }).catch(error => {
                    setProgressForm(false)
                    setNotify({
                        isOpen: true,
                        message: 'Device update failed !!',
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
                    <Grid container alignItems="center" item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <Controls.Input
                                error={error.device}
                                label="Device name"
                                name="device"
                                value={input.device}
                                onChange={handleInput}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controls.Button
                                className={classes.btn}
                                label="Update"
                                type="submit"
                                startIcon={<UpdateIcon />}
                                disabled={progressForm}
                            />
                            <Controls.Button
                                className={classes.btn}
                                label="Clear"
                                type="button"
                                variant="text"
                                disabled={progressForm}
                                onClick={() => setInput(initialValue)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Form>

        </>
    )
}

export default UpdateDevice
