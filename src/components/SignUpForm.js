import React from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }

})

export default function SignUpForm(signUpData, password2) {
    if (signUpData.email == undefined || signUpData.password == undefined || signUpData.userName == undefined || signUpData.userLastName == undefined || password2 == undefined) {
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
            document.getElementById("swal-input1").value = lastData.email;
            document.getElementById("swal-input2").value = lastData.password;
            document.getElementById("swal-input3").value = lastData.password2;
            document.getElementById("swal-input4").value = lastData.userName;
            document.getElementById("swal-input5").value = lastData.userLastName;
        },
        imageUrl: 'https://raw.githubusercontent.com/MartinPassada/TDI-ProcuraYA/master/src/assets/LOGO1.png',
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
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        focusConfirm: false,
        preConfirm: () => {
            var password2 = document.getElementById('swal-input3').value;
            var signUpData = {
                email: document.getElementById("swal-input1").value,
                password: document.getElementById("swal-input2").value,
                userName: document.getElementById("swal-input4").value,
                userLastName: document.getElementById("swal-input5").value
            };
            var passwordPattern = /^([a-zA-Z0-9_.-@*]{5,15})$/gm;
            var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{3,3}$/ig;

            if (signUpData.password == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir una password',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (password2 == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes confirmar tu password',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.email == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir un e-mail',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.userName == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir tu nombre',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.userLastName == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir tu apellido',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.email.search(mailPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'E-mail invalido',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.password.search(passwordPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (password2.search(passwordPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })

            } else if (signUpData.password !== password2) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Ambas passwords deben que coincidir',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })
            } else if (signUpData.password === signUpData.email) {
                MySwal.fire({
                    icon: 'question',
                    title: 'Es en serio?',
                    text: 'Tu password no puede ser igual que tu email, piensa en tu seguridad!!',
                    onClose: () => {
                        SignUpForm(signUpData, password2);
                    }
                })
            } else {
                Toast.fire({
                    icon: 'success',
                    title: '"Registro Exitoso" (aún no hay backend)'
                })
            }

        }
    })

}

