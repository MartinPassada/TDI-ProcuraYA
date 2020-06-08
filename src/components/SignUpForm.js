import React from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Logo from '../assets/LOGO1.png';
import $ from 'jquery';
import refreshIcon from '../assets/refreshIcon.png';
import refreshIconGif from '../assets/refreshGif.gif';
import eyeOrange from '../assets/eyeOrange.png';
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
    const isFalse = (currentValue) => currentValue === false;
    var failOn = {
        emailIsEmpty: false,
        emailIsIncorrect: false,
        passwordIsEmpty: false,
        passwordIsIncorrect: false,
        password2IsEmpty: false,
        password2IsIncorrect: false,
        userNameIsEmpty: false,
        userNameIsIncorrect: false,
        userLastNameIsEmpty: false,
        userLastNameIsIncorrect: false,
        passwordsCombinationAreIncorrect: false,
        passwordEqualMail: false,
        captcha: false
    }
    var openAnimation = 'animate__animated animate__fadeInDown';
    SignUpForm();

    function SignUpForm(signUpData, password2) {
        if (signUpData == undefined || signUpData.email == undefined || signUpData.password == undefined || signUpData.userName == undefined || signUpData.userLastName == undefined || password2 == undefined) {
            var lastData = {
                email: '',
                password: '',
                password2: '',
                userName: '',
                userLastName: '',
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
            onBeforeOpen: () => {
                if (failOn.emailIsEmpty || failOn.emailIsIncorrect) {
                    document.getElementById("swal-input1").style.borderColor = 'red';
                }
                if (failOn.passwordIsEmpty || failOn.passwordIsIncorrect) {
                    document.getElementById("swal-input2").style.borderColor = 'red';
                }
                if (failOn.password2IsEmpty || failOn.password2IsIncorrect) {
                    document.getElementById("swal-input3").style.borderColor = 'red';
                }
                if (failOn.userNameIsEmpty || failOn.userNameIsIncorrect) {
                    document.getElementById("swal-input4").style.borderColor = 'red';
                }
                if (failOn.userLastNameIsEmpty || failOn.userLastNameIsIncorrect) {
                    document.getElementById("swal-input5").style.borderColor = 'red';
                }
                if (failOn.passwordsCombinationAreIncorrect) {
                    //document.getElementById("swal-input2").style.borderColor = 'red';
                    document.getElementById("swal-input3").style.borderColor = 'red';
                }
                if (failOn.passwordEqualMail) {
                    document.getElementById("swal-input1").style.borderColor = 'red';
                    document.getElementById("swal-input2").style.borderColor = 'red';
                }
                if (failOn.captcha) {
                    document.getElementById("swal-input6").style.borderColor = 'red';
                }

                //paste last values
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
                '<input oninput="onTheFlyCheck(this.id)" id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage1" style="display:none;">mensaje</span>' +
                '<input maxlength="30" oncut="return false" onpaste="return false" oncopy="return false" oninput="onTheFlyCheck(this.id);passwordStrength(this.value)" id="swal-input2" class="swal2-input" type="password" placeholder="Password">' +
                '<img onclick="showPassword()" id="seePasswordImg" style="display:none"></img>' +
                '<div id="passwordStrength" style="display:none"></div>' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage2" style="display:none;"></span>' +
                '<input maxlength="30" oncut="return false" onpaste="return false" oncopy="return false" oninput="onTheFlyCheck(this.id)" id="swal-input3" class="swal2-input" type="password" placeholder="Repetir Password">' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage3" style="display:none;"></span>' +
                '<input maxlength="29" oninput="onTheFlyCheck(this.id)" id="swal-input4" class="swal2-input" type="text" placeholder="Nombre">' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage4" style="display:none;"></span>' +
                '<input maxlength="29" oninput="onTheFlyCheck(this.id)" id="swal-input5" class="swal2-input" type="text" placeholder="Apellido">' +
                '<span class="onTheFlyMessage" id="onTheFlyMessage5" style="display:none;"></span>' +
                '<div id="captchaContainer"> <img id="captchaImg"></img > </div>' +
                '<input style="width: 90%" id="swal-input6" class="swal2-input" type="text" placeholder="Solución Captcha">' +
                '<img src="../assets/refreshIcon.png" id="refreshCaptchaIcon" onclick="getCaptcha()"></img>' +
                '<img src="../assets/refreshIcon.png" onload="callAndSelfDestruct()" id="heroicImage" style="display:none"></img>',
            confirmButtonText: 'ACEPTAR',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#ea5f32',
            showCancelButton: true,
            cancelButtonText: 'CANCELAR',
            cancelButtonColor: '#999999',
            focusConfirm: false,
            footer: '<input type="checkbox" id="checkbox"><a href>He leido y acepto los terminos y condiciones</a>',
            showClass: {
                popup: openAnimation
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown'
            },
            preConfirm: () => {
                var passwordPattern = /([a-zA-Z0-9_.\-\/@*]{5,30})$/gm;
                var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{2,3}$/ig;
                var namePattern = /^([a-zA-Z]{3,14}){1}\s?([a-zA-Z]{3,14}){0,1}$/ig;
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
                        userIsBlocked: false,
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
                        userIsBlocked: false,
                    };

                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Hubo un problema con el formulario, intenta de nuevo',
                        confirmButtonColor: '#ea5f32',
                    })
                }
                //password check
                if (signUpData.password == '') {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir una password',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 2;
                            openAnimation = 'animate__animated animate__shakeX';
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.passwordIsEmpty = true;
                    failOn.passwordIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);


                } else if (signUpData.password.search(passwordPattern)) {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 2;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.passwordIsEmpty = false;
                    failOn.passwordIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);

                } else {
                    failOn.passwordIsEmpty = false;
                    failOn.passwordIsIncorrect = false;
                }
                //password2 check
                if (password2 == '') {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes confirmar tu password',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 3;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.password2IsEmpty = true;
                    failOn.password2IsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);

                } else if (password2.search(passwordPattern)) {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 3;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.password2IsEmpty = false;
                    failOn.password2IsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);
                } else {
                    failOn.password2IsEmpty = false;
                    failOn.password2IsIncorrect = false;
                }
                //email check
                if (signUpData.email == '') {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir un e-mail',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.emailIsEmpty = true;
                    failOn.emailIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);

                } else if (signUpData.email.search(mailPattern)) {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'E-mail invalido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.emailIsEmpty = false;
                    failOn.emailIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);
                } else {
                    failOn.emailIsEmpty = false;
                    failOn.emailIsIncorrect = false;
                }
                //userName check
                if (signUpData.userName == '') {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir tu nombre',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 4;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.userNameIsEmpty = true;
                    failOn.userNameIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);

                } else if (signUpData.userName.search(namePattern)) {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'E-mail invalido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.userNameIsEmpty = false;
                    failOn.userNameIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);
                } else {
                    failOn.userNameIsEmpty = false;
                    failOn.userNameIsIncorrect = false;
                }
                //userLastName check
                if (signUpData.userLastName == '') {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'Debes introducir tu apellido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 5;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.userLastNameIsEmpty = true;
                    failOn.userLastNameIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);

                } else if (signUpData.userLastName.search(namePattern)) {
                    /*MySwal.fire({
                        icon: 'error',
                        title: 'Algo salió mal :(',
                        text: 'E-mail invalido',
                        confirmButtonColor: '#ea5f32',
                        onClose: () => {
                            failOn = 1;
                            SignUpForm(signUpData, password2);
                        }
                    })*/
                    failOn.userLastNameIsEmpty = false;
                    failOn.userLastNameIsIncorrect = true;
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);
                } else {
                    failOn.userLastNameIsEmpty = false;
                    failOn.userLastNameIsIncorrect = false;
                }
                //passwords combination check
                if (!failOn.passwordIsEmpty && !failOn.password2IsEmpty) {
                    if (signUpData.password !== password2) {
                        /*MySwal.fire({
                            icon: 'error',
                            title: 'Algo salió mal :(',
                            text: 'Ambas passwords deben coincidir',
                            confirmButtonColor: '#ea5f32',
                            onClose: () => {
                                failOn = 6;
                                SignUpForm(signUpData, password2);
                            }
                        })*/
                        failOn.passwordsCombinationAreIncorrect = true;
                    } else {
                        failOn.passwordsCombinationAreIncorrect = false;
                    }
                    //openAnimation = 'animate__animated animate__shakeX';
                    //SignUpForm(signUpData, password2);
                }
                //email equal password check
                if (!failOn.emailIsEmpty && !failOn.passwordIsEmpty) {
                    if (!failOn.emailIsIncorrect && !failOn.passwordIsIncorrect) {
                        if (signUpData.password === signUpData.email) {
                            /*MySwal.fire({
                                icon: 'question',
                                title: 'Es en serio?',
                                text: 'Tu password no puede ser igual que tu email, piensa en tu seguridad!!',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    failOn.passwordEqualMail = true;
                                    openAnimation = 'animate__animated animate__shakeX';
                                    SignUpForm(signUpData, password2);
                                }
                            })*/
                            failOn.passwordEqualMail = true;
                        } else {
                            failOn.passwordEqualMail = false;
                        }
                    } else {
                        failOn.passwordEqualMail = false;
                    }
                } else {
                    failOn.passwordEqualMail = false;
                }

                let captchaInput = document.getElementById('swal-input6').value;
                return fetch(`/captcha?captchaSolution=${captchaInput}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                    .then(captchaResultResponse => {
                        if (captchaResultResponse.status === 200) {
                            failOn.captcha = false;
                            //do signUp fecht
                        } else if (captchaResultResponse.status === 403) {
                            failOn.captcha = true;
                        } else if (captchaResultResponse.status === 500) {
                            failOn.captcha = true;
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
                        // checking if all inputs were ok
                        if (Object.values(failOn).every(isFalse)) {

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
                                        console.log('Registro exitoso');
                                        Toast.fire({
                                            icon: 'success',
                                            title: 'Registro Exitoso redireccionando al Home...'
                                        })
                                    } else if (response.status === 403) {
                                        MySwal.fire({
                                            icon: 'error',
                                            title: 'Oh no !!',
                                            text: 'El email ya esta en uso',
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
                            /*.catch(error => {
                                Swal.showValidationMessage(
                                    `Algo falló: ${error}`
                                )
                            })*/

                        } else if (failOn.passwordEqualMail) {
                            MySwal.fire({
                                icon: 'question',
                                title: 'Es en serio?',
                                text: 'Tu password no puede ser igual que tu email, piensa en tu seguridad!!',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    openAnimation = 'animate__animated animate__shakeX';
                                    SignUpForm(signUpData, password2);
                                }
                            })
                        } else if (failOn.passwordsCombinationAreIncorrect) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Algo salió mal :(',
                                text: 'Ambas passwords deben coincidir',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    openAnimation = 'animate__animated animate__shakeX';
                                    SignUpForm(signUpData, password2);
                                }
                            })
                        } else {
                            //console.log(failOn);
                            openAnimation = 'animate__animated animate__shakeX';
                            SignUpForm(signUpData, password2);
                        }
                    })
            }
        })

    }
}



