import React from 'react'
import { Button as Muibutton } from "@material-ui/core"
const Button = ({ color, variant, onClick, label, ...other }) => {
    return (
        <Muibutton
            color={color || "primary"}
            variant={variant || "contained"}
            onClick={onClick}
            {...other}
        >{label}</Muibutton>
    )
}

export default Button
