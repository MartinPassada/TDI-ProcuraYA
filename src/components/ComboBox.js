import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useState, useEffect } from 'react';


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

}));

export default function ComboBox(props) {
    useEffect(() => {
        getInitialData();
    }, [])

    const classes = useStyles();
    const [values, setValues] = React.useState([])
    const [state, setState] = React.useState({
        name: 'hai',
    });

    const getInitialData = async () => {
        const response = await fetch('/getTasksNames');
        var data = await response.json();
        setValues(data.taskName)
    }
    const handleChange = (value) => {
        setState({ name: value })
        props.handleChange(value)
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Tipo de Tarea</InputLabel>
                <Select
                    className={classes.select}
                    native
                    value={state.age}
                    onChange={(event) => { handleChange(event.target.value) }}
                    inputProps={{
                        name: 'Tarea',
                        id: 'age-native-simple',
                    }}
                >
                    <option aria-label="None" value="" />
                    {
                        values.map(e => {
                            return <option value={`${e}`}>{e}</option>
                        })
                    }

                </Select>
            </FormControl>

        </div>
    );
}
