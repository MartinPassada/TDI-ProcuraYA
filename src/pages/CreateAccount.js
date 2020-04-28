import React, { Fragment } from 'react';
//images
import bagImg from '../assets/bag.png';
import hammerImg from '../assets/hammer.png';
import paperImg from '../assets/paper.png';
import secretaryImg from '../assets/secretary.png';
import lawyer2Img from '../assets/lawyer2.png';
import lawyer1Img from '../assets/lawyer1.png';
//css
import '../css/CreateAccount.css';
//components
import FooterPage from '../components/Footer';
import Card from '../components/Card';



export default function CreateAccount() {
    return (
        <>
            <div class="wrap">
                <div class="fleft" id='fleft'>
                    <div class='Title' id='Title'>
                        <h1 class='AccountType'>Crear Cuenta Procurador</h1>
                    </div>
                    <div class='CardContainer'>
                        <Card cardName='Crear cuenta Procurador'
                            cardInfo='Encargado de acudir a los juzgados para efectuar tramites administrativos, diligencias, envio y retiro de expedientes'
                            cardImage={lawyer1Img} />
                    </div>
                </div>
                <div class="fright" id='fright'>
                    <div class='Title' id='Title'>
                        <h1 class='AccountType'>Crear Cuenta Mandatario</h1>
                    </div>
                    <div class='CardContainer'>
                        <Card cardName='Crear cuenta Mandatario'
                            cardInfo='Encarga tareas a sus procuradores, esta es una cuenta recomendada para abogados, peritos, contadores etc'
                            cardImage={hammerImg} />
                    </div>
                </div>
            </div>
            <FooterPage />

        </>

    );
}