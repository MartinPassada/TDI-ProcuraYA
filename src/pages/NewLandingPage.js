import React from 'react'
import GuyFloatingAnim from '../looties/LootieOffice.json'
import SearchAttorneys from '../looties/search.json'
import GearAnim from '../looties/gear.json'
import PapersAnim from '../looties/Papers.json'
import TeaCupAnim from '../looties/hot-tea.json'
import Security from '../looties/security.json'
import GiftBox from '../looties/giftbox.json'
import PaperPlane from '../looties/paper-plane.json'
import Tablet from '../looties/tablet.json'
import Mobile from '../looties/mobile-purple.json'
import TrackFiles from '../looties/location.json'
import { useEffect } from 'react'
import Login from '../components/LoginForm'
import $ from 'jquery'
import '../css/NewLandingPage..css'
import LottieConstructor from '../looties/LottieConstructor'


export default function NewLandingPage(props) {
    useEffect(() => {
        $(window).on("load", function () {
            $(window).scroll(function () {
                var windowBottom = $(this).scrollTop() + $(this).innerHeight();
                $(".ItemContainer1").each(function () {
                    var objectBottom = $(this).offset().top + $(this).outerHeight();
                    if (objectBottom <= windowBottom + 300) {
                        if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
                    } else {
                        //if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
                    }
                });
                $(".what--container").each(function () {
                    var objectBottom = $(this).offset().top + $(this).outerHeight();
                    if (objectBottom <= windowBottom + 300) {
                        if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
                    } else {
                        //if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
                    }
                });
            }).scroll();
        });
    }, [])

    const handleEvent = () => {
        Login(props.handleLogin);
    }


    return (
        <>
            <section class='ItemWrapper' id='Wrapper1'>
                <div class='ItemContainer1' id='ItemContainer1' >
                    <div class='TitleContainer1'>
                        <h1 class='TitleH1' id='Title1'>Haz más con ProcuraYA</h1>
                        <h2 id='SubTitle1'>Potencia tu productividad utilizando nuestras herramientas</h2>
                    </div >
                    <div class="LottieDiv1" id='Lottie1'><LottieConstructor animation={GuyFloatingAnim} /></div>
                </div >
            </section >

            {/*STATIC WAVE */}
            <section class='ItemWrapper' id='svgWrapper2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ea5f32" fill-opacity="1" d="M0,96L60,133.3C120,171,240,245,360,234.7C480,224,600,128,720,101.3C840,75,960,117,1080,144C1200,171,1320,181,1380,186.7L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                </svg>
            </section >

            <section class='ItemWrapper' id='Wrapper2'>
                <div class='ItemContainer1' >
                    <div class="LottieDiv2"><LottieConstructor animation={PapersAnim} /></div>
                    <div class='TitleContainer1'>
                        <h1 class='TitleH1' id='Title2'>Olvidate de los papeles</h1>
                        <h2 id='SubTitle2'>Sumergete de lleno en la era digital y deja esos viejos papeles atrás</h2>
                    </div >
                </div >
            </section >

            {/*STATIC WAVE */}
            <section class='ItemWrapper' id='svgWrapper1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="rgba(88,134,245,1)" fill-opacity="1" d="M0,64L60,90.7C120,117,240,171,360,165.3C480,160,600,96,720,101.3C840,107,960,181,1080,181.3C1200,181,1320,107,1380,69.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </section >


            <section class='ItemWrapper' id='Wrapper3'>
                <div class='ItemContainer1'>
                    <div class='TitleContainer1'>
                        <h1 class='TitleH1' id='Title3'>Busca gente y arma tu equipo</h1>
                        <h2 id='SubTitle3' id='SubTitle3'>Asigna expedientes a tus procuradores y ponlos a trabajar</h2>
                    </div >
                    <div class="LottieDiv1"><LottieConstructor animation={SearchAttorneys} /></div>
                </div >
            </section >

            {/*STATIC WAVE */}
            <section class='ItemWrapper' id='svgWrapper2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="rgba(29,56,124,1)" fill-opacity="1" d="M0,96L60,133.3C120,171,240,245,360,234.7C480,224,600,128,720,101.3C840,75,960,117,1080,144C1200,171,1320,181,1380,186.7L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                </svg>
            </section >

            <section class='ItemWrapper' id='Wrapper4'>
                <div class='ItemContainer1' >
                    <div class="LottieDiv2" id='Lootie4'><LottieConstructor animation={TrackFiles} /></div>
                    <div class='TitleContainer1'>
                        <h1 class='TitleH1' id='Title4'>No pierdas de vista tus expedientes</h1>
                        <h2 id='SubTitle4'>Encuentra tus expedientes con solo un click!</h2>
                    </div >
                </div >
            </section >

            {/*STATIC WAVE */}
            <section class='ItemWrapper' id='svgWrapper3'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#6a79c3" fill-opacity="1" d="M0,64L80,96C160,128,320,192,480,197.3C640,203,800,149,960,117.3C1120,85,1280,75,1360,69.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </section >

            <section class='ItemWrapper' id='Wrapper5'>
                <div class='ItemContainer1' >
                    <div class='TitleContainer1'>
                        <h1 class='TitleH1' id='Title5'>Diseño responsive</h1>
                        <h2 id='SubTitle5'>Utiliza ProcuraYa en cualquier lugar accediendo desde tu movil</h2>
                    </div >
                    <div class="LottieDiv1"><LottieConstructor animation={Mobile} /></div>
                </div >
            </section >

            {/*STATIC WAVE */}
            <section class='ItemWrapper' id='svgWrapper4'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#554392" fill-opacity="1" d="M0,64L80,96C160,128,320,192,480,197.3C640,203,800,149,960,117.3C1120,85,1280,75,1360,69.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                </svg>
            </section >

            {/* GRID */}
            <section class='ItemWrapper' id='Wrapper6'>
                <h1 class='what--title' id='whatTitle'>¿Qué mas te ofrecemos?</h1>
                <ul class='what--container'>
                    <li class="what--list">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor h={80} w={80} loop={true} autoplay={true} animation={GearAnim} />
                            </div>
                            <p class="top--text">Actualizaciones continuas</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">Para poder ofrecerte nuevas funcionalidades, y también para reparar lo que rompemos; tenemos a nuestro equipo trabajando 24/7 para mejorar la app.</p>
                        </div>
                    </li>
                    <li class="what--list two">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor h={80} w={80} loop={true} autoplay={true} animation={TeaCupAnim} />
                            </div>
                            <p class="top--text">Organiza tus expedientes</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">Gracias a nuestro sistema de mensajería automática, seras notificado cuando el estado de un expediente cambie.</p>
                        </div>
                    </li>
                    <li class="what--list three">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor h={80} w={80} loop={true} autoplay={true} animation={Security} />
                            </div>
                            <p class="top--text">La seguridad es lo primero</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">Aseguramos tu password utilizando una poderosa encriptación de solo un sentido. Así ni terceros, ni nuestro equipo puede reirse de lo que pusiste como contraseña.</p>
                        </div>
                    </li>
                    <li class="what--list four">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor h={80} w={80} loop={true} autoplay={true} animation={GiftBox} />
                            </div>
                            <p class="top--text">Tutoriales para características nuevas</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">¿Acaso no sabes usar una nueva funcionalidad? ¡No te preocupes! Ofrecemos tutoriales con videos para hacerte la vida mas fácil.</p>
                        </div>
                    </li>
                    <li class="what--list five">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor loop={true} autoplay={true} h={80} w={80} animation={Tablet} />
                            </div>
                            <p class="top--text">Comodidad de Acceso</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">Puedes ingresar desde cualquier ordenador, móvil o tablet para estar conectado donde quieras y cuando quieras.</p>
                        </div>
                    </li>
                    <li class="what--list six">
                        <div class='top--container'>
                            <div class="anim--container">
                                <LottieConstructor loop={true} autoplay={true} h={80} w={80} animation={PaperPlane} />
                            </div>
                            <p class="top--text">Servicio de Mensajería In-App</p>
                        </div>
                        <div class="bottom--container">
                            <p class="text--description">Gracias este servicio in-app podrás comunicarte con tus subordinados y asignarles tareas.</p>
                        </div>
                    </li>

                </ul>
            </section >

            {/*ANIMATED WAVE*/}
            <div class="waves">
                <svg width="100%" height="200px" fill="none">
                    <path
                        fill="#454599"
                        d="M0 67C 273,183822,-401920.00,106 V 359 H 0 V 67Z">
                        <animate
                            repeatCount="indefinite"
                            fill="#454599"
                            attributeName="d"
                            dur="15s"
                            values="
                            M0 77 
                            C 473,283
                            822,-40
                            1920,116 

                            V 359 
                            H 0 
                            V 67 
                            Z; 

                            M0 77 
                            C 473,-40
                            1222,283
                            1920,136 

                            V 359 
                            H 0 
                            V 67 
                            Z; 

                            M0 77 
                            C 973,260
                            1722,-53
                            1920,120 

                            V 359 
                            H 0 
                            V 67 
                            Z; 

                            M0 77 
                            C 473,283
                            822,-40
                            1920,116 

                            V 359 
                            H 0 
                            V 67 
                            Z
                            ">
                        </animate>
                    </path>
                </svg>
            </div>
            <section class='ItemWrapper' id='Wrapper7'>
                <div class='ItemContainer1' id='ItemContainerFooter' >
                    <div class='TitleContainer1' id='FooterTitleContainer'>
                        <h1 class='TitleH1'>¿Estás listo para comenzar?</h1>
                        <button class='LoginButton' onClick={handleEvent}>INGRESAR A LA WEB</button>
                    </div >
                </div >
            </section >
        </>
    )

}

