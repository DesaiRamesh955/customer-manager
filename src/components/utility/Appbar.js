import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import Controls from "../../controls/Controls"
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    text: {
        color: '#fff',
        textDecoration: "none"
    }
}));


function Appbar() {



    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Customer Manager
          </Typography>
                <Controls.Button variant color="inherit" label={<Link className={classes.text} to="/">Signin</Link>} />
                <Controls.Button variant color="inherit" label={<Link className={classes.text} to="Signup">Signup</Link>} />
            </Toolbar>
        </AppBar>
    )
}

export default Appbar
