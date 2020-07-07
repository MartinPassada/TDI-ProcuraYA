import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button'
import ProcuraYaLogo from '../assets/LOGO1.png'
import AltUserImg from '../assets/nouser.png'
import UploadFileImg from '../assets/paper.png'
import SearchImg from '../assets/mglass.png'
import FileUploadForm from '../components/FileUploadForm'
import personGrey from '../assets/personGrey.png'
import fileGrey from '../assets/fileGrey.png'
import personOrange from '../assets/personOrange.png'
import fileOrange from '../assets/fileOrange.png'
import '../css/NavigationBar.css'

export default class NavigationBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
        }
    }
    /*state = {
        name: ''
    }*/
    /*
    get user Info
    Img, name and user type
    */

    async getInitialState() {
        var response = await fetch('/getUserInfo');
        var data = await response.json();
        console.log(data);
        this.setState({ userData: data });
    }
    async componentDidMount() {
        var response = await fetch('/getUserInfo');
        var data = await response.json();
        console.log(data);
        this.setState({ userData: data });
    }
    //logout
    /*logout = () => {
        fetch('/logout')
            .then(response => {
                if (response.status === 200) {
                    window.location.replace('/');
                }
            })
    }*/
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
                    <Navbar.Brand href="/Home"><img src={ProcuraYaLogo} height='75px' width='75px' href='/'></img></Navbar.Brand>
                    <Nav className='mr-auto'>
                        {/*<Nav.Link href="/CreateAccount" id='NavBarLink1'>Create Account</Nav.Link>*/}
                        {/*<Nav.Link href="/" id='NavBarLink2' >Landing Page</Nav.Link>*/}
                        <NavDropdown title="Menu Desplegable" id="basic-nav-dropdown">
                            <NavDropdown.Item id='NavBarDropdown1' href="#action/3.1">Mis Expedientes</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <img class='navBarIcons' id='uploadFileButton' src={UploadFileImg} height='50px' width='50px' onClick={this.uploadFileFn}></img>
                    {/*<img class='navBarIcons' id='searchEngineButton' src={SearchImg} height='50px' width='50px' onClick={this.openSearchEngine}></img>*/}
                    <NavDropdown title={<img id='userImage' src={AltUserImg} height='50px' width='50px'></img>} id='NavBarUserImg' height='50px' width='50px' id="basic-nav-dropdown" drop='left'>
                        <NavDropdown.Item id='NavBarDropdown2' href="#action/3.1" drop='left'>{this.state.userData.name}</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown2' href="#action/3.1" drop='left'>Ajustes de Cuenta</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown3' href="#action/3.1" drop='left' onClick={this.props.handleLogout}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>
                </Navbar >
                <div id="myNav" class="overlay">
                    <a href="javascript:void(0)" class="closebtn" onClick={this.closeSearchEngine}>&times;</a>
                    <div class="overlay-content">
                        <input type='text' id='searchInput' placeholder='Busca algo...' maxlength="29"></input>
                    </div>
                    <div class="overlay-content">
                        <img class='searchEngineIcons' checked={false} id='searchEnginePersonIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={personGrey} ></img>
                        <img class='searchEngineIcons' checked={false} id='searchEngineFileIcon' onClick={() => { this.selectSearchEngineIcon(window.event.target) }} src={fileGrey} ></img>
                    </div>
                </div>
            </div>
        )
    }
}


