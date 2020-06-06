import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';
import mglassIcon from '../assets/mglass.png'
import crossIcon from '../assets/cross.png'
import trashIcon from '../assets/trash.png'
import sendIcon from '../assets/send.png'
import backIcon from '../assets/back.png'
import refreshButton from '../assets/refreshIcon.png'
import refreshButtonGif from '../assets/refreshGif.gif'
import $ from 'jquery';
import fileIcon from '../assets/paper.png'


function showButtons(e) {
    e = e || window.event;
    var row = e.target.parentNode.childNodes[1];
    row.childNodes.forEach(b => {
        $(b).fadeToggle('fast');
    });

}


export default class ControlPanel extends Component {
    state = {
        files: []
    }
    async componentDidMount() {
        let RB = document.getElementById('refreshButton');
        RB.src = refreshButtonGif;
        const res = await fetch('https://jsonplaceholder.typicode.com/albums');
        const data = await res.json();
        //console.log(data);
        this.setState({ files: data });
        RB.src = refreshButton;
    }

    handleUpdate = async () => {
        let RB = document.getElementById('refreshButton');
        RB.src = refreshButtonGif;
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await res.json();
        //console.log(data);
        this.setState({ files: data });
        RB.src = refreshButton;
    };

    render() {
        return (
            <div>
                <div class='TitleDiv'>
                    <img src={fileIcon} class='titleIcon' id='titleIcon' onClick={this.handleUpdate}></img>
                    <h2 class='ControlPanelTitle'>Expedientes</h2>
                    <img src={refreshButton} class='refreshButton' id='refreshButton' onClick={this.handleUpdate}></img>
                </div>
                <ListGroup>
                    {
                        this.state.files.map(e => {
                            return <div class='ListItemWrapDiv' id='ListItemWrapDiv'>
                                <ListGroup.Item bsPrefix='list-group-item' onClick={showButtons}>{e.title}</ListGroup.Item>
                                <div class='RinnerDiv' id='RinnerDiv'>
                                    <img class='FilesListButton' src={mglassIcon}></img>
                                    <img class='FilesListButton' src={sendIcon}></img>
                                    <img class='FilesListButton' src={backIcon}></img>
                                    <img class='FilesListButton' src={crossIcon}></img>
                                    <img class='FilesListButton' src={trashIcon}></img>
                                </div>
                            </div>
                        })
                    }
                </ListGroup>
            </div>
        )
    }

}

