import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SelectFile from './SelectFile'
import SelectTask from './SelectTask'
import Summary from './Summary'
import Tooltip from '@material-ui/core/Tooltip';


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
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            marginBottom: theme.spacing(2),
        },
        '& .MuiBadge-root': {
            marginRight: theme.spacing(4),
        },
    },
    icon: {
        color: '#212121',
    },

}));

export default function AssignTaskIcon(props) {
    const classes = useStyles();
    const [count, setCount] = React.useState(0);
    const [assignedFiles, setAssignedFiles] = React.useState([]);

    let selectedFiles = [];
    let selectedTaskList = [];

    useEffect(() => {
        //getAssignedFiles();
    }, [])

    async function setSelectedFilesFn(selectedFilesArray) {
        selectedFiles = selectedFilesArray
    }

    async function setTaskListFn(array) {
        selectedTaskList = array
    }

    async function getAssignedFiles() {
        let dataSend = {
            attorneyID: props.attorneyData._id
        }
        let response = await fetch('/getAssignedFiles', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataSend)
        })
        if (response.status === 200) {
            let res = await response.json();
            setCount(res.length);
            setAssignedFiles(res);
        } else if (response.status === 404) {
            setCount(0);
            setAssignedFiles([]);
        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Error de servidor'
            })
        }
    }
    const handleUpdate = async () => {
        await getAssignedFiles();
    }
    const assignTask = async (assignedFiles) => {
        selectedFiles = [];
        selectedTaskList = [];
        Swal.mixin({
            onBeforeOpen: async () => {
                let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                progressStepBar[0].childNodes[0].style.background = '#ea5f32';
            },
            allowOutsideClick: false,
            confirmButtonText: 'ACEPTAR',
            confirmButtonColor: '#ea5f32',
            focusConfirm: true,
            showLoaderOnConfirm: true,
            showCancelButton: false,
            showCloseButton: true,
            cancelButtonText: 'CANCELAR',
            cancelButtonColor: '#999999',
            allowEnterKey: true,
            progressSteps: ['1', '2', '3'],
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
        }).queue([
            //step1 Select File
            {
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                title: 'Seleccionar Expediente',
                onOpen: () => {
                    let SwalBodyContainer = Swal.getContent()
                    ReactDOM.render(<SelectFile attorneyData={props.attorneyData} setSelectedFilesFn={setSelectedFilesFn} />, SwalBodyContainer)
                },
                preConfirm: () => {
                    if (selectedFiles.length <= 0) {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No puedes continuar sin seleccionar ningun expediente',
                            confirmButtonColor: '#ea5f32',
                            onClose: () => {
                                assignTask();
                            }
                        })
                    }
                },
            },
            //step2 Create Task
            {
                onBeforeOpen: () => {
                    let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                    progressStepBar[0].childNodes[0].style.background = '#ea5f32';
                    progressStepBar[0].childNodes[1].style.background = '#ea5f32';
                    progressStepBar[0].childNodes[2].style.background = '#ea5f32';
                },
                title: 'Añadir tareas a la lista',
                onOpen: () => {
                    let SwalBodyContainer = Swal.getContent()
                    ReactDOM.render(<SelectTask setTaskListFn={setTaskListFn} />, SwalBodyContainer)
                },
                preConfirm: async () => {
                    if (selectedTaskList.length <= 0) {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No puedes continuar sin agregar ninguna tarea',
                            confirmButtonColor: '#ea5f32',
                            onClose: () => {
                                assignTask();
                            }
                        })
                    }
                },
            },
            //step3 Summary
            {
                onBeforeOpen: () => {
                    let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                    progressStepBar[0].childNodes.forEach(cn => {
                        cn.style.background = '#ea5f32';
                    })
                },
                title: 'Sumario',
                onOpen: () => {
                    let SwalBodyContainer = Swal.getContent()
                    ReactDOM.render(<Summary attorneyData={props.attorneyData} files={selectedFiles} tasks={selectedTaskList} />, SwalBodyContainer)
                },
                preConfirm: async () => {
                    let task = {
                        files: selectedFiles,
                        tasks: selectedTaskList
                    }
                    await fetch('/addTaskToFile', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(task)
                    }).then(response => {
                        if (response.status === 200) {
                            Toast.fire({
                                icon: 'success',
                                title: 'Las tareas se han agregado'
                            })
                        } else if (response.status === 500) {
                            Toast.fire({
                                icon: 'error',
                                title: 'Server error'
                            })
                        }
                    })
                },
            },
        ])
    }

    return (
        <Tooltip style={{ zIndex: 2 }} title="Asignar Tarea" arrow>
            <div className={classes.root} onClick={() => { assignTask() }} style={{ cursor: 'pointer' }} >
                <div>
                    <Badge color='error' badgeContent={0} max={999} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}  >
                        <AddCircleOutlineIcon className={classes.icon} style={{ fontSize: 40 }} />
                    </Badge>
                </div>
            </div>
        </Tooltip>
    );
}
