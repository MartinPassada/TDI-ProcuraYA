import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import mglassIcon from '../assets/mglass.png'
import crossIcon from '../assets/cross.png'
import trashIcon from '../assets/trash.png'
import sendIcon from '../assets/send.png'
import backIcon from '../assets/back.png'
import refreshButton from '../assets/refreshIcon.png'
import refreshButtonGif from '../assets/refreshGif.gif'
import noSearchResultImg from '../assets/nosearchresult.jpg'
import AttorneysPanel from './AttorneysPanel'
import $ from 'jquery';
import fileIcon from '../assets/paper.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//MATERIAL UI
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';



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
/*function showButtons(e) {
    e = e || window.event;
    var row = e.target.parentNode.childNodes[1];
    row.childNodes.forEach(b => {
        $(b).fadeToggle('fast');
    });
}*/
export default class ControlPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userFiles: [],
            noFilesMessage: [],
            indexSelected: null,
            fileSelected: null,
            userData: {},
        }
    }
    async componentDidMount() {
        const response = await fetch('/getUserInfo');
        var data = await response.json();
        this.setState({ userData: data })


        let RB = document.getElementById('refreshButton');
        RB.src = refreshButtonGif;
        const res = await fetch('/getUserFilesIDList');
        if (res.status === 404) {
            RB.src = refreshButton;
            Toast.fire({
                icon: 'error',
                title: 'No estas logueado'
            })
        } else if (res.status === 500) {
            RB.src = refreshButton;
            Toast.fire({
                icon: 'error',
                title: 'Server Error'
            })
        } else if (res.status === 200) {
            const data = await res.json();
            if (data.length === 0) {
                this.setState({ noFilesMessage: ['No tienes expedientes, intenta cargar uno...'], userFiles: data })
                RB.src = refreshButton;
            } else {
                this.setState({ userFiles: data, noFilesMessage: [] });
                RB.src = refreshButton;
            }
        }
    }
    handleUpdate = async () => {
        let RB = document.getElementById('refreshButton');
        RB.src = refreshButtonGif;
        const res = await fetch('/getUserFilesIDList');
        if (res.status === 404) {
            RB.src = refreshButton;
            Toast.fire({
                icon: 'error',
                title: 'No estas logueado'
            })
        } else if (res.status === 500) {
            RB.src = refreshButton;
            Toast.fire({
                icon: 'error',
                title: 'Server Error'
            })
        } else if (res.status === 200) {
            const data = await res.json();
            if (data.length === 0) {
                this.setState({ noFilesMessage: ['No tienes expedientes, intenta cargar uno...'], userFiles: data })

                RB.src = refreshButton;
            } else {
                this.setState({ userFiles: data, noFilesMessage: [] });
                RB.src = refreshButton;
            }
        }
    };
    searchFile = () => {
        let fileID = this.state.fileSelected
        if (fileID === null) {
            Toast.fire({
                icon: 'warning',
                title: 'Selecciona un expediente para verlo'
            })
        } else {
            this.createAndMountSpinner();
            fetch(`/getFile?id=${fileID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.status === 500) {
                        ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
                        document.getElementById('fright').innerHTML = '';
                        Toast.fire({
                            icon: 'error',
                            title: 'Server error',
                        })
                    } else if (response.status === 404) {
                        ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
                        document.getElementById('fright').innerHTML = '';
                        Toast.fire({
                            icon: 'question',
                            title: 'No hemos encontrado el expediente',
                        })
                    } else if (response.status === 403) {
                        Toast.fire({
                            icon: 'error',
                            title: 'No tienes acceso a este expediente'
                        })
                    } else if (response.status === 200) {
                        const data = response.json()
                            .then(data => {
                                let fileDiv = document.createElement('div');
                                fileDiv.setAttribute('class', 'fileContainer');
                                fileDiv.setAttribute('id', 'fileContainer');
                                let headerDiv = document.createElement('div');
                                headerDiv.setAttribute('class', 'fileHeaderDiv');
                                headerDiv.setAttribute('id', 'fileHeaderDiv');
                                let bodyDiv = document.createElement('div');
                                bodyDiv.setAttribute('class', 'sun-editor-editable');
                                //Body
                                if (data.bodies !== null && data.bodies !== undefined) {
                                    let htmlBody = $(data.bodies.content).toArray();
                                    htmlBody.forEach(htmlElement => {
                                        bodyDiv.append(htmlElement);
                                    })
                                } else {
                                    bodyDiv.append('No hay cuerpos que mostrar')
                                }
                                //Header
                                let headerTable = this.createHeader(data);

                                headerDiv.append(headerTable);
                                let division = document.createElement('hr');
                                division.setAttribute('class', 'division');
                                let headerTitle = document.createElement('h3');
                                headerTitle.setAttribute('class', 'headerTitle');
                                headerTitle.innerHTML = 'Datos Generales';
                                fileDiv.append(headerTitle, headerDiv, division, bodyDiv);
                                ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
                                document.getElementById('fright').innerHTML = '';
                                document.getElementById('fright').appendChild(fileDiv);
                            })
                    }
                })
        }

    }
    getAttorneysPanel = () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
        document.getElementById('fright').innerHTML = '';
        ReactDOM.render(<AttorneysPanel handleControlPanelUpdate={this.handleUpdate} />, document.getElementById("fright"))
    }
    createHeader = (data) => {
        var t = document.createElement('table');
        t.setAttribute('class', 'headerTable');

        let r1 = t.insertRow(0);
        let c1 = r1.insertCell(0);
        let c1d = r1.insertCell(1);
        c1d.innerHTML = data.fileID;
        c1.innerHTML = 'Expediente';
        c1.setAttribute('class', 'tableCellTitle');

        let r2 = t.insertRow(1);
        let c2 = r2.insertCell(0);
        let c2d = r2.insertCell(1);
        c2d.innerHTML = data.fileLocation;
        c2.innerHTML = 'Jurisdicción';
        c2.setAttribute('class', 'tableCellTitle');

        let r3 = t.insertRow(2);
        let c3 = r3.insertCell(0);
        let c3d = r3.insertCell(1);
        c3d.innerHTML = data.locationRoom;
        c3.innerHTML = 'Dependencia';
        c3.setAttribute('class', 'tableCellTitle');

        let r4 = t.insertRow(3);
        let c4 = r4.insertCell(0);
        let c4d = r4.insertCell(1);
        c4d.innerHTML = data.fileState;
        c4.innerHTML = 'Situacion Actual';
        c4.setAttribute('class', 'tableCellTitle');

        let r5 = t.insertRow(4);
        let c5 = r5.insertCell(0);
        let c5d = r5.insertCell(1);
        c5d.innerHTML = data.fileTitle;
        c5.innerHTML = 'Carátula';
        c5.setAttribute('class', 'tableCellTitle');

        return t;
    }
    createAndMountSpinner = () => {
        let spinnerDiv = document.createElement('div');
        spinnerDiv.setAttribute('class', 'spinnerDiv');
        let spinner = document.createElement('img');
        spinner.src = refreshButtonGif;
        spinnerDiv.append(spinner);
        ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
        document.getElementById('fright').innerHTML = '';
        document.getElementById('fright').append(spinnerDiv);
    }
    handleListItemClick(event, index) {
        this.state.indexSelected = (index);
        this.setState({ indexSelected: this.state.indexSelected });
    };
    handleFileSelected = (fileID, index) => {
        this.state.fileSelected = (fileID)
        this.setState({ fileSelected: this.state.fileSelected })
        this.state.indexSelected = index;
        this.setState({ indexSelected: this.state.indexSelected })
    }

    render() {

        return (
            <div>
                <div class='TitleDiv'>
                    <img src={fileIcon} class='titleIcon' id='titleIcon' onClick={this.handleUpdate}></img>
                    <h2 class='ControlPanelTitle'>Expedientes</h2>
                    <img src={refreshButton} class='refreshButton' id='refreshButton' onClick={this.handleUpdate}></img>
                    <div class='RinnerDiv' id='RinnerDiv'>
                        <img class='FilesListButton' src={mglassIcon} onClick={() => { this.searchFile() }}></img>
                        <img class='FilesListButton' src={sendIcon}></img>
                        <img class='FilesListButton' src={backIcon}></img>
                        <img class='FilesListButton' src={crossIcon} onClick={() => { this.getAttorneysPanel() }} ></img>
                        <img class='FilesListButton' src={trashIcon}></img>
                    </div>
                </div>
                {
                    this.state.userFiles.length > 0 ?
                        (
                            <div className='listDivRoot' id='listDivRoot'>
                                <List component="nav" dense aria-label="main mailbox folders">
                                    {

                                        this.state.userFiles.map(function (e, index) {

                                            return (
                                                <ListItem
                                                    button
                                                    selected={this.state.indexSelected === index}
                                                    onClick={(event) => this.handleFileSelected(e.fileID, index)}

                                                >
                                                    <ListItemIcon>
                                                        {this.state.userData.type ? (
                                                            <Avatar className='classesSmall' src={e.assignedTo} />
                                                        ) : (
                                                                <Avatar className='classesSmall' src={e.owner} />
                                                            )

                                                        }
                                                    </ListItemIcon>
                                                    <ListItemText primary={'Expediente N°: ' + e.fileID} />
                                                </ListItem >
                                            )


                                        }, this)
                                    }
                                </List>

                            </div>
                        ) : (

                            this.state.noFilesMessage.map(m => {
                                return <div ><img height="300px" width='auto' src={noSearchResultImg}></img>
                                    <p>{m}</p>
                                </div>
                            })

                        )
                }

            </div >
        )
    }

}

