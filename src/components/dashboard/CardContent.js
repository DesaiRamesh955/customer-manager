import { Card } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(1)
    }
}))

function CardContent() {

    const classes = useStyles()
    return (
        <Card className={classes.card}>
            hello
        </Card>
    )
}

export default CardContent
