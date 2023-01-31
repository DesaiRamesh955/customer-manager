import React from 'react'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import DateFnsutils from "@date-io/date-fns"
const DatePicker = ({ name, label, value, dateVariant = null, onChange }) => {


    const convertTodateFormate = (name, value) => ({
        target: {
            name, value
        }
    })
    return (
        <MuiPickersUtilsProvider utils={DateFnsutils}>
            <KeyboardDatePicker
                fullWidth
                disableToolbar
                variant={dateVariant || "outlined"}
                inputVariant="outlined"
                label={label}
                format='dd/MM/yyyy'
                name={name}
                value={value}
                onChange={date => onChange(convertTodateFormate(name, date))}>

            </KeyboardDatePicker>
        </MuiPickersUtilsProvider >
    )
}

export default DatePicker
