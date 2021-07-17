import { Box, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
const useStyles = makeStyles(theme => ({
    typography: {
        margin: theme.spacing(2)

    }
}))
const PageHeader = ({ title }) => {


    const classes = useStyles()
    return (
        <Box borderLeft={5} borderColor="primary.main" >
            <Typography variant="h5" color="textSecondary" className={classes.typography}>
                {title}
            </Typography>
        </Box>
    )
}

export default PageHeader
