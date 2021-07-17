import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import React from 'react'
import { useHistory } from "react-router-dom"

function SidebarOption({ text, Icon, to, sideClick, onClick = null }) {
    // history.push(to)
    const history = useHistory()


    const handleClick = () => {
        to && history.push(to)
        onClick && onClick()
        if (window.innerWidth <= 972) {
            sideClick && sideClick()
        }
    }
    return (
        <List onClick={handleClick}>
            <ListItem button key={text}>
                <ListItemIcon>{<Icon />}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        </List >
    )
}

export default SidebarOption
