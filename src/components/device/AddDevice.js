import { Paper, makeStyles, Grid, Divider, TableBody, TableRow, TableCell } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Controls from "../../controls/Controls"
import { Form, useForm } from "../../utils/useForm"
import useTable from "../../utils/useTable"
import { useProgress } from "../../utils/useProgress"
import db from "../../config/firebase"
import firebase from "firebase"
import PageHeader from '../utility/PageHeader'
import UpdateDevice from "./UpdateDevice"
import Notification from "../../controls/Notification"
import ConfirmDialog from "../../controls/ConfirmDialog"
import Dialog from "../../controls/Dialog"
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '../utility/Skeleton'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },
    btn: {
        marginRight: theme.spacing(1)
    },
    typography: {
        margin: theme.spacing(1)

    },
    tableRow: {
        textAlign: 'center',
        '& .MuiTableCell-root': {
            textAlign: 'center',
        }
    }

}))

const AddDevice = () => {

    const initialValue = {
        device: ''
    }
    const headCells = [
        { id: 'devicename', label: "Device" },
        { id: 'deviceaction', label: 'Action' }
    ]

    const [records, setRecords] = useState([])
    const { input, setInput, error, setError, handleInput } = useForm(initialValue)


    const { Table, Tblhead, Tblpagination, recordsAfterPaging, EmptyRows } = useTable(records, headCells)
    const [deviceID, setDeviceID] = useState({ id: '', title: '' })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })
    const [dialog, setDialog] = useState({ isOpen: false, title: '' })
    const { progressForm, setProgressForm } = useProgress()

    useEffect(() => {
        setProgressForm(true)

        if (firebase.auth().currentUser) {


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

            db.collection('devices')
                .where('user', '==', firebase.auth().currentUser.uid)
                .where('device', '==', input.device.trim())
                .get()
                .then(snapshot => {

                    if (snapshot.docs.length > 0) {
                        setNotify({
                            isOpen: true,
                            message: "Device already exist!",
                            type: 'error'
                        })
                    } else {
                        db.collection('devices')
                            .add({
                                ...input,
                                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                                user: firebase.auth().currentUser.uid
                            })
                            .then(device => {
                                setInput(initialValue)
                                setProgressForm(false)
                                setNotify({
                                    isOpen: true,
                                    message: "Device added successfullty!",
                                    type: 'success'
                                })
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }

                    setProgressForm(false)
                })
                .catch(error => {

                })



        }
    }

    const updateDevice = (id, title) => {
        setDeviceID({
            id: id,
            title: title
        })
        setDialog({
            isOpen: true,
            title: 'Device update',
            subtitle: "can't be  undo"
        })

    }
    const deleteDevice = (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        db.collection('devices').doc(id).delete()
            .then(device => {
                setNotify({
                    isOpen: true,
                    message: 'Device delete successfully !!',
                    type: 'error'
                })
            })
    }


    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <PageHeader title="Add Device" />
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container alignItems="center" item xs={12} spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Controls.Input
                                error={error.device}
                                label="Device name"
                                name="device"
                                value={input.device}
                                onChange={handleInput}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Controls.Button
                                className={classes.btn}
                                label="Add"
                                type="submit"
                                startIcon={<AddIcon />}
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
            <Divider className={classes.typography} />
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    {progressForm ? <Skeleton type="text" count={5} size={50} /> :
                        <>
                            <Table>
                                <Tblhead />
                                <TableBody>
                                    {/* <TableRow>
                                <TableCell colSpan={2}> {recordsAfterPaging().length < 1 && <Skeleton type="text" />}</TableCell>
                            </TableRow> */}
                                    {recordsAfterPaging().map(record => (
                                        <TableRow hover key={record.id} className={classes.tableRow}>
                                            <TableCell>
                                                {record.title}
                                            </TableCell >

                                            <TableCell>
                                                <Controls.ActionButton
                                                    color="primary"
                                                    onClick={() => updateDevice(record.id, record.title)}
                                                >
                                                    <EditIcon />
                                                </Controls.ActionButton>

                                                <Controls.ActionButton
                                                    color="secondary"
                                                    onClick={() => setConfirmDialog({
                                                        isOpen: true,
                                                        title: "Are you sure to delete this record ?",
                                                        subtitle: "You can't undo this operation",
                                                        onConfirm: () => deleteDevice(record.id)
                                                    })}
                                                >
                                                    <DeleteIcon />

                                                </Controls.ActionButton>
                                            </TableCell >
                                        </TableRow>
                                    ))}

                                    <EmptyRows />


                                </TableBody>

                            </Table>
                            <Tblpagination />
                        </>
                    }
                </Grid>


            </Grid>


            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Dialog
                dialog={dialog}
                setDialog={setDialog}
            >
                <UpdateDevice
                    deviceID={deviceID}
                    setDialog={setDialog}
                    setNotify={setNotify}
                />
            </Dialog>

        </Paper >
    )
}

export default AddDevice
