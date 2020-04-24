import React, { Component } from 'react';
import '../css/LoginForm.css';

class LoginForm extends Component {
    render() {
        return (
            <section class="loginForm" id="loginForm" >
                <div class="overlay"></div>

                <div class="background-image-login"></div>
                <h1 class="login-h1">INGRESAR</h1>
                <div class="login-container">

                    <img class="crossForCloseImg" id="crossForCloseImg" alt="" src="img/crossforclose.png" onClick={this.props.closeLoginForm} height="25px" width="25px"></img>
                    <img class="logoImage" src="img/logo.png" alt="" height="105px" width="105px"></img>

                    <form class="form" action="">
                        <label>
                            <input class="e-mail" id="e-mail" type="text" placeholder="E-mail o Usuario" />
                        </label>
                        <label>
                            <input class="password" id="password" type="password" placeholder="Password" />
                        </label>

                        <div class="loginFormLinksDiv" id="loginFormLinksDiv">

                        </div>
                    </form>
                </div>
            </section>
        )
    }
}



export default LoginForm;
