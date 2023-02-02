import React, { useRef, useState } from 'react'
import clsx from "clsx"
import Dashboard from "./dashboard/Dashboard"
import Customer from "./customer/Customer"
import AddCustomer from "./customer/AddCustomer"
import PageNotfound from "./utility/PageNotfound"
import Addreplace from "./replacement/Addreplace"
import Notification from "./../controls/Notification"
import ManageSeller from "./seller/ManageSeller"
import ManageAccount from "./account/ManageAccount"
import SidebarOption from "./utility/SidebarOption"
import AddDevice from './device/AddDevice'
import Controls from "./../controls/Controls"
import ManageReplace from './replacement/MangeReplace'

import { Route, useHistory, Switch, Link } from "react-router-dom"
import { userAction } from "./../Datalayer/actionTypes"
import { useStateValue } from "./../Datalayer/StateProvider"
import { Divider, IconButton, Typography, CssBaseline, AppBar, Toolbar, Grid, SwipeableDrawer, LinearProgress, Avatar, Paper, Button } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useProgress } from "./../utils/useProgress"
// material ui icons start
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from "@material-ui/icons/Menu";
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
// material ui icons end
import { auth } from 'firebase'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { deepOrange } from '@material-ui/core/colors'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({


    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.down("sm")]: {
            width: '100%'
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        [theme.breakpoints.up("sm")]: {
            marginLeft: 0,
            width: `calc(100% - ${drawerWidth})`
        },
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
        [theme.breakpoints.down("sm")]: {
            marginLeft: 0
        }
    },
    paper: {
        padding: theme.spacing(2)
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[200]),
        backgroundColor: deepOrange[200],
    },
    settingCard: {
        position: 'absolute',
        top: 55,
        right: -10,
        width: "300px",
        height: "400px",
        display: "none"
    },
    active: {
        display: "block!important"
    },
    gridRoot: {
        "&.MuiGrid-item": {
            marginBottom: theme.spacing(2),
        }
    },
    avatar: {
        cursor: "pointer"
    },
    avatar2: {
        width: "60px",
        height: "60px"
    },
    text: {
        color: theme.palette.primary.main,
        textDecoration: "none"
    }

}));




