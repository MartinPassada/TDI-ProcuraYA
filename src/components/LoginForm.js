import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    onAfterClose: () => {

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
        imageUrl: 'https://raw.githubusercontent.com/MartinPassada/TDI-ProcuraYA/master/src/assets/LOGO1.png',
        imageWidth: 250,
        imageHeight: 250,
        title: 'Iniciar Sesión',
        html:
            '<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">' +
            '<input id="swal-input2" class="swal2-input" type="password" placeholder="Password">',
        confirmButtonText: 'ACEPTAR',
        confirmButtonColor: '#ea5f32',
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        cancelButtonColor: '#999999',
        focusConfirm: false,
        preConfirm: () => {
            var loginData = {
                email: document.getElementById("swal-input1").value,
                password: document.getElementById("swal-input2").value

            };
            var passwordPattern = /^([a-zA-Z0-9_.-@*]{5,15})$/gm;
            var mailPattern = /^\w+([\.-]?\w{1,10}){0,3}@\w+\.{1,1}\w{3,3}$/ig;


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
                    text: 'La password debe tener entre 5 y 15 caracteres y no debe contener caracteres invalidos',
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
                Toast.fire({
                    icon: 'success',
                    title: 'Logueo Exitoso (aún no hay backend)'
                })
            }
        }
    })
}




