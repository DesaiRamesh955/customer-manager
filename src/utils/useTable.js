import { Table as MuiTable, TableRow, TableCell, TableHead, makeStyles, TablePagination, TableContainer, Paper } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles(theme => ({
    tablePaper: {
        width: '100%',
        '&::-webkit-scrollbar': {
            width: '1em',
            border: 'none'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.light,
            borderRadius: '20px'
        }
    },
    table: {
        marginTop: theme.spacing(2),
        '& thead th': {
            fontWeight: '600',
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary,
            minWidth: '120px'
        },
        '& tbody td': {
            fontWeight: '300',
            minWidth: '135px'
        }
    }
}))


export function useTable(records, headCells) {
    const [searchQuery, setSearchQuery] = useState({ field: '', value: '' })
    const pages = [5, 10, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])

    const columns = headCells.length

    const classes = useStyles()
    const Table = props => {
        return (
            <TableContainer className={classes.tablePaper}>
                <MuiTable className={classes.table} size="small">
                    {props.children}
                </MuiTable>
            </TableContainer>

        )
    }

    const Tblhead = () => {
        return (
            <TableHead>
                <TableRow>
                    {
                        headCells.map(cell => (
                            <TableCell key={cell.id} align='center'>
                                {cell.label}
                            </TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
        )
    }

    const Tblpagination = () => {

        const handleChangePage = (event, newPage) => {
            setPage(newPage)
        }

        const handleChangeRowsPage = (e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
        }
        return (
            <TablePagination
                component="div"
                rowsPerPageOptions={pages}
                count={records.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPage}
            />
        )
    }
    const recordsAfterPaging = () => {
        return searchQuery.value && searchQuery.field ? records.filter(x => x[searchQuery.field].toLowerCase().includes(searchQuery.value.toLowerCase())) : records.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }



    const EmptyRows = () => {
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, records.length - page * rowsPerPage)
        return (
            <>
                {
                    (emptyRows > 0) ? <TableRow style={{ height: 51 * emptyRows }}>
                        <TableCell colSpan={columns} />
                    </TableRow> : ''
                }
            </>
        )
    }
    return {
        Table,
        Tblhead,
        Tblpagination,
        recordsAfterPaging,
        EmptyRows,
        setSearchQuery,
        searchQuery
    }

}

export default useTable
