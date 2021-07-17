import React from 'react'
import PageHeader from '../utility/PageHeader'
import ShowProducts from './ShowProducts'
const ShowRecieved = () => {


    return (
        <div>
            <PageHeader title="Recieved Replacement" />
            <ShowProducts type="Recieved" />
        </div>
    )
}

export default ShowRecieved
