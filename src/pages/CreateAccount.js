import React, { Fragment } from 'react';
//images
import bagImg from '../assets/bag.png';
import hammerImg from '../assets/hammer.png';
import lawyerbywImg from '../assets/lawyerbyw.png';
import misbywImg from '../assets/misbyw.png';
import misbyw2Img from '../assets/misbyw2.jpg';
import paperImg from '../assets/paper.png';
import secretaryImg from '../assets/secretary.png';
import lawyer2Img from '../assets/lawyer2.png';
import lawyer1Img from '../assets/lawyer1.png';
//css
import '../css/CreateAccount.css';
import FooterPage from '../components/FooterPage';



export default function CreateAccount() {
    return (
        <>
            <div class="wrap">
                <div class="fleft" id='fleft'>
                    <div class='Title' id='Title'>
                        <h1 class='AccountType'>Crear Cuenta Procurador</h1>
                        {/*<img src={bagImg}></img>
                    <img src={paperImg}></img>
                    <img src={secretaryImg}></img>
                    <img src={lawyer1Img}></img>*/}
                    </div>
                    <img src={misbywImg} class='Imagen1'></img>
                </div>
                <div class="fright" id='fright'>
                    <div class='Title' id='Title'>
                        <h1 class='AccountType'>Crear Cuenta Mandatario</h1>
                        {/*<img src={hammerImg}></img>
                    <img src={lawyer2Img}></img>*/}
                    </div>
                    <img src={lawyerbywImg} class='Imagen2'></img>
                </div>
            </div>
            <FooterPage />
        </>

    );
}