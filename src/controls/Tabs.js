import React from 'react'
import { makeStyles, Tabs as MuiTabs, Tab, Box } from '@material-ui/core'



const useStyles = makeStyles(theme => ({
    tabs: {
        borderBottom: `1px solid ${theme.palette.primary.light}`
    }
}))


export const Tabs = ({ items, indicatorColor = null, textColor = null, selectedTab, setSelectedTab, children, ...other }) => {




    const classes = useStyles()
    return (
        <MuiTabs
            scrollButtons="on"
            className={classes.tabs}
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            indicatorColor={indicatorColor || 'primary'}
            textColor={textColor || 'primary'}
            {...other}
        >
            {items.map(item => (
                <Tab label={item.title} />
            ))}
        </MuiTabs >
    )
}


export const TabPanel = (props) => {
    const { children, value, index, component, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {component}
                </Box>
            )}
        </div>
    );
}


