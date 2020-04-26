import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';

export default function Card(props) {

    return (
        <MDBCol style={{ maxWidth: "22rem" }}>
            <MDBCard>
                {/*<MDBCardImage className="img-fluid" 
                src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
                waves />*/}
                <MDBCardImage className="img-fluid"
                    src={props.cardImage}
                    waves />
                <MDBCardBody>
                    <MDBCardTitle>{props.cardName}</MDBCardTitle>
                    <MDBCardText>{props.cardInfo}</MDBCardText>
                    <MDBBtn href="#">Crear Cuenta</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
    )
}
