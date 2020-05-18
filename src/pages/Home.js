import React from 'react';
import Footer from '../components/Footer'
import NavigationBar from '../components/NavigationBar'
import ControlPanel from '../components/ControlPanel'
import '../css/Home.css';
export default function Home() {
    return (
        <>
            <NavigationBar fixed="top" />
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