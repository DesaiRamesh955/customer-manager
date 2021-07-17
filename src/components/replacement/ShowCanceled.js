import React from 'react'
import PageHeader from '../utility/PageHeader'
import ShowProducts from './ShowProducts'
const ShowCanceled = () => {
    return (
        <div>
            <div>
                <PageHeader title="Canceled Replacement" />
                <ShowProducts type="Canceled" />
            </div>
        </div>
    )
}

export default ShowCanceled
