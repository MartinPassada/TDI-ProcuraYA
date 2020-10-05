import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import axios from 'axios'
import NavigationBar from './NavigationBar'
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
    showClass: {
        popup: 'animate__animated animate__bounceIn'
    },
    hideClass: {
        popup: 'animate__animated animate__bounceOut'
    },

    onAfterClose: () => {
        window.location.replace('/Home')
    }
})

export default async function AccountConfig(props) {
    const { value: file } = await MySwal.fire({
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        showLoaderOnConfirm: true,
        title: 'Subir imagen de usuario',
        timerProgressBar: true,
        confirmButtonText: 'ACEPTAR',
        confirmButtonColor: '#ea5f32',
        showCloseButton: true,
        allowOutsideClick: false,
        input: 'file',
        inputPlaceholder: 'Seleccionar imagen de usuario',
        inputAttributes: {
            'aria-label': 'Seleccionar imagen de usuario',
            'accept': 'image/*',
        },
        preConfirm: async (file) => {
            if (file) {
                if ((file.size / 1024) < 1024) {
                    let fd = new FormData();
                    fd.append("file", file, file.name);
                    const headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    }
                    await axios.post('updateUserImg', fd, { headers }, {
                        onUploadProgress: progressEvent => {
                            console.log(progressEvent.loaded / progressEvent.total)
                        }
                    }).then(async response => {
                        if (response.status === 200) {
                            return true
                        } else if (response.status === 500) {
                            Toast.fire({
                                icon: 'error',
                                title: 'Server Error'
                            })
                        } else if (response.status === 403) {
                            await ExtendSessionFn()
                        }
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Algo falló: ${error}`
                        )
                    })
                } else {
                    Swal.showValidationMessage('La imagen es muy pesada, Tamaño maximo 1 MB')
                }
            } else {
                Swal.showValidationMessage('Debes introducir una imagen')
            }
        }
    })
    return true

}


