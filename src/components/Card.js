import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import SaveType from './SignUpForm'
import 'mdbreact/dist/css/mdb.css';

export default function Card(props) {
    const handleEvent = () => {
        SaveType(props.type);
    }
    return (
        <MDBCol style={{ maxWidth: "22rem" }}>
            <MDBCard>
                <MDBCardImage className="img-fluid"
                    src={props.cardImage}
                    waves />
                <MDBCardBody>
                    <MDBCardTitle>{props.cardName}</MDBCardTitle>
                    <MDBCardText>{props.cardInfo}</MDBCardText>
                    <MDBBtn gradient="peach" onClick={handleEvent}>Crear Cuenta</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
    )
}
