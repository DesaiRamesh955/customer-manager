import React from 'react'
import { Button as Muibutton, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 0,
        margin: theme.spacing(0.5)
    },
    secondary: {
        backgroundColor: theme.palette.secondary.light,
        '& .MuiButton-label': {
            color: theme.palette.secondary.main
        }
    },
    primary: {
        backgroundColor: theme.palette.primary.light,
        '& .MuiButton-label': {
            color: theme.palette.primary.main
        }
    }
}))


const ActionButton = ({ color, onClick, children, ...other }) => {
    const classes = useStyles()
    return (
        <Muibutton
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}
            {...other}
        >{children}</Muibutton>
    )
}

export default ActionButton
