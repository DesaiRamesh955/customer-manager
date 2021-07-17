import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core'
import React from 'react'

function CheckBox({ name, label, color = null, value, onChange }) {


    const convertToCheckbox = (name, value) => ({
        target: {
            name, value
        }
    })




    return (
        <FormControl>
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color={color || "primary"}
                    checked={value}
                    onChange={e => onChange(convertToCheckbox(name, e.target.checked))}
                />}

                label={label}
            />

        </FormControl>
    )
}

export default CheckBox
