import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import AttorneyDataInfoHeader from './AttorneyDataInfoHeader'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExtendSessionFn from './ExtendSesion';


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
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10%',
        marginRight: '10%',
    },
}));

export default function SelectFile(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [assignedFiles, setAssignedFiles] = React.useState([]);

    let assignedArray = [];

    async function buildAssignedArray(assignedFiles) {
        assignedFiles.forEach(e => {
            assignedArray.push(e.fileID);
        });
        return assignedArray
    }
    async function getAssignedFiles() {
        let dataSend = {
            attorneyID: props.attorneyData._id
        }
        let response = await fetch('/getAssignedFiles', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            body: JSON.stringify(dataSend)
        })
        if (response.status === 200) {
            let res = await response.json();
            await buildAssignedArray(res).then(res => { setAssignedFiles(res) })
        } else if (response.status === 404) {
            setAssignedFiles([]);
        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Error de servidor'
            })
        } else if (response.status === 500) {
            await ExtendSessionFn();
        }
    }
    useEffect(() => {
        getAssignedFiles();
        //await buildAssignedArray().then(res => { setAssignedFiles(res) });
    }, [])

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        props.setSelectedFilesFn(newChecked);
    };

    return (

        assignedFiles.length > 0 ?
            (
                <>
                    <p>¿Sobre cual expediente quieres crear una tarea?</p>
                    <AttorneyDataInfoHeader attorneyData={props.attorneyData} />
                    <div className={classes.root}>
                        <List dense className={classes.root}>
                            {assignedFiles.map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                    <ListItem key={value} button>
                                        <ListItemText id={labelId} primary={`Expediente N° ${value}`} secondary={''} />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={handleToggle(value)}
                                                checked={checked.indexOf(value) !== -1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </>
            ) : (<p>El procurador seleccionado no tiene expedientes asignados.</p>)


    );
}
