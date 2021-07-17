import { makeStyles, TextField } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    }
}))

const Input = ({ label, value, onChange, name, error = null, variant, ...other }) => {



    const classes = useStyles()
    return (
        <TextField
            className={classes.root}
            onChange={onChange}
            label={label}
            value={value}
            name={name}
            variant={variant || "outlined"}
            {...(error && { error: true, helperText: error })}
            {...other}
        />
    )
}

export default Input
