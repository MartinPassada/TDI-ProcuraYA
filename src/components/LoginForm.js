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
        window.location.replace('/Home')
    }
})



export default function LoginForm(loginData) {
    if (loginData.email == undefined || loginData.password == undefined) {
        var LastEmail = '';
        var LastPassword = '';
    } else {
        var LastEmail = loginData.email;
        var LastPassword = loginData.password;
    }

    MySwal.fire({
        onOpen: () => {
            document.getElementById("swal-input1").value = LastEmail;
            document.getElementById("swal-input2").value = LastPassword;
        },
        //imageUrl: 'https://raw.githubusercontent.com/MartinPassada/TDI-ProcuraYA/master/src/assets/LOGO1.png',
        imageUrl: logo,
        imageWidth: 250,
        imageHeight: 250,
        title: 'Iniciar Sesión',
        html:
            '<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
            '<input id="swal-input2" class="swal2-input" type="password" placeholder="Password">',
        confirmButtonText: 'ACEPTAR',
        showLoaderOnConfirm: true,
        confirmButtonColor: '#ea5f32',
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        cancelButtonColor: '#999999',
        focusConfirm: false,
        allowEnterKey: true,
        footer: '<a href=/ResetPassword> Restablecer contraseña</a>',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutDown'
        },
        preConfirm: () => {
            var loginData = {
                email: document.getElementById("swal-input1").value,
                password: document.getElementById("swal-input2").value

            };
            var passwordPattern = /([a-zA-Z0-9_.\-\/@*]{5,30})$/gm;
            var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{2,3}$/ig;


            if (loginData.password == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir una password',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        LoginForm(loginData);
                    }
                })

            } else if (loginData.email == '') {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'Debes introducir un e-mail',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        LoginForm(loginData);
                    }
                })

            } else if (loginData.email.search(mailPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'E-mail invalido',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        LoginForm(loginData);
                    }
                })

            }
            else if (loginData.password.search(passwordPattern)) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Algo salió mal :(',
                    text: 'La password debe tener entre 5 y 30 caracteres y no debe contener caracteres invalidos',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        LoginForm(loginData);
                    }
                })

            } else if (loginData.password === loginData.email) {
                MySwal.fire({
                    icon: 'question',
                    title: 'Es en serio?',
                    text: 'Tu password no puede ser igual que tu email, piensa en tu seguridad!',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        LoginForm(loginData);
                    }
                })
            }
            else {
                return fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                })
                    .then(response => {
                        if (response.status === 200) {
                            Toast.fire({
                                icon: 'success',
                                title: 'Logueo exitoso redireccionando al Home...'
                            })
                        } else if (response.status === 403 || response.status === 404) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Oh no !!',
                                text: 'Las credenciales no son validas',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    LoginForm(loginData);
                                }
                            })
                        } else if (response.status === 500) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: 'Tuvimos un problemita...',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    LoginForm(loginData);
                                }
                            })
                        } else if (response.status === 603) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Usuario Bloqueado',
                                text: 'Debido a los intentos fallidos, hemos bloqueado tu cuenta por razones de seguridad',
                                confirmButtonColor: '#ea5f32',
                                onClose: () => {
                                    LoginForm(loginData);
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




