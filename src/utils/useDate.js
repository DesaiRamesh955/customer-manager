const useDate = () => {


    const converDate = (date) => {

        if (date) {

            date = date.toDate()
            let newDay = date.getDate()
            let month = date.getMonth()
            let fullYear = date.getFullYear()


            newDay = (newDay < 10) ? `0${newDay}` : newDay
            month = (month < 10) ? `0${month}` : month

            const newDate = `${newDay}-${month}-${fullYear}`
            return newDate
        }


    }

    return { converDate }
}

export default useDate
