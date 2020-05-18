import React from "react";
import { MDBJumbotron, MDBBtn, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBCardBody, MDBCardText, MDBCardTitle } from "mdbreact";

const IntroText = () => {
    return (
        <MDBContainer className="mt-5 text-center" size="lg">
            <MDBRow>
                <MDBCol>
                    <MDBJumbotron>
                        <MDBCardBody>
                            <MDBCardTitle className="h2">
                                Estamos transformando la forma en que trabajan los procuradores
                            </MDBCardTitle>
                            <p className="blue-text my-4 font-weight-bold">
                                ProcuraYa
                            </p>
                            <MDBCardText>
                                Esta web se desarrolló como tu solución administrativa!!!
                                Este sitio fue creado para todos los trabajadores del ámbito judicial que precisan gestionar mejor sus tareas de procuración, y optimizar no solo el uso de la información, sino también los tiempos que demandan efectuarlas.
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
                            </MDBCardText>
                            <hr className="my-4" />
                            <div className="pt-2">
                                <MDBBtn
                                    color="primary"
                                    className="waves-effect"
                                >
                                    Buy now <MDBIcon far icon="gem" />
                                </MDBBtn>
                                <MDBBtn
                                    outline
                                    color="primary"
                                    className="waves-effect"
                                >
                                    Download <MDBIcon icon="download" />
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBJumbotron>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}

export default IntroText;