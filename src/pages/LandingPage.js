import React from 'react';
import WelcomeButton from '../components/WelcomeButton'
import { Link } from 'react-router-dom';
import IntroText from '../components/IntroText'
import '../css/LandingPage.css'

export default function LandingPage() {
    return (
        <>
            <div class='BackgroundContainer'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'><rect fill='#ffffff' width='2000' height='1500' /><defs><rect stroke='#ffffff' stroke-width='0.29' width='1' height='1' id='s' /><pattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><use fill='#fafafa' href='#s' y='2' /><use fill='#fafafa' href='#s' x='1' y='2' /><use fill='#f5f5f5' href='#s' x='2' y='2' /><use fill='#f5f5f5' href='#s' /><use fill='#f0f0f0' href='#s' x='2' /><use fill='#f0f0f0' href='#s' x='1' y='1' /></pattern><pattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#ebebeb'><use href='#s' /><use href='#s' y='5' /><use href='#s' x='1' y='10' /><use href='#s' x='2' y='1' /><use href='#s' x='2' y='4' /><use href='#s' x='3' y='8' /><use href='#s' x='4' y='3' /><use href='#s' x='4' y='7' /><use href='#s' x='5' y='2' /><use href='#s' x='5' y='6' /><use href='#s' x='6' y='9' /></g></pattern><pattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#ebebeb'><use href='#s' y='5' /><use href='#s' y='8' /><use href='#s' x='1' y='1' /><use href='#s' x='1' y='9' /><use href='#s' x='1' y='12' /><use href='#s' x='2' /><use href='#s' x='2' y='4' /><use href='#s' x='3' y='2' /><use href='#s' x='3' y='6' /><use href='#s' x='3' y='11' /><use href='#s' x='4' y='3' /><use href='#s' x='4' y='7' /><use href='#s' x='4' y='10' /></g></pattern><pattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#e5e5e5'><use href='#s' y='11' /><use href='#s' x='2' y='9' /><use href='#s' x='5' y='12' /><use href='#s' x='9' y='4' /><use href='#s' x='12' y='1' /><use href='#s' x='16' y='6' /></g></pattern><pattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#ffffff'><use href='#s' y='9' /><use href='#s' x='16' y='5' /><use href='#s' x='14' y='2' /><use href='#s' x='11' y='11' /><use href='#s' x='6' y='14' /></g><g fill='#e0e0e0'><use href='#s' x='3' y='13' /><use href='#s' x='9' y='7' /><use href='#s' x='13' y='10' /><use href='#s' x='15' y='4' /><use href='#s' x='18' y='1' /></g></pattern><pattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#F60'><use href='#s' x='2' y='5' /><use href='#s' x='16' y='38' /><use href='#s' x='46' y='42' /><use href='#s' x='29' y='20' /></g></pattern><pattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#F60'><use href='#s' x='33' y='13' /><use href='#s' x='27' y='54' /><use href='#s' x='55' y='55' /></g></pattern><pattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='rotate(29 1000 750) scale(35.5) translate(-971.83 -728.87)'><g fill='#F60'><use href='#s' x='11' y='8' /><use href='#s' x='51' y='13' /><use href='#s' x='17' y='73' /><use href='#s' x='99' y='57' /></g></pattern></defs><rect fill='url(#a)' width='100%' height='100%' /><rect fill='url(#b)' width='100%' height='100%' /><rect fill='url(#h)' width='100%' height='100%' /><rect fill='url(#c)' width='100%' height='100%' /><rect fill='url(#d)' width='100%' height='100%' /><rect fill='url(#e)' width='100%' height='100%' /><rect fill='url(#f)' width='100%' height='100%' /><rect fill='url(#g)' width='100%' height='100%' /></svg>
                <div class='TextContainer' id='TextContainer'>
                    <p class='IntroText' id='IntroText'>Estamos transformando la forma en que trabajan los procuradores!!!
                    Esta web se desarrolló como tu solución administrativa!!!
                    Este sitio fue creado para todos los trabajadores del ámbito judicial que precisan gestionar mejor sus tareas de procuración, y optimizar no solo el uso de la información, sino también los tiempos que demandan efectuarlas.
                <br></br>
                La integración de esta solución tecnológica intuitiva a tu sistema de trabajo, te dará un beneficio no solo de uso práctico y ordenado, sino principalmente económico como resultado de la buena administración de tu tiempo.
                Las razones?
                <br></br>
                La aplicación se concibió como un servicio escencial y confiable para que nuestros clientes mejoren el uso del tiempo, llevando consigo la información necesaria para efectuar el seguimiento de expedientes judiciales, asi como también facilitar las tareas de reconocimiento de los trabajos que debe efectuar, en el emplazamiento en que se encuentra.
                Provée un servicio de geolocalización con las entidades gubernamentales mas conocidas a nivel nacional, y permite adicionar nuevos entes de forma manual.
                También admite la función de asignación y seguimiento de tareas para uso no solo de los procuradores, sino también de los mandatarios.
                Posee un óptimo buscador de expedientes y temas relacionados a cada ítem buscado.
                Adicionalmente, contiene una función de escaneo para reconocimiento, busqueda y almacenamiento de datos de los expedientes.
                Por ejemplo, entre otras funciones podrás hacer listas de los expedienes pendientes y tareas que tienes en cada uno de los organismos….o también tendrás la posibilidad de enviar y recibir las tareas asignadas a tu empleador….
                <br></br>
                En el ambiente integrado, optimizado y de alta capacidad tecnológica en que vivimos, este software de gestión se transformará en una de tus herramientas de trabajo mas importantes, porque podrás gestionar toda tu rutina de manera organizada, visible, y sin usar papeles ni carpetas adicionales.
                <span>Que lo disfrutes!!!</span>
                    </p>
                    <WelcomeButton />
                    <h4 class='CreateAccountLink'>No tienes una cuenta ? <Link to="/CreateAccount"><span>Crea una aquí</span></Link></h4>
                </div>
            </div>
            {/*<IntroText />*/}
        </>
    );
}
