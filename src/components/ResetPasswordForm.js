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
    timer: 3000,
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
function showSteppedRPForm() {
    var correctRpc = 0;
    Swal.mixin({
        onBeforeOpen: () => {
            let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
            progressStepBar[0].childNodes[0].style.background = '#ea5f32';
        },
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
            popup: 'animate__animated animate__fadeOutDown'
        },
    }).queue([
        //1
        {
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            icon: 'warning',
            title: 'Autenticar',
            html:
                '<p>Necesitamos validar tu identidad</p>' +
                '<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
                '<input maxlength="29" id="swal-input4" class="swal2-input" type="text" placeholder="Nombre">' +
                '<input maxlength="29" id="swal-input5" class="swal2-input" type="text" placeholder="Apellido">',
            preConfirm: async () => {
                var RPauthData = {
                    email: document.getElementById("swal-input1").value,
                    userName: document.getElementById("swal-input4").value,
                    userLastName: document.getElementById("swal-input5").value,
                };
                var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{2,4}$/ig;
                if (RPauthData.email == '' || RPauthData.userName == '' || RPauthData.userLastName == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Aún quedan campos por rellenar',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            showSteppedRPForm();
                        }
                    })
                } else if (RPauthData.email.search(mailPattern)) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'E-mail invalido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            showSteppedRPForm();
                        }
                    })
                } else {
                    await fetch('/rpAuth', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(RPauthData)
                    })
                        .then(response => {
                            if (response.status === 200) {
                                //pass to next step, send code
                            } else if (response.status === 403 || response.status === 404) {
                                MySwal.fire({
                                    icon: 'error',
                                    title: 'Oh no !!',
                                    text: 'Las credenciales no son validas',
                                    confirmButtonColor: '#ea5f32',
                                    onClose: () => {
                                        showSteppedRPForm();
                                    }
                                })
                            } else if (response.status === 500) {
                                MySwal.fire({
                                    icon: 'error',
                                    title: 'Server Error',
                                    text: 'Tuvimos un problemita...',
                                    confirmButtonColor: '#ea5f32',
                                    onClose: () => {
                                        showSteppedRPForm();
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            Swal.showValidationMessage(
                                `Algo falló: ${error}`
                            )
                        })
                }
            }
        },
        //2
        {
            onBeforeOpen: () => {
                let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                progressStepBar[0].childNodes[0].style.background = '#ea5f32';
                progressStepBar[0].childNodes[1].style.background = '#ea5f32';
                progressStepBar[0].childNodes[2].style.background = '#ea5f32';
            },
            icon: 'question',
            title: 'Ingresa el código',
            text: 'Te hemos enviado un código a tu email',
            html: '<input maxlength="4" id="swal-input7" class="swal2-input" type="text" placeholder="Código de confirmación">' +
                '<p id=codeMessage style="display:none"></p>',
            footer: '<a onclick="reSendEmail()" href="#"> Reenviar código</a>',
            preConfirm: async () => {
                let rpc = document.getElementById('swal-input7').value;
                await fetch(`/crpc?rpc=${rpc}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then(rpcResultResponse => {
                        if (rpcResultResponse.status === 200) {
                            correctRpc = rpc;
                        } else if (rpcResultResponse.status === 403) {
                            Swal.showValidationMessage('Codigo incorrecto')
                        } else if (rpcResultResponse.status === 500) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: 'Tuvimos un problemita...',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    window.location.replace('/ResetPassword');
                                }
                            })
                        }
                    })
            }
        },
        //3
        {
            onBeforeOpen: () => {
                let progressStepBar = document.getElementsByClassName('swal2-progress-steps');
                progressStepBar[0].childNodes.forEach(cn => {
                    cn.style.background = '#ea5f32';
                })
            },
            title: 'Restablecer contraseña',
            text: 'Ingresa tu contraseña nueva',
            html:
                '<input maxlength="30" oncut="return false" onpaste="return false" oncopy="return false" oninput="onTheFlyCheck(this.id);passwordStrength(this.value)" id="swal-input2" class="swal2-input" type="password" placeholder="Nueva contraseña">' +
                '<img onclick="showPassword()" id="seePasswordImg" style="display:none"></img>' +
                '<div id="passwordStrength" style="display:none"></div>' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage2" style="display:none;"></span>',
            preConfirm: async () => {
                var np = document.getElementById('swal-input2').value;
                var data = {
                    password: np
                }
                await fetch('/resetPassword/' + `${correctRpc}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (response.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Contraseña reestablecida',
                                text: 'Ahora puedes intentar loguearte con tu contraseña nueva',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Volviendo a la pagina principal..'
                                    })
                                }
                            })
                        } else if (response.status === 500) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: 'Tuvimos un problemita...',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    window.location.replace('/ResetPassword');
                                }
                            })
                        } else if (response.status === 403) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Selecciona otra contraseña',
                                text: 'No puedes utilizar la misma contraseña que tenias antes',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    showSteppedRPForm();
                                }
                            })
                        }
                    })


            }
        },
    ])
}
export default class resetPasswordForm extends Component {
    async componentDidMount() {
        showSteppedRPForm();
    }
    render() {
        return (
            <>
                <div></div>
            </>
        )
    }

}
