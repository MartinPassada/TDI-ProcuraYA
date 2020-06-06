import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button'
import ProcuraYaLogo from '../assets/LOGO1.png'
import AltUserImg from '../assets/nouser.png'
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

    async componentDidMount() {
        const res = await fetch('/checkAuth');
        const data = await res.json();
        //console.log(data);
        this.setState({ name: data });

    }
    render() {
        return (
            <>
                <Navbar id='Navbar' bg="warning" variant="dark"  >
                    <Navbar.Brand href="/Home"><img src={ProcuraYaLogo} height='75px' width='75px'></img></Navbar.Brand>
                    <Nav className='mr-auto'>
                        <Nav.Link href="/CreateAccount" id='NavBarLink1'>Create Account</Nav.Link>
                        <Nav.Link href="/" id='NavBarLink2' >Landing Page</Nav.Link>
                        <NavDropdown title="Menu Desplegable" id="basic-nav-dropdown">
                            <NavDropdown.Item id='NavBarDropdown1' href="#action/3.1">Mis Expedientes</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline id='NavBarSearchForm'>
                        <FormControl type="text" placeholder="Buscar..." id='NavBarSearchInput' />
                        <Button id='NavBarsearchButton' variant="primary" border='white'>Buscar</Button>
                    </Form>
                    <NavDropdown title={this.state.name} id='NavBarUserImg' height='50px' width='50px' id="basic-nav-dropdown" drop='left'>
                        <NavDropdown.Item id='NavBarDropdown2' href="#action/3.1" drop='left'>Ajustes de Cuenta</NavDropdown.Item>
                        <NavDropdown.Item id='NavBarDropdown3' href="#action/3.1" drop='left' onClick={logout}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>
                </Navbar >
            </>
        )
    }
}

