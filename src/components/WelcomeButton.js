import React, { useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function WelcomeButton() {

    const MySwal = withReactContent(Swal);
    const [loginFormState, setLoginFormState] = useState(false);
    const showLoginForm = () => {
        MySwal.fire({
            title: <p>Login</p>,
            input: 'text',
            inputPlaceholder: 'Ingresa tu email',
            confirmButtonText: 'Listo',

            onClose: () => {
                MySwal.fire({
                    title: <p>Ingresa tu password</p>,
                    input: 'password',
                    inputPlaceholder: 'Ingresa tu password',
                    confirmButtonText: 'Listo',
                })
            }
        })
    }
    return (

        <div class='WelcomeButton'>
            <a class="btn" onClick={showLoginForm}>
                <svg width="277" height="62">
                    <defs>
                        <linearGradient id="grad1">
                            <stop offset="0%" stop-color="#FF8282" />
                            <stop offset="100%" stop-color="#E178ED" />
                        </linearGradient>
                    </defs>
                    <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
                </svg>
                <span>INGRESAR A LA WEB</span>
            </a>
        </div>
    )
}