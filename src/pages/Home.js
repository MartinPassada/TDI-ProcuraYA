import React from 'react';
import Footer from '../components/Footer'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import NavigationBar from '../components/NavigationBar'
import ControlPanel from '../components/ControlPanel'
import RightPanel from '../components/RightPanel'
import '../css/Home.css';
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
        window.location.replace('/Home')
    }
})

/*const checkAuth = () => {
    fetch('/checkAuth', {
        method: 'GET',
    })
        .then(response => {
            if (response.status === 200) {
            } else if (response.status === 403) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oh no !!',
                    text: 'No puedes entrar sin loguearte',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        window.location.replace('/');
                    }
                })
            } else if (response.status === 500) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'Tuvimos un problemita...',
                    confirmButtonColor: '#ea5f32',
                    onClose: () => {
                        window.location.replace('/');
                    }
                })
            }

        })
        .catch(error => {
            Swal.showValidationMessage(
                `Algo falló: ${error}`
            )
        })
}*/
export default function Home() {

    //checkAuth();
    return (
        <>
            <NavigationBar fixed="top" />
            <div class="Hwrap">
                <div class="Hfleft" id='fleft'>
                    <ControlPanel />
                </div>
                <div class="Hfright" id='fright'>
                    <RightPanel />
                </div>
            </div>
            <Footer fixed='bottom' />
        </>
    );
}