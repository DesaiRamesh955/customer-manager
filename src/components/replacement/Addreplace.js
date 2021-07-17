import { Divider } from '@material-ui/core'
import React from 'react'
import PageHeader from '../utility/PageHeader'
import AddReplaceForm from './AddReplaceForm'

const Addreplace = () => {


    return (
        <div>

            <PageHeader title="Add Products" />
            <Divider />
            <AddReplaceForm />

        </div>
    )
}

export default Addreplace
