import React, { Component } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Logo from '../assets/LOGO1.png';
const logo = Logo;
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
        window.location.replace('/')
    }
})

function showRPForm() {
    MySwal.fire({
        //imageUrl: 'https://raw.githubusercontent.com/MartinPassada/TDI-ProcuraYA/master/src/assets/LOGO1.png',
        imageUrl: logo,
        imageWidth: 250,
        imageHeight: 250,
        title: 'Restablecer Contraseña',
        html:
            '<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
            '<input maxlength="29" id="swal-input4" class="swal2-input" type="text" placeholder="Nombre">' +
            '<input maxlength="29" id="swal-input5" class="swal2-input" type="text" placeholder="Apellido">',
        confirmButtonText: 'ACEPTAR',
        showLoaderOnConfirm: true,
        confirmButtonColor: '#ea5f32',
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        cancelButtonColor: '#999999',
        focusConfirm: false,
        allowEnterKey: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown'
        },
        onAfterClose: () => {
            window.location.replace('/')
        },
        preConfirm: () => {
            var RPauthData = {
                email: document.getElementById("swal-input1").value,
                userName: document.getElementById("swal-input4").value,
                userLastName: document.getElementById("swal-input5").value,
            };
            var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{3,3}$/ig;
            if (RPauthData.email == '' || RPauthData.userName == '' || RPauthData.userLastName == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Aún quedan campos por rellenar',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        showRPForm();
                    }
                })

            } else if (RPauthData.email.search(mailPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'E-mail invalido',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        showRPForm();
                    }
                })
            } else {
                return fetch('/rpAuth', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(RPauthData)
                })
                    .then(response => {
                        if (response.status === 200) {
                            MySwal.fire({
                                title: 'Ingresa tu nueva contraseña',
                                html:
                                    '<input maxlength="30" oncut="return false" onpaste="return false" oncopy="return false" oninput="onTheFlyCheck(this.id);passwordStrength(this.value)" id="swal-input2" class="swal2-input" type="password" placeholder="Password">' +
                                    '<img onclick="showPassword()" id="seePasswordImg" style="display:none"></img>' +
                                    '<div id="passwordStrength" style="display:none"></div>' +
                                    '<span class="onTheFlyMessage" id="onTheFlyMessage2" style="display:none;"></span>',
                                confirmButtonText: 'ACEPTAR',
                                showLoaderOnConfirm: true,
                                confirmButtonColor: '#ea5f32',
                                showCancelButton: true,
                                cancelButtonText: 'CANCELAR',
                                cancelButtonColor: '#999999',
                                focusConfirm: false,
                                allowEnterKey: true,
                                preConfirm: () => {
                                    var passwordPattern = /^([a-zA-Z0-9_.-@*]{5,15})$/gm;
                                }
                            })

                        } else if (response.status === 403 || response.status === 404) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Oh no !!',
                                text: 'Las credenciales no son validas',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    showRPForm();
                                }
                            })
                        } else if (response.status === 500) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: 'Tuvimos un problemita...',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    showRPForm();
                                }
                            })
                        }
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Algo falló: ${error}`
                        )
                    })

                //toast exito

            }
        }
    })
}
export default class resetPasswordForm extends Component {
    async componentDidMount() {
        showRPForm();
    }
    render() {
        return (
            <>
                <div></div>
            </>
        )
    }

}
