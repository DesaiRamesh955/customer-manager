import React from 'react'
import PageHeader from '../utility/PageHeader'
import ShowProducts from './ShowProducts'
const ShowReturn = () => {
    return (
        <div>
            <div>
                <PageHeader title="Return Replacement" />
                <ShowProducts type="Return" />
            </div>
        </div>
    )
}

export default ShowReturn
