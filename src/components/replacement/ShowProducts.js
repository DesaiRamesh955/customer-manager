import React, { useEffect, useState } from 'react'
import { useStateValue } from "./../../Datalayer/StateProvider"
import useTable from "../../utils/useTable"
import Skeleton from '../utility/Skeleton'
import { makeStyles, TableBody, TableCell, TableRow, Typography } from '@material-ui/core'
import { useProgress } from "../../utils/useProgress"
import Controls from '../../controls/Controls'
import ConfirmDialog from "./../../controls/ConfirmDialog"
import Notification from "./../../controls/Notification"
import Dialog from "./../../controls/Dialog"
import db from "./../../config/firebase"

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import moment from "moment"
import UpdateProducts from './UpdateProducts'
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
const ShowProducts = ({ type }) => {
    const headCells = [
        { id: 'customerName', label: "Customer Name" },
        { id: 'mobile', label: 'Mobile' },
        { id: 'sn', label: 'Serial Number' },
        { id: 'type', label: 'type' },
        { id: 'date', label: 'Date' },
        { id: 'device', label: 'Device' },
        { id: 'to', label: 'To' },
        { id: 'by', label: 'By' },
        { id: 'action', label: 'Action' },
    ]


    const [{ deviceReducer }] = useStateValue()
    const [products, setProducts] = useState([])
    const { Table, Tblhead, Tblpagination, recordsAfterPaging, EmptyRows } = useTable(products, headCells)
    const { progressForm, setProgressForm } = useProgress()
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [dialog, setDialog] = useState({ isOpen: false, title: '' })
    const [product, setProduct] = useState(null)
    useEffect(() => {
        setProducts(
            deviceReducer.products.filter(p => p.status == type)
        )

    }, [deviceReducer.products])

    const updateDevice = (data) => {
        setProduct(data)
        setDialog({
            isOpen: true,
            title: 'Seller Update',
        })
    }
    const deleteDevice = (id) => {

        db.collection('warrantyDevice').doc(id).delete()
            .then(() => {

                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false
                })
                setNotify({
                    isOpen: true,
                    message: 'Product Deleted successfully !!',
                    type: 'error'
                })

            })


    }
    const classes = useStyles()

    return (
        <>

            <Table>
                <Tblhead />
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={9}> {recordsAfterPaging().length < 1 && <Typography variant="subtitle2" align="center">No data found</Typography>}</TableCell>
                    </TableRow>
                    {recordsAfterPaging().map(record => (
                        <TableRow hover key={record.id} className={classes.tableRow}>
                            <TableCell>
                                {record.customerName}
                            </TableCell>
                            <TableCell>
                                {record.number}
                            </TableCell>
                            <TableCell>
                                {record.serialNo}
                            </TableCell>
                            <TableCell>
                                {record.type}
                            </TableCell>
                            <TableCell>
                                {moment(record.date.toDate()).format("D-M-YYYY")}
                            </TableCell>
                            <TableCell>
                                {record.device}
                            </TableCell>
                            <TableCell>
                                {record.to}
                            </TableCell>

                            <TableCell>
                                {record.by}
                            </TableCell>

                            <TableCell>
                                <Controls.ActionButton
                                    color="primary"
                                    onClick={() => updateDevice(record)}
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
                <UpdateProducts
                    product={product}
                    setDialog={setDialog}
                    setNotify={setNotify} />
            </Dialog>
        </>
    )
}

export default ShowProducts
