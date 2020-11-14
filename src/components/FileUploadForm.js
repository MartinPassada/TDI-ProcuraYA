import React, { Component } from 'react'
import SunEditor, { buttonList } from "suneditor-react";
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Trash from '../assets/trash.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExtendSessionFn from './ExtendSesion';
import '../css/SunEditor.css'

const MySwal = withReactContent(Swal);
const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    onAfterClose: () => {

    }

})
export default class FileUploadForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            count: 0,
            bodies: [],
            locationsComboBoxOptions: [],
        }
        this.file = {
            header: {
                fileID: '',
                fileLocation: '',
                locationRoom: '',
                fileState: '',
                fileTitle: '',
                fileYear: '',
            },
            body: [],
        }
    }

    async componentDidMount() {
        await fetch('/getLocations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(json => {
                    //console.log(json)
                    if (json.length > 0) {
                        this.state.locationsComboBoxOptions = json
                        this.setState({ locationsComboBoxOptions: this.state.locationsComboBoxOptions })
                    } else {
                        this.setState({ locationsComboBoxOptions: [] })
                    }
                })

            }
        })

    }
    handleChange(content) {
        let bodyContent = { content }
        this.file.body.push(bodyContent);
        console.log(this.file);
    }
    checkEmptyInputs(inputsCollection) {
        var emptyInputs = false;
        inputsCollection.forEach(input => {
            if (input.value == '') {
                input.style.borderColor = 'red';
                emptyInputs = true;
            }
        })
        console.log('empty inputs: ' + emptyInputs);
        if (emptyInputs) { return true } else { return false }
    }
    injectedCode(inputsCollection) {
        //const avoidHackPattern = /^\s*([\s\w\d áéíóú a-zA-Z0-9_+/.:'!’"#ñ,()¿?*=-]{1,8})\s*$/g;
        const avoidHackPattern = /[^ ' " / & #,]/g;
        var injectedInputs = false;
        inputsCollection.forEach(input => {
            if (input.value.search(avoidHackPattern)) {
                input.style.borderColor = 'red';
                injectedInputs = true;
            }
        })
        console.log('injected: ' + injectedInputs);
        if (injectedInputs) { return true } else { return false }
    }
    inputsError(inputsCollection) {
        const onlyNumbersPattern = /^[0-9]*$/gm
        var badInput = false;
        inputsCollection.forEach(input => {
            if (input.id === 'fileID') {
                if (input.value.search(onlyNumbersPattern)) {
                    input.style.borderColor = 'red';
                    badInput = true;
                }
            }
            if (input.id === 'fileState' || input.id === 'fileTitle' || input.id === 'locationRoom') {
                //no deben contener simbolos...añadir validaciónes
            }
        })
        console.log('inputsError: ' + badInput);
        if (badInput) { return true } else { return false }
    }
    async submit(file) {
        let headerInputs = document.querySelectorAll('.FileHeaderInputs');
        if (this.checkEmptyInputs(headerInputs) === false && this.injectedCode(headerInputs) === false && this.inputsError(headerInputs) === false) {
            file.header.fileID = document.getElementById('fileID').value.toUpperCase();
            file.header.fileLocation = document.getElementById('combo').value.toUpperCase();
            file.header.locationRoom = document.getElementById('locationRoom').value.toUpperCase();
            file.header.fileState = document.getElementById('fileState').value.toUpperCase();
            file.header.fileTitle = document.getElementById('fileTitle').value.toUpperCase();
            file.header.fileYear = document.getElementById('fileYear').value.toUpperCase();

            await fetch('/uploadFile', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                body: JSON.stringify(this.file)
            })
                .then(async response => {
                    if (response.status === 200) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Su expediente se ha guardado correctamente'
                        })
                    } else if (response.status === 401) {
                        Toast.fire({
                            icon: 'error',
                            title: 'El expediente ya esta cargado'
                        })
                    } else if (response.status === 500) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Server Error'
                        })
                    } else if (response.status === 403) {
                        await ExtendSessionFn();
                    }
                })
        } else {
            //do nothing
        }
    }

    newBody = (key) => {
        return <div id={key}>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={key}>
                    Cuerpo
                    <img id={key} style={{ float: "inline-end", width: "25px", height: "25px", cursor: 'pointer' }}
                        onClick={() => { this.deleteBody(window.event) }} src={Trash}></img>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={key}>
                    <Card.Body>
                        <SunEditor width="100%" onChange={this.handleChange} lang="es" enableToolbar={true} showToolbar={true} setOptions={{
                            height: 200,
                            buttonList: [['undo', 'redo', 'font', 'bold', 'align', 'image', 'fontColor', 'fontSize', 'link', 'video', 'audio', 'textStyle', 'list', 'save']],
                            // Or Array of button list, eg. [['font', 'align'], ['image']]
                            // Other option
                        }} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card >
        </div>

    }
    addBody = () => {
        this.state.bodies.push(this.newBody(this.state.bodies.length));
        this.setState({ bodies: this.state.bodies });
    };
    deleteBody = (e) => {
        let row = e.target.parentNode.parentNode
        let array = this.state.bodies;
        let found = false;
        let first = true;
        for (let i = 0; i < array.length; i++) {
            if (array[i].props.id == e.target.id) {
                var index = i;
                //console.log('se encontro en el objeto posicion  ' + index + ' del array de state')
                found = true;
            }
            if (found) {
                if (first) {
                    first = false;
                } else {

                    //console.log(array[i].props.children.props.children[0].props.children[1]);
                    //array[i].props.id = array[i].props.id - 1
                }
            }
        }
        /*for (let i = 0; i < array.length; i++) {
            if (i > (index + 1)) {
                console.log(array[i].props.id)
                //array[i].props.id = array[i].props.id - 1
            }
     
        }*/
        array.splice(index, 1);
        this.setState({ bodies: array });
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
                                    Jurisdiccion:
                                    <select id="combo">
                                        {
                                            this.state.locationsComboBoxOptions.map(e => {
                                                return <option value={e.name}>{e.name}</option>
                                            })
                                        }
                                    </select>
                                    {/*<input type="text" placeholder="Jurisdiccion" class='FileHeaderInputs' id='fileLocation'></input>*/}
                                </label>

                                <label class='FileHeaderLabels'>
                                    Dependencia:
                                    <input maxLength='15' type="text" placeholder="Dependencia" class='FileHeaderInputs' id='locationRoom'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Situacion Actual:
                                    <input maxLength='20' type="text" placeholder="Situacion Actual" class='FileHeaderInputs' id='fileState'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Caratula:
                                    <input maxLength='60' type="text" placeholder="Cataruta" class='FileHeaderInputs' id='fileTitle'></input>
                                </label>

                                <label class='FileHeaderLabels'>
                                    Año:
                                    <input maxLength='60' type="text" placeholder="Año" class='FileHeaderInputs' id='fileYear'></input>
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
                    <Button onClick={() => { this.submit(this.file) }}>Cargar Expediente</Button>
                </Accordion>

            </>
        )
    }

}


