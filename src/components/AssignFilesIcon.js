import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TransferList from './TransferList'
import Tooltip from '@material-ui/core/Tooltip';
import ExtendSessionFn from './ExtendSesion';
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

export default function AssignFilesIcon(props) {
    const classes = useStyles();
    const [count, setCount] = React.useState(0);
    const [assignedFiles, setAssignedFiles] = React.useState([]);

    useEffect(() => {
        getAssignedFiles();
    }, [])

    const renderComponent = (SwalBodyContainer, assignedFiles) => {
        ReactDOM.render(<TransferList attorneyData={props.attorneyData} assignedFiles={assignedFiles} />, SwalBodyContainer)
    }
    const assignFiles = async (assignedFiles) => {
        MySwal.fire({
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            title: 'Asignar Expediente',
            html: `<div style="display: block;"><img style="padding-right: 5px;" className='userImg' height='40px' src=${props.attorneyData.userImg}></img>${props.attorneyData.userName}` + ' ' + `${props.attorneyData.userLastName}</div>`,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ea5f32',
            cancelButtonColor: '#999999',
            showLoaderOnConfirm: true,
            allowEnterKey: true,
            focusConfirm: true,
            showCloseButton: true,
            allowOutsideClick: false,
            onOpen: () => {
                let SwalBodyContainer = Swal.getContent()
                renderComponent(SwalBodyContainer, assignedFiles);
            },
            preConfirm: async () => {
                let toAssignList = [];
                let assignedList = [];
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

                let dataSend = {
                    attorneyID: props.attorneyData._id,
                    toAssignList: toAssignList,
                    assignedList: assignedList,
                }

                let response = await fetch('assignFiles', {
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
                    props.handleControlPanelUpdate();
                } else if (response.status === 500) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Error de servidor'
                    })
                    handleUpdate();
                } else if (response.status === 403) {
                    await ExtendSessionFn()
                }


                //request? something ?
            },
        })
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
        await getAssignedFiles();
    }

    return (
        <Tooltip style={{ zIndex: 2 }} title="Asignar Expediente" arrow>
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
