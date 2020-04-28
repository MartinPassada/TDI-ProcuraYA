import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import reactLogo from '../assets/logo192.png'
import nodeLogo from '../assets/NodeLogo.png'
import mongoLogo from '../assets/MongoLogo.png'
import expressLogo from '../assets/ExpressLogo.png'
import '../css/Footer.css'

const Footer = () => {
    return (
        <MDBFooter color="black" className="Footer">
            <MDBContainer fluid className="text-center text-md-left">
                <MDBRow>
                    <MDBCol md="6">
                        <h3 className="title">SPONSORS</h3>
                        <div class="container">
                            <div class='LeftColumnDiv'>
                                <img class='Logo' src={mongoLogo}></img>
                            </div>
                            <div class='CenterColumnDiv'>
                                <img class='Logo' src={expressLogo}></img>
                            </div>
                            <div class='CenterColumnDiv'>
                                <img class='Logo' src={reactLogo}></img>
                            </div>
                            <div class='RightColumnDiv'>
                                <img class='Logo' src={nodeLogo}></img>
                            </div>
                        </div>

                    </MDBCol>
                    <MDBCol md="6">
                        <h5 className="title">Links</h5>
                        <ul>
                            <li className="list-unstyled">
                                <a href="#!">Terminos y Condiciones</a>
                            </li>
                            <li className="list-unstyled">
                                <a href="#!">Politica de Privacidad</a>
                            </li>
                            <li className="list-unstyled">
                                <a href="#!">Link 3</a>
                            </li>
                            <li className="list-unstyled">
                                <a href="#!">Link 4</a>
                            </li>
                        </ul>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <div className="BottomFooter">
                <MDBContainer fluid>
                    &copy; {new Date().getFullYear()} Copyright: <a class='PageName' href="www.Github.com"> Procuraya.com </a>
                </MDBContainer>
            </div>
        </MDBFooter>
    );
}

export default Footer;