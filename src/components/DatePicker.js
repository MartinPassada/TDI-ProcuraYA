import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({

    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function DatePicker(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        date: 'hai',
    });

    const handleChange = (value) => {
        setState({ date: value })
        props.handleChange(value)
    };


    return (
        <div>
            <form className={classes.container} noValidate>
                <TextField
                    id="date"
                    label="Vencimiento de Tarea"
                    type="date"
                    defaultValue="Vencimiento de Tarea"
                    className={classes.textField}
                    onChange={(event) => { handleChange(event.target.value) }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        </div>
    );
}
