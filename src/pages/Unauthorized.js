import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Unauthorized.scss';

const Unauthorized = () => {
    return (
        <div className='container'>
            <div class="gandalf">
                <div class="fireball"></div>
                <div class="skirt"></div>
                <div class="sleeves"></div>
                <div class="shoulders">
                    <div class="hand left"></div>
                    <div class="hand right"></div>
                </div>
                <div class="head">
                    <div class="hair"></div>
                    <div class="beard"></div>
                </div>
            </div>
            <div class="message">
                <h1>403 - You Shall Not Pass</h1>
                <p>Oh no!, Gandalf bloquea el camino!<br />Puede ser que hayas tipiado una url? O hayas querido ir a un lugar distinto?, como el Hobbit?</p>
            </div>
            <p><Link to='/'>Volver a la página principal</Link></p>
        </div>
    )
}

export default Unauthorized;
