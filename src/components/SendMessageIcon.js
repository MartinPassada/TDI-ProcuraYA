import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import ChatIcon from '@material-ui/icons/Chat';
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

export default function SendMessageIcon(props) {
    const classes = useStyles();
    const [count, setCount] = React.useState(0);

    useEffect(() => {
    }, [])

    const sendMessage = async (props) => {
        MySwal.fire({
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            title: 'Enviar Mensaje',
            //header
            html: `<div style="display: block;"><img style="padding-right: 5px;" className='userImg' height='40px' src=${props.attorneyData.userImg}></img>${props.attorneyData.userName}` + ' ' + `${props.attorneyData.userLastName}</div>`,
            input: 'textarea',
            inputPlaceholder: 'Escribe tu mensaje (150 caracteres max)',
            inputAttributes: {
                maxlength: 150,
                autocapitalize: 'off',
                autocorrect: 'on'
            },
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

            },
            preConfirm: async () => {
                var messagePattern = /^([\s\w\d áéíóú a-zA-Z0-9_+/.:'!’"#ñ,()¿?*=-]{4,150})$/g;
                let message = Swal.getInput().value;
                let messageWithoutSpaces = message.replace(/ /g, "");
                if (!messageWithoutSpaces) {
                    Swal.showValidationMessage('Tu mensaje no puede estar vacio')
                } else if (messageWithoutSpaces.search(messagePattern)) {
                    Swal.showValidationMessage("El comentario debe tener entre 4 y 150 caracteres y no contener caracteres invalidos {} [] <>")
                } else {
                    let data = {
                        attorneyID: props.attorneyData._id,
                        message: message,
                        type: 'message'
                    }
                    const response = await fetch('/saveMessage', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }).then(response => {
                        if (response.status === 200) {
                            Toast.fire({
                                icon: 'success',
                                title: 'Su mensaje se ha enviado'
                            })
                        } else if (response.status === 500) {
                            Toast.fire({
                                icon: 'error',
                                title: 'Server Error'
                            })
                        }
                    })
                }
            },
        })
    }



    return (
        <div className={classes.root} onClick={() => { sendMessage(props) }} style={{ cursor: 'pointer' }} >
            <div>
                <Badge color='error' badgeContent={0} max={999} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}  >
                    <ChatIcon className={classes.icon} style={{ fontSize: 40 }} />
                </Badge>
            </div>
        </div>

    );
}