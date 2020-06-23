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
import '../css/NavigationBar.css'
const logout = () => {
    fetch('/logout')
        .then(response => {
            if (response.status === 200) {
                window.location.replace('/');
            }
        })
}
export default class NavigationBar extends Component {
    state = {
        name: ''
    }
    //set user name in navbar
    async componentDidMount() {
        const response = await fetch('/getUserName');
        const data = await response.text();
        this.setState({ name: data });
    }
    //render component in right panel
    uploadFileFn = () => {
        ReactDOM.render(<FileUploadForm />, document.getElementById("fright"))
    }
    openSearchEngine() {
        document.getElementById("myNav").style.height = "100%";
        document.getElementById('searchInput').focus();
    }
    closeSearchEngine() {
        document.getElementById("myNav").style.height = "0%";
    }
    render() {
        return (
            <>
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
                    {/*<Form inline id='NavBarSearchForm'>
                        <FormControl type="text" placeholder="Buscar..." id='NavBarSearchInput' />
                    </Form>*/}
                    <NavDropdown title={<img src={AltUserImg} height='50px' width='50px'></img>} id='NavBarUserImg' height='50px' width='50px' id="basic-nav-dropdown" drop='left'>
                        <NavDropdown.Item id='NavBarDropdown2' href="#action/3.1" drop='left'>{this.state.name}</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown2' href="#action/3.1" drop='left'>Ajustes de Cuenta</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown3' href="#action/3.1" drop='left' onClick={logout}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>

                </Navbar >
                <div id="myNav" class="overlay">
                    <a href="javascript:void(0)" class="closebtn" onClick={this.closeSearchEngine}>&times;</a>
                    <div class="overlay-content">
                        <input id='searchInput' placeholder='busca algo..'></input>
                    </div>
                </div>
            </>
        )
    }
}

