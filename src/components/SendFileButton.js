import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TransferListforLocation from './TransferListforLocation'
import Tooltip from '@material-ui/core/Tooltip';
import ExtendSessionFn from './ExtendSesion';
import SummaryLocation from './SummaryLocation'
//import ControlPanel from './ControlPanel'

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

export default function SendFileButton(props) {
    const classes = useStyles();
    const [count, setCount] = React.useState(0);
    const [assignedFiles, setAssignedFiles] = React.useState([]);

    useEffect(() => {
        getAssignedFilesToLocation();
    }, [])

    const renderComponent = (SwalBodyContainer, assignedFiles) => {
        ReactDOM.render(<TransferListforLocation attorneyData={props.attorneyData} assignedFiles={assignedFiles} />, SwalBodyContainer)
    }
    const assignFiles = async (assignedFiles) => {
        let toAssignList = [];
        let assignedList = [];
        let time = {
            days: 0,
            hours: 0,
            minutes: 0,
        }
        MySwal.mixin({
            onBeforeOpen: async () => {
                let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                progressStepBar[0].childNodes[0].style.background = '#ea5f32';
            },
            html: `<div style="display: block;"><img style="padding-right: 5px;" className='userImg' height='40px' src=${''}></img>${''}` + ' ' + `${''}</div>`,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ea5f32',
            cancelButtonColor: '#999999',
            showLoaderOnConfirm: true,
            allowEnterKey: true,
            focusConfirm: true,
            showCloseButton: true,
            allowOutsideClick: false,
            progressSteps: ['1', '2', '3'],
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
        }).queue([
            {
                //step 1 select file
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                title: 'Enviar Expediente',
                onOpen: () => {
                    let SwalBodyContainer = Swal.getContent()
                    renderComponent(SwalBodyContainer, assignedFiles);
                },
                preConfirm: async () => {
                    let lList = document.getElementById('TlistLeft').childNodes[0].childNodes[0].childNodes[2].childNodes;
                    let rList = document.getElementById('TlistRight').childNodes[0].childNodes[0].childNodes[2].childNodes;
                    lList.forEach(node => {
                        if (node.textContent != '') {
                            let fileID = node.textContent.replace('Expediente N° ', '');
                            toAssignList.push(fileID);
                        }
                    })
                    rList.forEach(node => {
                        if (node.textContent != '') {
                            let fileID = node.textContent.replace('Expediente N° ', '');
                            assignedList.push(fileID);
                        }
                    })
                    if (assignedList.length == 0 && toAssignList.length == 0) {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Debes seleccionar al menos un expediente'
                        })

                    }
                }
            },
            {
                //step 2 select time
                onBeforeOpen: () => {
                    let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                    progressStepBar[0].childNodes[0].style.background = '#ea5f32';
                    progressStepBar[0].childNodes[1].style.background = '#ea5f32';
                    progressStepBar[0].childNodes[2].style.background = '#ea5f32';
                },
                icon: 'question',
                title: 'Seleccionar Recordatorio',
                onOpen: () => {
                    //let SwalBodyContainer = Swal.getContent()
                    //ReactDOM.render(<SelectTask setTaskListFn={setTaskListFn} />, SwalBodyContainer)
                },
                input: 'range',
                //inputLabel: 'Minutos',
                inputAttributes: {
                    title: 'Minutos',
                    min: 0,
                    max: 60,
                    step: 1
                },
                inputValue: 0,
                preConfirm: async () => {
                    let inputs = Swal.getInput()
                    time.minutes = parseInt(inputs.value)
                    //console.log(time.minutes)
                },
            },
            {
                //step 3 summary ?
                onBeforeOpen: () => {
                    let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                    progressStepBar[0].childNodes.forEach(cn => {
                        cn.style.background = '#ea5f32';
                    })

                },
                title: 'Sumario',
                onOpen: () => {
                    let dataSend = {
                        isRoom: props.isRoom,
                        entityName: props.entityName,
                        locationName: props.locationName,
                        toAssignList: toAssignList,
                        assignedList: assignedList,
                        time: time
                    }
                    let SwalBodyContainer = Swal.getContent()
                    ReactDOM.render(<SummaryLocation dataToSend={dataSend} />, SwalBodyContainer)
                },
                preConfirm: async () => {
                    let dataSend = {
                        isRoom: props.isRoom,
                        entityName: props.entityName,
                        locationName: props.locationName,
                        toAssignList: toAssignList,
                        assignedList: assignedList,
                        time: time
                    }
                    console.log(dataSend);
                    //REQUEST
                    let response = await fetch('/assignFilesToLocation', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                        },
                        body: JSON.stringify(dataSend)
                    })
                    if (response.status === 200) {
                        handleUpdate();
                        //props.handleControlPanelUpdate();
                    } else if (response.status === 500) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error de servidor'
                        })
                        handleUpdate();
                    } else if (response.status === 403) {
                        await ExtendSessionFn()
                    }
                    //REQUEST
                },
            }

        ])


    }
    async function getAssignedFilesToLocation() {
        let response = await fetch(`/getAssignedFilesToLocation?locationName=${props.locationName}&entityName=${props.entityName}&isRoom=${props.isRoom}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
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
        } else if (response.status === 403) {
            await ExtendSessionFn()
        }
    }
    const handleUpdate = async () => {
        await getAssignedFilesToLocation();
    }

    return (
        <Tooltip style={{ zIndex: 2 }} title="Enviar Expediente" arrow>
            <div className={classes.root} onClick={() => { assignFiles(assignedFiles) }} style={{ cursor: 'pointer' }} >
                <div>
                    <Badge color='error' badgeContent={count} max={999} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}  >
                        <DescriptionSharpIcon className={classes.icon} style={{ fontSize: 40 }} />
                    </Badge>
                </div>
            </div>
        </Tooltip>

    );
}













