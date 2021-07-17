import { FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core'
import React from 'react'

const Select = ({ name, label, error, value, onChange, options }) => {
    return (
        <FormControl
            variant="outlined"
            fullWidth
            {...(error && { error: true })}

        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={onChange}
            >

                <MenuItem value="">None</MenuItem>
                {
                    options.map(item => (
                        <MenuItem value={item.title} key={item.title}>{item.title}</MenuItem>
                    ))
                }
            </MuiSelect>
            {error && <FormHelperText > {error}</FormHelperText>}
        </FormControl >
    )
}

export default Select
