import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import AddIcon from '@material-ui/icons/Add';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


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
    //const [assignedFiles, setAssignedFiles] = React.useState([]);

    useEffect(() => {
        //getAssignedFiles();
    }, [])

    const renderComponent = (SwalBodyContainer, assignedFiles) => {
        //ReactDOM.render(<TransferList attorneyData={props.attorneyData} assignedFiles={assignedFiles} />, SwalBodyContainer)
    }
    const assignTask = async () => {
        MySwal.fire({
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            title: 'Asignar Tarea',
            html: `<div style="display: block;"><img style="padding-right: 5px;" className='userImg' height='40px' src=${props.attorneyData.userImg}></img>${props.attorneyData.userName}` + ' ' + `${props.attorneyData.userLastName}</div>`,
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
                let SwalBodyContainer = Swal.getContent()
                renderComponent(SwalBodyContainer);
            },
            preConfirm: () => {
                //request
            },
        })
    }


    return (
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

    );
}
