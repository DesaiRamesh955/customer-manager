import React, { useState } from 'react'

export const useForm = (initialValue) => {

    const [input, setInput] = useState(initialValue)
    const [error, setError] = useState({})
    const handleInput = (e) => {

        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }

    return {
        input,
        setInput,
        error,
        setError,
        handleInput
    }

}

export const Form = ({ onSubmit, children, ...other }) => {
    return (
        <form autoComplete="off" onSubmit={onSubmit} {...other}>
            {children}
        </form>
    )
}

