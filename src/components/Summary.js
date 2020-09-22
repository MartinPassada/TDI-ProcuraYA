import React from 'react';
import ReactDOM from 'react-dom';
import AttorneyDataInfoHeader from './AttorneyDataInfoHeader'
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

export default function Summary(props) {
    const styleP = {
        color: "black",
        textAlign: "center",
        marginTop: "10px",
        marginBottom: "10px",
    }
    return (
        <>
            <h4 style={styleP}>Procurador</h4>
            <AttorneyDataInfoHeader attorneyData={props.attorneyData} />
            <h4 style={styleP}>Expedientes Seleccionados</h4>
            <List>
                {props.files.map(e => {
                    return <ListItem>
                        <ListItemText primary={`Expediente N° ${e}`} />
                    </ListItem>

                })}
            </List>
            <h4 style={styleP}>Tareas a completar</h4>
            <List>
                {props.tasks.map(e => {
                    return <ListItem>
                        <ListItemText primary={e.taskName}
                            secondary={'Vence el: ' + e.expirationDate} />
                    </ListItem>

                })}
            </List>


        </>
    )
}