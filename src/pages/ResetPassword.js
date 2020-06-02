import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Logo from '../assets/LOGO1.png';
import ResetPasswordForm from '../components/ResetPasswordForm'
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

export default function ResetPassword() {
    return (
        <>
            <ResetPasswordForm />
        </>
    );
}