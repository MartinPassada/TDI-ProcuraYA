import React, { Component } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import $ from 'jquery';

export default class FileUploadForm extends Component {
    state = {

    }
    async componentDidMount() { }



    render() {
        return (
            /*<>
                <div class='fileHeader' id='fileHeader'>
                    <h4>Cabecera de expediente</h4>
                    <label>
                        Expediente:
                    </label>
                    <input type="text" placeholder="nro de expediente" />
                    <label>
                        Jurisdicción:
                    </label>
                    <input></input>
                    <label>
                        Dependencia:
                    </label>
                    <input></input>
                    <label>
                        Situacion Actual:
                    </label>
                    <input></input>
                    <label>
                        Carátula:
                    </label>
                    <input></input>

                </div>
            </>*/
            <>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </>
        )
    }

}


