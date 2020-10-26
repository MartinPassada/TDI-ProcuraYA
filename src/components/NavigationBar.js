import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import ProcuraYaLogo from '../assets/LOGO1.png'
import UploadFileImg from '../assets/paper.png'
import SearchImg from '../assets/mglass.png'
import FileUploadForm from '../components/FileUploadForm'
import personGrey from '../assets/personGrey.png'
import fileGrey from '../assets/fileGrey.png'
import personOrange from '../assets/personOrange.png'
import fileOrange from '../assets/fileOrange.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AccountConfig from './AccountConfig';
import InboxIcon from '../components/InboxIcon';
import ExtendSessionFn from './ExtendSesion';
import SearchResultList from './SearchResultList'
import '../css/NavigationBar.css'




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
        //window.location.replace('/Home');
    }

})

export default class NavigationBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
        }
    }

    async handleComponentUpdate() {
        var response = await fetch('/getUserInfo', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });
        var data = await response.json();
        this.setState({ userData: data });

    }
    async componentDidMount() {
        var response = await fetch('/getUserInfo', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });
        var data = await response.json();
        this.setState({ userData: data });
    }

    //render component in right panel
    uploadFileFn = () => {
        //ReactDOM.unmountComponentAtNode(document.getElementById('fright'));
        ReactDOM.render(<FileUploadForm />, document.getElementById("fright"))
    }
    openSearchEngine() {
        document.getElementById("myNav").style.height = "100%";
        //document.getElementById('searchInput').focus();
    }
    closeSearchEngine() {
        document.getElementById("myNav").style.height = "0%";
    }
    async searchInBD() {
        let icons = document.querySelectorAll('.searchEngineIcons');
        let searchParameter = document.getElementById('searchInput').value
        let searchResultListDiv = document.getElementById('searchResultListDiv');
        if (icons[0].checked) {
            await fetch(`/searchFriend?searchParameter=${searchParameter}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                }
            }).then(async response => {
                if (response.status === 200) {
                    let results = await response.json();
                    ReactDOM.render(<SearchResultList results={results} type={'friends'} userData={this.state.userData} />, searchResultListDiv)
                } else if (response.status === 403) {
                    await ExtendSessionFn();
                } else if (response.status === 404) {
                    ReactDOM.render(<SearchResultList results={[]} />, searchResultListDiv)
                } else if (response.status === 500) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Server Error'
                    })
                }
            })
            //console.log('personas esta chekeado')
        } else if (icons[1].checked) {
            fetch(`/searchFileInBD?searchParameter=${searchParameter}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                }
            }).then(async response => {
                if (response.status === 200) {
                    let results = await response.json();
                    ReactDOM.render(<SearchResultList results={results} type={'files'} userData={this.state.userData} />, searchResultListDiv)
                } else if (response.status === 403) {
                    await ExtendSessionFn();
                } else if (response.status === 404) {
                    ReactDOM.render(<SearchResultList results={[]} />, searchResultListDiv)
                } else if (response.status === 500) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Server Error'
                    })

                }
            })
            //console.log('files esta chekeado')
        } else {
            Toast.fire({
                icon: 'error',
                title: 'selecciona un tipo de busqueda'
            })
            //console.log('ninguno esta chekeado')
        }
    }


    selectSearchEngineIcon(e) {
        let icons = document.querySelectorAll('.searchEngineIcons');
        //document.getElementById('searchInput').focus();
        if (!e.checked) {
            e.checked = true;
            if (e === icons[0]) {
                e.src = personOrange
                document.getElementById('searchInput').placeholder = 'Busca personas ';
                icons[1].checked = false;
                icons[1].src = fileGrey
            } else {
                e.src = fileOrange
                document.getElementById('searchInput').placeholder = 'Busca expedientes ';
                icons[0].checked = false;
                icons[0].src = personGrey
            }
        }
    }

    render() {
        return (
            <div>
                <Navbar id='Navbar' bg="warning" variant="dark"  >
                    <Navbar.Brand href="/Home"><img id='procuraYaLogo' src={ProcuraYaLogo} href='/'></img></Navbar.Brand>
                    <Nav className='mr-auto'>
                        {/*<Nav.Link href="/CreateAccount" id='NavBarLink1'>Create Account</Nav.Link>*/}
                        {/*<Nav.Link href="/" id='NavBarLink2' >Landing Page</Nav.Link>*/}
                        <NavDropdown title="Menu Desplegable" id="basic-nav-dropdown">
                            <NavDropdown.Item id='NavBarDropdown1' href="#action/3.1">Mis Expedientes</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    {
                        this.state.userData.type ? (
                            <div className='NavBarButtonsDiv'>
                                <img class='navBarIcons' id='uploadFileButton' src={UploadFileImg} height='50px' width='50px' onClick={this.uploadFileFn}></img>
                                <img class='navBarIcons' id='searchEngineButton' src={SearchImg} height='50px' width='50px' onClick={this.openSearchEngine}></img>
                                <InboxIcon />
                            </div>
                        ) : (
                                <div className='NavBarButtonsDiv'>
                                    <img class='navBarIcons' id='searchEngineButton' src={SearchImg} height='50px' width='50px' onClick={this.openSearchEngine}></img>
                                    <InboxIcon />
                                </div>
                            )
                    }
                    <NavDropdown title={<img id='userImage' src={this.state.userData.img} height='50px' width='50px'></img>} id='NavBarUserImg' height='50px' width='50px' id="basic-nav-dropdown" drop='left'>
                        <NavDropdown.Item id='NavBarDropdown1' href="" drop='left'>{this.state.userData.name}</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown2' href="" drop='left' onClick={() => { AccountConfig().then(res => { if (res) { this.handleComponentUpdate() } }) }}>Ajustes de Cuenta</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown3' href="" drop='left' onClick={this.props.handleLogout}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>
                </Navbar >
                <div id="myNav" class="overlay">
                    <a href="javascript:void(0)" class="closebtn" onClick={this.closeSearchEngine}>&times;</a>
                    <div class="overlay-content">
                        {
                            this.state.userData.type ? (<>
                                <img class='searchEngineIcons' checked={false} id='searchEnginePersonIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={personGrey} ></img>
                                <img class='searchEngineIcons' checked={false} id='searchEngineFileIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={fileGrey} ></img>
                            </>) : (<>
                                <img class='searchEngineIcons' checked={false} id='searchEnginePersonIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={personGrey} ></img>
                                <img style={{ display: 'none' }} class='searchEngineIcons' checked={false} id='searchEngineFileIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={fileGrey} ></img>
                            </>)
                        }
                    </div>
                    <div class="overlay-content">
                        <input onInput={() => { this.searchInBD() }} type='search' id='searchInput' placeholder='Busca algo...' maxlength="29"></input>
                    </div>
                    <div class="overlay-content-searchResultDiv">
                        <div id='searchResultListDiv'></div>
                    </div>
                </div>
            </div>
        )
    }
}


