import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'


export default function WelcomeButton() {
    return (

        <div class='WelcomeButton'>
            <a class="btn" onClick={LoginForm}>
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