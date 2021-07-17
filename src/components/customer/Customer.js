import { Paper, makeStyles, Grid, TableBody, TableRow, TableCell, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PageHeader from './../utility/PageHeader'
import Controls from "./../../controls/Controls"
import { useForm } from "./../../utils/useForm"
import { useTable } from "./../../utils/useTable"
import ConfirmDialog from "./../../controls/ConfirmDialog"
import Notification from "./../../controls/Notification"
import Dialog from "./../../controls/Dialog"
import UpdateCustomer from './UpdateCustomer'
import Skeleton from './../utility/Skeleton'
import { useSearchFilter } from "./../../utils/SearchFilter"

import moment from "moment"
import { auth } from "firebase"
import db from "./../../config/firebase"

import { useProgress } from "./../../utils/useProgress"
// icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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


const Customer = () => {
    const [customers, setCustomers] = useState([])
    const [customersTemp, setCustomersTemp] = useState([])
    const headCells = [
        { id: 'name', label: 'Name' },
        { id: 'mobile', label: 'Mobile' },
        { id: 'device', label: 'Device' },
        { id: 'status', label: 'Status' },
        { id: 'givenDate', label: 'Date' },
        { id: 'returnDate', label: 'Return Date' },
        { id: 'problem', label: 'Problem' },
        { id: 'address', label: 'Address' },
        { id: 'notes', label: 'Notes' },
        { id: 'paid', label: 'Paid' },
        { id: 'action', label: 'Action' }


    ]

    useEffect(() => {
        setProgressForm(true)
        if (auth().currentUser) {
            db.collection('customers')
                .orderBy('date', 'desc')
                .where('user', '==', auth().currentUser.uid)
                .onSnapshot(snapshot => (
                    setCustomers(
                        snapshot.docs.map(doc => (
                            {
                                id: doc.id,
                                name: `${doc.data().fname} ${doc.data().lname}`,
                                mobile: doc.data().mobile,
                                device: doc.data().device,
                                status: doc.data().status,
                                givenDate: doc.data().date,
                                return_date: doc.data().return_date,
                                problem: doc.data().problem,
                                address: doc.data().address,
                                notes: doc.data().notes || '-',
                                paid: doc.data().paid_value
                            }
                        ))
                    )
                ))
            setProgressForm(false)
        }

    }, [auth().currentUser])



    const { Table, Tblhead, Tblpagination, recordsAfterPaging, EmptyRows, searchQuery, setSearchQuery } = useTable(customers, headCells)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const { progressForm, setProgressForm } = useProgress()
    const [dialog, setDialog] = useState({ isOpen: false, title: '' })
    const [searchType, setSearchType] = useState('')
    const [customerID, setCustomerID] = useState(null)

    const { SearchInput, setSearchText, searchText } = useSearchFilter()
    const updateCustomer = (id) => {
        setCustomerID(id)
        setDialog({
            isOpen: true,
            title: 'Update Customer',
            subtitle: "can't be  undo"
        })
    }
    const deleteCustomer = (id) => {


        db.collection('customers').doc(id).delete()
            .then(() => {

                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false
                })
                setNotify({
                    isOpen: true,
                    message: 'Customer delete successfully !!',
                    type: 'error'
                })

            })

    }
    const options = [
        { title: 'name' },
        { title: 'mobile' },
    ]
    const searchOption = [
        { title: 'textsearch' },
        { title: 'date' },
    ]
    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <PageHeader title="Customers" />
            <Grid container direction="column">
                <Grid item xs={12} md={12}>
                    <Controls.Input
                        label="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} />
                    <Typography>{searchText}</Typography>
                    {progressForm ? <Skeleton type="text" count={5} size={50} /> :
                        <>
                            <Table>
                                <Tblhead />
                                <TableBody>
                                    {

                                        (recordsAfterPaging().length < 1) ? <TableRow className={classes.tableRow}>
                                            <TableCell colSpan={headCells.length}> <Typography>No data found</Typography> </TableCell>
                                        </TableRow> :
                                            recordsAfterPaging().map(record => (
                                                <TableRow key={record.id} className={classes.tableRow}>
                                                    <TableCell>{record.name} </TableCell>
                                                    <TableCell>{record.mobile}</TableCell>
                                                    <TableCell>{record.device}</TableCell>
                                                    <TableCell>{record.status}</TableCell>
                                                    <TableCell>{moment(record?.givenDate.toDate()).format("D-M-YYYY")}</TableCell>
                                                    <TableCell>{record?.return_date ? moment(record?.return_date.toDate()).format("D-M-YYYY") : '-'}</TableCell>
                                                    <TableCell>{record.problem}</TableCell>
                                                    <TableCell>{record.address}</TableCell>
                                                    <TableCell>{record.notes}</TableCell>
                                                    <TableCell>{record.paid}</TableCell>
                                                    <TableCell align='center'>
                                                        <Controls.ActionButton
                                                            color="primary"
                                                            onClick={() => updateCustomer(record.id)}
                                                        >
                                                            <EditIcon />
                                                        </Controls.ActionButton>

                                                        <Controls.ActionButton
                                                            color="secondary"
                                                            onClick={() => setConfirmDialog({
                                                                isOpen: true,
                                                                title: "Are you sure to delete this record ?",
                                                                subtitle: "You can't undo this operation",
                                                                onConfirm: () => deleteCustomer(record.id)
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
                        </>
                    }
                </Grid>
            </Grid>
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
                <UpdateCustomer
                    id={customerID}
                    setDialog={setDialog}
                    setNotify={setNotify}
                />
            </Dialog>
        </Paper>
    )
}

export default Customer
