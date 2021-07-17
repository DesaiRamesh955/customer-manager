import { Paper, makeStyles, Box, Typography, Grid } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import Controls from "./../../controls/Controls"

const useStyles = makeStyles(theme => ({
    root: {
        mihnHeight: '100%',
        padding: theme.spacing(2)
    },
    typography: {
        fontWeight: '900',
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
        fontSize: theme.spacing(20)
    }
}))

const PageNotfound = () => {
    const classes = useStyles()
    return (
        <Box height="100%">
            <Paper className={classes.root}>
                <Grid container justify="center" direction="column" alignItems="center">
                    <Typography className={classes.typography} variant="h1" color="textSecondary">
                        404
                    </Typography>
                    <Controls.Button
                        type="button"
                        variant='contained'
                        color="secondary"
                        label={<Link style={{ textDecoration: "none", color: '#fff' }} className={classes.text} to="/">Go to home </Link>}
                    />
                </Grid>
            </Paper>
        </Box>
    )
}

export default PageNotfound
