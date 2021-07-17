import React, { useState, useEffect } from 'react'
import { progressAction } from "./../Datalayer/actionTypes"
import { useStateValue } from "./../Datalayer/StateProvider"
export const useProgress = () => {

    const [progressForm, setProgressForm] = useState(false)
    const [{ }, dispatch] = useStateValue()

    useEffect(() => {

        dispatch({
            type: progressAction.SET_PROGRESS,
            progress: progressForm
        })
    }, [progressForm])

    return {
        progressForm,
        setProgressForm
    }

}