import LocationCard from './LocationCard'
import React, { Component } from 'react';
import refreshButtonGif from '../assets/refreshGif.gif'
import Swal from 'sweetalert2'
import ExtendSession from './ExtendSesion'
import withReactContent from 'sweetalert2-react-content'
import $ from 'jquery';
import '../css/LocationsPanel.css'

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

export default class LocationsPannel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            noLocationsMessage: []
        }
    }

    async componentDidMount() {
        this.createAndMountSpinner();
        let response = await fetch('/getLocations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });
        if (response.status === 200) {
            let data = await response.json();
            if (data.length === 0) {
                document.getElementById('locationsDiv').innerHTML = '';
                this.setState({ noLocationsMessage: ['No encontramos nada'] });
            } else {
                document.getElementById('locationsDiv').innerHTML = '';
                this.state.locations = data;
                //console.log(this.state)
                this.setState({ locations: this.state.locations, noLocationsMessage: [] });
            }
        } else if (response.status === 404) {
            Toast.fire({
                icon: 'warning',
                title: 'No se encontro nada'
            })
            document.getElementById('locationsDiv').innerHTML = '';

        } else if (response.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Server error'
            })
            document.getElementById('locationsDiv').innerHTML = '';
        } else if (response.status === 403) {
            document.getElementById('locationsDiv').innerHTML = '';
            await ExtendSession();
        }

    }

    createAndMountSpinner = () => {
        let spinnerDiv = document.createElement('div');
        spinnerDiv.setAttribute('class', 'spinnerDiv');
        let spinner = document.createElement('img');
        spinner.src = refreshButtonGif;
        spinnerDiv.append(spinner);
        document.getElementById('locationsDiv').innerHTML = '';
        document.getElementById('locationsDiv').append(spinnerDiv);
    }

    render() {
        return (
            <div class='locationsDiv' id='locationsDiv'>
                {

                    this.state.locations.map(e => {
                        return <LocationCard locationsData={e} handleControlPanelUpdate={this.props.handleControlPanelUpdate} userData={this.props.userData} />
                    })
                }
                {
                    this.state.noLocationsMessage.map(m => {
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