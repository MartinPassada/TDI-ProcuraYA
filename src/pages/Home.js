import React from 'react';
import Footer from '../components/Footer'
import NavigationBar from '../components/NavigationBar'

export default function Home() {
    return (
        <>
            <NavigationBar fixed="top" />
            <div>este es el home</div>
            <Footer fixed='bottom' />
        </>
    );
}