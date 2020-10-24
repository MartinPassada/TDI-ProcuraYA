import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { useState, useEffect } from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExtendSessionFn from './ExtendSesion';
import refreshButtonGif from '../assets/refreshGif.gif'


const MySwal = withReactContent(Swal);
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: theme.palette.background.paper,
    },
}));
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
    onAfterClose: () => {
        //window.location.replace('/Home');
    }

})

export default function SearchResultList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);
    const [results, setResults] = React.useState(props.results);


    useEffect(() => {
        setResults(props.results);
    }, [props.results])


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const addFriend = async (id, index) => {
        let data = {
            attorneyID: id,
            type: 'friendRequest',
            message: 'Quiero agregarte como contacto',
        }
        let imgDiv = document.getElementById(index);
        let originalContent = imgDiv.innerHTML
        let gif = document.createElement('img');
        gif.src = refreshButtonGif;
        gif.height = 25
        imgDiv.innerHTML = '';
        imgDiv.append(gif);
        const response = await fetch('/saveMessage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            body: JSON.stringify(data)
        }).then(async response => {
            if (response.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: 'Solicitud enviada'
                })
                imgDiv.innerHTML = originalContent;
            } else if (response.status === 500) {
                Toast.fire({
                    icon: 'error',
                    title: 'Server Error'
                })
                imgDiv.innerHTML = originalContent;
            } else if (response.status === 403) {
                imgDiv.innerHTML = originalContent;
                await ExtendSessionFn();

            }
        })
    }

    return (
        <List dense className={classes.root}>
            {
                results.length > 0 ? (

                    props.type === 'friends' ? (
                        results.map((value, index) => {
                            const labelId = `checkbox-list-secondary-label-${value}`;
                            return <ListItem key={index} button>
                                <ListItemAvatar>
                                    <Avatar
                                        src={value.userImg}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={`${value.userName} ${value.userLastName} `} />
                                {
                                    value.alreadyInFriendList ? ('') : (
                                        <ListItemSecondaryAction>
                                            <div id={index}>
                                                <Tooltip title="Agregar contacto" arrow>
                                                    <IconButton onClick={() => { addFriend(value._id, index) }}>
                                                        <PersonAddIcon style={{ fontSize: 40, zIndex: 2, color: 'green' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </ListItemSecondaryAction>
                                    )
                                }
                            </ListItem >

                        })
                    ) : (
                            results.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return <ListItem key={index} button>
                                    <ListItemText id={labelId} primary={`Expediente N°: ${value.fileID} `} secondary={`Caratula: ${value.fileTitle}`}
                                    />

                                    <ListItemSecondaryAction>

                                        {/*<Tooltip title="zsdsadsadasd" arrow>
                                            <IconButton onClick={() => { '' }}>
                                                <PersonAddIcon style={{ fontSize: 40, zIndex: 2, color: '#ea5f32' }} />
                                            </IconButton>
                                        </Tooltip>*/}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            }
                            )
                        )
                ) : (
                        <ListItem key={0} button>
                            <ListItemText primary={`No hay resultados de busqueda`} />
                        </ListItem>
                    )


            }
        </List >
    );
}