const Home = () => {
    const history = useHistory()
    const [{ userReducer, progressReducer }, dispatch] = useStateValue()

    

    const theme = useTheme();
    const [open, setOpen] = useState((window.innerWidth <= 972) ? false : true);
    const { progressForm, setProgressForm } = useProgress()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [active, setActive] = useState(false)


    window.addEventListener('resize', () => {
        setOpen((window.innerWidth <= 972) ? false : true)
    })
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    if (!userReducer.user) {
        history.push("/")
    }

    const handleActive = (e) => {
       
            setActive(!active)  
        
    }

    const signOut = () => {
        auth().signOut()
        dispatch({
            type: userAction.SIGN_OUT
        })
        history.push("/")
    }
    const sideClick = () => {
        setOpen(false)
    }

    const classes = useStyles()
    return (
        <>
            <div className={classes.root} onClick={ () => active==true ? handleActive() : null}>
                <CssBaseline />
                <AppBar
                    color="primary"
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })
                    }
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Grid container alignItems="center" justify="space-between">
                            <Grid item xs={8}>
                                <Typography variant="h6" noWrap>
                                    Customer Manager
                            </Typography>
                            </Grid>
                            <Grid container justify="flex-end" item xs={1} style={{ position: "relative" }}>
                                {
                                    (auth().currentUser && auth().currentUser.photoURL) ?
                                        <Avatar isAvatar src={auth().currentUser.photoURL} className={classes.avatar} onClick={handleActive} />
                                        :
                                        <Avatar isAvatar className={clsx(classes.orange, classes.avatar)}  onClick={handleActive}>
                                            {auth().currentUser && `${auth().currentUser?.displayName?.split(' ')[0][0].toUpperCase()}${auth().currentUser?.displayName?.split(' ')[1][0].toUpperCase()}`}
                                        </Avatar>
                                }
                                <div className={clsx(classes.settingCard, active ? classes.active : '')}>
                                    <Paper className={classes.paper}>
                                        <Grid container className={classes.gridRoot} justify="center" alignItems="center" direction="column" spacing={2}>
                                            <Grid item>
                                                {
                                                    (auth().currentUser && auth().currentUser.photoURL) ?
                                                        <Avatar src={auth().currentUser.photoURL} className={classes.avatar2} />
                                                        :
                                                        <Avatar className={`${classes.orange} ${classes.avatar2}`}>
                                                            {auth().currentUser && `${auth().currentUser?.displayName?.split(' ')[0][0].toUpperCase()}${auth().currentUser?.displayName?.split(' ')[1][0].toUpperCase()}`}
                                                        </Avatar>

                                                }
                                            </Grid>
                                            <Grid item container justify="center" alignItems="center" direction="column">
                                                <Typography variant="h6"> {auth().currentUser && auth().currentUser?.displayName}</Typography>
                                                <Typography variant="subtitle2"> {auth().currentUser && auth().currentUser?.email}</Typography>
                                            </Grid>
                                            <Grid item container justify="center" alignItems="center" direction="column">
                                                <Controls.Button
                                                    variant="outlined"
                                                    label={<Link className={classes.text} to="/manageprofile">Manage Profile</Link>}
                                                    disableRipple
                                                    style={{ borderRadius: "30px" }}
                                                />

                                            </Grid>

                                        </Grid>
                                        <br />
                                        <Divider fullwidth />
                                        <br />
                                        <Grid container className={classes.gridRoot} justify="center" alignItems="center" direction="column" spacing={2}>
                                            <Grid item container justify="center" alignItems="center" direction="column">
                                                <Controls.Button
                                                    variant="outlined"
                                                    label="Signout"
                                                    disableRipple
                                                    onClick={signOut}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                </div>

                            </Grid>

                        </Grid>


                    </Toolbar>
                    {
                        progressReducer.progressForm ? <LinearProgress /> : ''
                    }
                </AppBar >
                <SwipeableDrawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    {/* sidebar option start   */}

                    {/* <SidebarOption
                        to="/"
                        text="Dashboard"
                        Icon={DashboardIcon}
                        sideClick={sideClick}
                    /> */}

                    <SidebarOption
                        to="/"
                        text="Customers"
                        Icon={GroupIcon}
                        sideClick={sideClick}
                    />
                    <SidebarOption
                        to="addcustomer"
                        text="Add customers"
                        Icon={GroupAddIcon}
                        sideClick={sideClick}
                    />
                    <SidebarOption
                        to="adddevice"
                        text="Add device"
                        Icon={DevicesOtherIcon}
                        sideClick={sideClick}
                    />

                    {/* sidebar option end   */}
                    <Divider />
                    <SidebarOption
                        to="managereplace"
                        text="Manage replace"
                        Icon={QueuePlayNextIcon}
                        sideClick={sideClick}
                    />
                    <Divider />
                    <SidebarOption
                        to="manageseller"
                        text="Manage seller"
                        Icon={PersonAddIcon}
                        sideClick={sideClick}
                    />
                    {/* <Divider /> */}

                    {/* <SidebarOption
                        onClick={signOut}
                        text="Logout"
                        Icon={PowerSettingsNewIcon}
                    /> */}

                </SwipeableDrawer>


                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />

                    <div className={classes.paper}>
                        <Switch>
                            {/* <Route exact path="/">
                                <Dashboard />
                            </Route> */}
                            <Route exact path="/">
                                <Customer />
                            </Route>
                            <Route exact path="/addcustomer">
                                <AddCustomer />
                            </Route>
                            <Route exact path="/adddevice">
                                <AddDevice />
                            </Route>
                            <Route exact path="/managereplace">
                                <ManageReplace />
                            </Route>
                            <Route exact path="/manageseller">
                                <ManageSeller />
                            </Route>
                            <Route exact path="/manageprofile">
                                <ManageAccount />
                            </Route>
                            <Route exact path="">
                                <PageNotfound />
                            </Route>
                        </Switch>
                    </div>

                </main>
            </div >
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}

export default Home

