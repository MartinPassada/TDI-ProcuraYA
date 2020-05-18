import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button'
import ProcuraYaLogo from '../assets/LOGO1.png'
import '../css/NavigationBar.css'


export default function NavigationBar() {
    return (
        <>
            <Navbar id='Navbar' bg="warning" variant="light"  >
                <Navbar.Brand href="/Home"><img src={ProcuraYaLogo} height='75px' width='75px'></img></Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/CreateAccount">Create Account</Nav.Link>
                    <Nav.Link href="/">Landing Page</Nav.Link>
                    <NavDropdown title="Menu Desplegable" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Mis Expedientes</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Buscar..." className="mr-sm-2" />
                    <Button variant="outline-primary" border='light'>Buscar</Button>
                </Form>
            </Navbar >
        </>
    )
}
