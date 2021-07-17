import React from 'react'
import PageHeader from '../utility/PageHeader'
import ShowProducts from './ShowProducts'
const ShowPendingReplace = () => {


    return (
        <div>
            <PageHeader title="Pending Replacement" />
            <ShowProducts type="Pending" />
        </div>
    )
}

export default ShowPendingReplace
