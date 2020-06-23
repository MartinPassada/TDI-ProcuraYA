import React, { Component } from 'react'
import SunEditor, { buttonList } from "suneditor-react";
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Trash from '../assets/trash.png'
import 'suneditor/dist/css/suneditor.min.css';

export default class FileUploadForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            count: 0,
            bodies: [],
        }

    }
    handleChange(content) {
        console.log(content);
        var file = {
            header: {
                Expediente: document.getElementById('fileID').value,


            },
            body: '',
        }
    }

    newBody = (key) => {
        return <Card>
            <Accordion.Toggle as={Card.Header} eventKey={key}>
                Cuerpo {key}
                <img id={key} style={{ float: "inline-end", width: "25px", height: "25px", cursor: 'pointer' }}
                    onClick={() => { /*this.deleteBody(key)*/ }} src={Trash}></img>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={key}>
                <Card.Body>
                    <SunEditor charCounter mode='balloon' onChange={() => { this.handleChange() }} lang="es" enableToolbar={true} showToolbar={true} setOptions={{
                        height: 200,
                        buttonList: [['font', 'align', 'image', 'fontColor', 'fontSize', 'link', 'video', 'audio', 'textStyle', 'list', 'save']],
                        // Or Array of button list, eg. [['font', 'align'], ['image']]
                        // Other option
                    }} />
                </Card.Body>
            </Accordion.Collapse>
        </Card >
    }
    addBody = () => {
        /*let lastKey = this.state.bodies.length;
        lastKey++*/
        this.setState({ count: this.state.bodies.length + 1 });
        this.setState({ bodies: this.state.bodies.concat(this.newBody(this.state.count + 1)) })
    };

    deleteBody = (i) => {
        console.log(i)
        let a = window.event.target;
        let row = a.parentNode.parentNode;
        row.parentNode.removeChild(row);
        this.setState({ count: this.state.bodies.length - 1 });
        this.setState(state => {
            const bodies = state.bodies.filter((item, j) => i !== j);

            return {
                bodies,
            };
        });
    }



    render() {
        return (
            <>
                <Accordion defaultActiveKey="1">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Cabecera de Expediente
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <label class='FileHeaderLabels'>
                                    Expediente:
                                    <input type="text" placeholder="Nro de expediente" class='FileHeaderInputs' id='fileID' />
                                </label>
                                <label class='FileHeaderLabels'>
                                    Jurisdicción:
                                    <input type="text" placeholder="Jurisdiccion" class='FileHeaderInputs' id='location'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Dependencia:
                                    <input type="text" placeholder="Dependencia" class='FileHeaderInputs'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Situacion Actual:
                                    <input type="text" placeholder="Situacion Actual" class='FileHeaderInputs'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Carátula:
                                    <input type="text" placeholder="Cataruta" class='FileHeaderInputs'></input>
                                </label>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    {
                        this.state.bodies.map(b => {
                            return b
                        })
                    }
                    <Button onClick={this.addBody}>Agregar Cuerpo</Button>
                    <Button>Cargar Expediente</Button>
                </Accordion>

            </>
        )
    }

}


