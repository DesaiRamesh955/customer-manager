import React, { useEffect, useState } from 'react'
import { useTable } from "./../../utils/useTable"
import { useProgress } from "./../../utils/useProgress"
import { auth } from "firebase"
import db from "./../../config/firebase"
import { TableBody, TableCell, TableRow, Typography, makeStyles } from '@material-ui/core'
import Controls from '../../controls/Controls'
import ConfirmDialog from "./../../controls/ConfirmDialog"
import Notification from "./../../controls/Notification"
import Dialog from './../../controls/Dialog'
import moment from "moment"
// icons 

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateSeller from './UpdateSeller'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
    },
    tableRow: {
        textAlign: 'center',
        '& .MuiTableCell-root': {
            textAlign: 'center',
        }
    },


    table: {
        minWidth: 650,
    },
}))

const ShowSeller = () => {


    const headCells = [
        { id: 'sellername', label: 'Seller Name' },
        { id: 'companyname', label: 'Company Name' },
        { id: 'officenumber', label: 'Office Number' },
        { id: 'personalnumber', label: 'Personal Number' },
        { id: 'address', label: 'Address' },
        { id: 'date', label: 'Date' },
        { id: 'adction', label: 'Action' }

    ]
    const [sellers, setSellers] = useState([])
    const { progressForm, setProgressForm } = useProgress()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [seller, setSeller] = useState([])
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })
    const [dialog, setDialog] = useState({ isOpen: false, title: '' })
    useEffect(() => {
        setProgressForm(true)
        if (auth().currentUser) {
            db.collection('sellers')
                .orderBy('date', 'desc')
                .where('user', '==', auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setSellers(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                ...doc.data()
                            }
                        ))
                    )
                ))
            setProgressForm(false)
        }

    }, [auth().currentUser])

    const { Table, Tblhead, Tblpagination, recordsAfterPaging, EmptyRows } = useTable(sellers, headCells)
    const updateSeller = (data) => {
        setSeller(data)
        setDialog({
            isOpen: true,
            title: 'Seller Update',
        })
    }
    const deleteSeller = (id) => {
        db.collection('sellers').doc(id).delete()
            .then(() => {

                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false
                })
                setNotify({
                    isOpen: true,
                    message: 'Seller delete successfully !!',
                    type: 'error'
                })

            })
    }

    const classes = useStyles()
    return (
        <div>
            <Table>
                <Tblhead />
                <TableBody>
                    {

                        (recordsAfterPaging().length < 1) ? <TableRow className={classes.tableRow}>
                            <TableCell colSpan={headCells.length}> <Typography>No data found</Typography> </TableCell>
                        </TableRow> :
                            recordsAfterPaging().map(record => (
                                <TableRow key={record.id} className={classes.tableRow}>
                                    <TableCell>{record.sellername} </TableCell>
                                    <TableCell>{record.companyName}</TableCell>
                                    <TableCell>{record.officeNumber}</TableCell>
                                    <TableCell>{record.personalNumber ? record.personalNumber : '-'}</TableCell>
                                    <TableCell>{record.address}</TableCell>

                                    <TableCell>{moment(record.date.toDate()).format("D-M-YYYY")}</TableCell>

                                    <TableCell align='center'>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={() => updateSeller({ id: record.id, data: record })}
                                        >
                                            <EditIcon />
                                        </Controls.ActionButton>

                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => setConfirmDialog({
                                                isOpen: true,
                                                title: "Are you sure to delete this record ?",
                                                subtitle: "You can't undo this operation",
                                                onConfirm: () => deleteSeller(record.id)
                                            })}
                                        >
                                            <DeleteIcon />

                                        </Controls.ActionButton>
                                    </TableCell >
                                </TableRow>
                            ))
                    }

                    <EmptyRows />

                </TableBody>
            </Table>

            <Tblpagination />

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <Dialog
                dialog={dialog}
                setDialog={setDialog}
            >
                <UpdateSeller
                    seller={seller}
                    setDialog={setDialog}
                    setNotify={setNotify} />
            </Dialog>
        </div>
    )
}

export default ShowSeller
