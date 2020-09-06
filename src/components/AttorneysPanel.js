import AttorneyCard from './AttorneyCard'
import React, { Component } from 'react';
import refreshButtonGif from '../assets/refreshGif.gif'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import $ from 'jquery';
import '../css/AttorneysPanel.css'

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

export default class AttorneysPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            attorneys: [],
            noAttorneysMessage: []
        }
    }

    async componentDidMount() {
        this.createAndMountSpinner();
        let response = await fetch('/getAttorneys');
        if (response.status === 200) {
            let data = await response.json();
            if (data.length === 0) {
                document.getElementById('attorneysDiv').innerHTML = '';
                this.setState({ noAttorneysMessage: ['No tienes procuradores'] });
            } else {
                document.getElementById('attorneysDiv').innerHTML = '';
                data.forEach(e => {
                    let dataSend = {
                        id: e
                    }
                    fetch('/attorneyData', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataSend)
                    }).then(response => {
                        response.json().then(res => {
                            let datares = res;
                            this.state.attorneys.push(datares);
                            this.setState({ attorneys: this.state.attorneys, noAttorneysMessage: [] });
                        })

                    })

                });

            }
        } else if (response.status === 404) {
            Toast.fire({
                icon: 'error',
                title: 'No se encontro nada'
            })
            document.getElementById('attorneysDiv').innerHTML = '';

        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Error de servidor'
            })
            document.getElementById('attorneysDiv').innerHTML = '';
        }

    }

    createAndMountSpinner = () => {
        let spinnerDiv = document.createElement('div');
        spinnerDiv.setAttribute('class', 'spinnerDiv');
        let spinner = document.createElement('img');
        spinner.src = refreshButtonGif;
        spinnerDiv.append(spinner);
        document.getElementById('attorneysDiv').innerHTML = '';
        document.getElementById('attorneysDiv').append(spinnerDiv);
    }

    render() {
        return (
            <div class='attorneysDiv' id='attorneysDiv'>
                {
                    this.state.attorneys.map(a => {
                        return <AttorneyCard attorneyData={a} handleControlPanelUpdate={this.props.handleControlPanelUpdate} />
                    })
                }
                {
                    this.state.noAttorneysMessage.map(m => {
                        return <div>
                            <img alt='lottie'></img>
                            <p>{m}</p>
                        </div>

                    })
                }
            </div>

        )
    }




}