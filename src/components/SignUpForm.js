import React from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Logo from '../assets/LOGO1.png';

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
    onAfterClose: () => {
        window.location.replace('/Home');
    }

})

export default function SaveType(typeofuser) {
    const logo = Logo;
    const type = typeofuser;
    var failOn = 0;
    SignUpForm();

    function SignUpForm(signUpData, password2) {
        if (signUpData == undefined || signUpData.email == undefined || signUpData.password == undefined || signUpData.userName == undefined || signUpData.userLastName == undefined || password2 == undefined) {
            var lastData = {
                email: '',
                password: '',
                password2: '',
                userName: '',
                userLastName: ''
            }
        } else {
            var lastData = {
                email: signUpData.email,
                password: signUpData.password,
                password2: password2,
                userName: signUpData.userName,
                userLastName: signUpData.userLastName
            }
        }
        MySwal.fire({
            onOpen: () => {
                if (failOn === 6) {
                    document.getElementById("swal-input2").style.borderColor = 'red';
                    document.getElementById("swal-input3").style.borderColor = 'red';
                } else if (failOn === 8) {
                    document.getElementById("swal-input1").style.borderColor = 'red';
                    document.getElementById("swal-input2").style.borderColor = 'red';
                } else if (failOn === 0) {
                    //nothing to do here
                } else {

                    document.getElementById(`swal-input${failOn}`).style.borderColor = 'red';
                }
                document.getElementById("swal-input1").value = lastData.email;
                document.getElementById("swal-input2").value = lastData.password;
                document.getElementById("swal-input3").value = lastData.password2;
                document.getElementById("swal-input4").value = lastData.userName;
                document.getElementById("swal-input5").value = lastData.userLastName;
            },
            //imageUrl: 'https://raw.githubusercontent.com/MartinPassada/TDI-ProcuraYA/master/src/assets/LOGO1.png',
            imageUrl: logo,
            imageWidth: 250,
            imageHeight: 250,
            title: <p>Registrarse</p>,
            html:
                '<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
                '<input id="swal-input2" class="swal2-input" type="password" placeholder="Password">' +
                '<input id="swal-input3" class="swal2-input" type="password" placeholder="Repetir Password">' +
                '<input id="swal-input4" class="swal2-input" type="text" placeholder="Nombre">' +
                '<input id="swal-input5" class="swal2-input" type="text" placeholder="Apellido">',
            confirmButtonText: 'ACEPTAR',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#ea5f32',
            showCancelButton: true,
            cancelButtonText: 'CANCELAR',
            cancelButtonColor: '#999999',
            focusConfirm: false,
            preConfirm: () => {
                var password2 = document.getElementById('swal-input3').value;
                if (type === 'representative') {
                    var signUpData = {
                        email: document.getElementById("swal-input1").value,
                        password: document.getElementById("swal-input2").value,
                        userName: document.getElementById("swal-input4").value,
                        userLastName: document.getElementById("swal-input5").value,
                        attorneys: [],
                        files: [],
                        inbox: [],
                        userType: type,
                        emailConfirmed: false,
                    };
                } else if (type === 'attorney') {
                    var signUpData = {
                        email: document.getElementById("swal-input1").value,
                        password: document.getElementById("swal-input2").value,
                        userName: document.getElementById("swal-input4").value,
                        userLastName: document.getElementById("swal-input5").value,
                        files: [],
                        inbox: [],
                        userType: type,
                        emailConfirmed: false,
                    };

                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Hubo un problema con el formulario, intenta de nuevo',
                        confirmButtonColor: '#ea5f32',
                    })
                }
                var passwordPattern = /^([a-zA-Z0-9_.-@*]{5,15})$/gm;
                var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{3,3}$/ig;

                if (signUpData.password == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir una password',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 2;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (password2 == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes confirmar tu password',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 3;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.email == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir un e-mail',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.userName == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir tu nombre',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 4;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.userLastName == '') {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir tu apellido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 5;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.email.search(mailPattern)) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'E-mail invalido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.password.search(passwordPattern)) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 2;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (password2.search(passwordPattern)) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 3;
                            SignUpForm(signUpData, password2);
                        }
                    })

                } else if (signUpData.password !== password2) {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Ambas passwords deben coincidir',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 6;
                            SignUpForm(signUpData, password2);
                        }
                    })
                } else if (signUpData.password === signUpData.email) {
                    MySwal.fire({
                        icon: 'question',
                        title: 'Es en serio?',
                        text: 'Tu password no puede ser igual que tu email, piensa en tu seguridad!!',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 8;
                            SignUpForm(signUpData, password2);
                        }
                    })
                } else {
                    return fetch('/signUp', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(signUpData)
                    })
                        .then(response => {
                            if (response.status === 200) {
                                Toast.fire({
                                    icon: 'success',
                                    title: 'Registro Exitoso redireccionando al Home...'
                                })
                            } else if (response.status === 403) {
                                MySwal.fire({
                                    icon: 'error',
                                    title: 'Oh no !!',
                                    text: 'El email ya existe',
                                    confirmButtonColor: '#ea5f32',
                                    onClose: () => {
                                        SignUpForm(signUpData, password2);
                                    }
                                })
                            } else if (response.status === 500) {
                                MySwal.fire({
                                    icon: 'error',
                                    title: 'Server Error',
                                    text: 'Tuvimos un problemita...',
                                    confirmButtonColor: '#ea5f32',
                                    onClose: () => {
                                        SignUpForm(signUpData, password2);
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
        })
    }
}





