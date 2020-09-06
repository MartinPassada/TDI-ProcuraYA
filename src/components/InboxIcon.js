import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import ForumIcon from '@material-ui/icons/Forum';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Avatar from '@material-ui/core/Avatar';
//Material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


const MySwal = withReactContent(Swal);
const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    onAfterClose: () => { }
})
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'ruby-text-container;',
        alignSelf: 'baseline',
        '& > *': {
            marginBottom: theme.spacing(2),
        },
        '& .MuiBadge-root': {
            marginRight: theme.spacing(4),
        },
    },
    icon: {
        color: '#fff',
        zIndex: 1,
    },
    avatar: {
        width: 30,
        height: 30,

    },

}));

export default function InboxIcon(props) {
    const classes = useStyles();
    const [count, setCount] = React.useState(0);
    const [Inbox, setInbox] = React.useState([]);

    useEffect(() => {
        getInboxMessages();
    }, [])

    const checkMessage = (e) => {
        MySwal.fire({
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            title: 'Mensaje',
            html: `<div style="display: block;"><img style="padding-right: 5px;" className="userImg" height="40px" src="${e.senderImg}"></img>${e.sender}</div>
                <div><p>${e.message}</p></div>`,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ea5f32',
            cancelButtonColor: '#999999',
            showCloseButton: true,
            allowEnterKey: true,
            showLoaderOnConfirm: true,
            focusConfirm: true,
            allowOutsideClick: false,
            onOpen: () => {
                let data = {
                    fileID: e.messageID
                }
                fetch('/updateMessageState', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }).then(response => {
                    if (response.status === 200) {
                        handleUpdate();
                    } else if (response.status === 500) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error de servidor'
                        })
                    } else if (response.status === 404) {
                        Toast.fire({
                            icon: 'warning',
                            title: 'no pudimos actualizar el estado del mensaje'
                        })
                    }
                })
            },
            preConfirm: () => {

            },
        })
    }
    async function getInboxMessages() {
        let response = await fetch('/getInboxMessages', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        if (response.status === 200) {
            let res = await response.json();
            let unreadMessages = [];
            res.forEach(e => { if (!e.wasRead) { unreadMessages.push(e) } })
            setCount(unreadMessages.length);
            setInbox(res);
        } else if (response.status === 404) {
            setCount(0);
            setInbox([]);
        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Server Error'
            })
        }
    }
    const handleUpdate = async () => {
        await getInboxMessages();
    }

    return (
        <NavDropdown drop='left' title={<div className={classes.root} style={{ cursor: 'pointer' }}>
            <Badge color='error' badgeContent={count} max={999} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }} >
                <ForumIcon className={classes.icon} style={{ fontSize: 50 }} />
            </Badge>
        </div>}>
            <NavDropdown.Item id='NavBarDropdown1'>
                <List component="nav" dense aria-label="main mailbox folders">
                    {
                        Inbox.map(e => {
                            /*return <div onClick={() => { checkMessage(e) }} style={{ backgroundColor: e.wasRead ? 'white' : '#ebebeb' }}>
                                <NavDropdown.Item bsPrefix='messagesDropdownItem' id='NavBarDropdown1'>
        
                                    <Avatar className={classes.avatar} src={e.senderImg} />
                                    <p className='messagesDropdownText'>{e.sender}</p>
                                    <p className='messagesDropdownMessage'>{e.message}</p>
        
                                </NavDropdown.Item>
                            </div>*/
                            return (
                                e.wasRead ?
                                    (
                                        <ListItem
                                            button
                                            selected={false}
                                            onClick={() => { checkMessage(e) }}

                                        >
                                            <ListItemIcon>
                                                <Avatar className={classes.avatar} src={e.senderImg} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={e.sender}
                                                secondary={e.message}
                                            />
                                        </ListItem >
                                    ) : (
                                        <ListItem
                                            button
                                            selected={true}
                                            onClick={() => { checkMessage(e) }}

                                        >
                                            <ListItemIcon>
                                                <Avatar className={classes.avatar} src={e.senderImg} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={e.sender}
                                                secondary={e.message}
                                            />
                                        </ListItem >
                                    )
                            )

                        })
                    }
                </List>
            </NavDropdown.Item>


        </NavDropdown>


    );
}
