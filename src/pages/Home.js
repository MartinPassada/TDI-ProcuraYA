import React from 'react';
import Footer from '../components/Footer'
import NavigationBar from '../components/NavigationBar'
import ControlPanel from '../components/ControlPanel'
import '../css/SunEditor.css'
import '../../node_modules/suneditor/src/assets/css/suneditor-contents.css'
import '../../node_modules/suneditor/dist/css/suneditor.min.css'
import '../css/Home.css';
import '../css/File.css';

export default function Home(props) {

    return (
        <>
            <NavigationBar handleLogout={props.handleLogout} fixed="top" />
            <div class="Hwrap">
                <div class="Hfleft" id='fleft'>
                    <ControlPanel />
                </div>
                <div class="Hfright" id='fright'>

                </div>
            </div>
            <Footer fixed='bottom' />
        </>
    );
}