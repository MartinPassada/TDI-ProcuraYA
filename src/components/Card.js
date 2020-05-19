import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import SignUpForm from './SignUpForm'
import 'mdbreact/dist/css/mdb.css';

export default function Card(props) {

    return (
        <MDBCol style={{ maxWidth: "22rem" }}>
            <MDBCard>
                <MDBCardImage className="img-fluid"
                    src={props.cardImage}
                    waves />
                <MDBCardBody>
                    <MDBCardTitle>{props.cardName}</MDBCardTitle>
                    <MDBCardText>{props.cardInfo}</MDBCardText>
                    <MDBBtn gradient="peach" onClick={SignUpForm(props.type)}>Crear Cuenta</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
    )
}
