import React from 'react';
import ReactDOM from 'react-dom';
//import AttorneyDataInfoHeader from './AttorneyDataInfoHeader'
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { useState, useEffect } from 'react';
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
export default function SummaryLocation(props) {
    const [tasksToShow, setTasksToShow] = React.useState([]);
    const styleP = {
        color: "black",
        textAlign: "center",
        marginTop: "10px",
        marginBottom: "10px",
    }
    useEffect(() => {
        props.dataToSend.assignedList.forEach(fileID => {
            getTasks(fileID);
        });
    }, [])
    var tasksToShowArr = []
    async function getTasks(fileID) {
        let response = await fetch(`/getTasks?fileID=${fileID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
        })
        if (response.status === 200) {
            let res = await response.json();
            //console.log(res)
            props.dataToSend.assignedList.forEach(file => {
                if (file == res.fileID) {
                    res.tasks.forEach(t => {
                        t.expirationDate = new Date(t.expirationDate).getTime()
                    })
                    res.tasks.sort(function (a, b) {
                        return a.expirationDate - b.expirationDate
                    });
                    let task = res.tasks[0].taskName
                    tasksToShowArr.concat(task);
                    setTasksToShow(tasksToShowArr)
                }
            })
            console.log(tasksToShow)
        } else if (response.status === 404) {

        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Error de servidor'
            })
        } else if (response.status === 403) {
            await ExtendSessionFn()
        }
    }
    return (
        <>

            <h4 style={styleP}>Jurisdiccion</h4>
            {props.dataToSend.entityName}
            <h4 style={styleP}>Sala / Secretaria</h4>
            {props.dataToSend.locationName}
            <h4 style={styleP}>Expedientes Seleccionados</h4>
            <List>
                {props.dataToSend.assignedList.map(e => {
                    return <ListItem>
                        <ListItemText primary={`Expediente N° ${e}`} />
                    </ListItem>
                })}
            </List>
            <h4 style={styleP}>Tareas a completar</h4>
            <List>

                <ListItem>
                    <ListItemText primary={'Tarea mas pronta a expirar de cada expediente'}
                        secondary={''} />
                </ListItem>


            </List>


        </>
    )
}