import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ComboBox from './ComboBox'
import DatePicker from './DatePicker'
import '../css/SelectTask.css'

const MySwal = withReactContent(Swal);
const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    onAfterClose: () => {

    }

})
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
}));
export default class SelectTask extends Component {

    constructor(props) {
        super(props)
        this.onChildChangeTaskExpirationDate = this.onChildChangeTaskExpirationDate.bind(this);
        this.onChildChangeTaskName = this.onChildChangeTaskName.bind(this);
        this.state = {
            listItems: [],
            task: {
                taskName: null,
                expirationDate: null
            }
        }
    }

    addItemTolist(item) {
        this.state.listItems.push(item);
        this.setState({ listItems: this.state.listItems });
        this.props.setTaskListFn(this.state.listItems);
    }
    createTask() {
        let selectedExpirationDate = new Date(this.state.task.expirationDate);
        if (selectedExpirationDate.getTime() < Date.now()) {
            Toast.fire({
                icon: 'error',
                title: 'Fecha de vencimiento incorrecta'
            })
        } else {
            this.setState({ task: { taskName: this.state.task.taskName, expirationDate: this.state.task.expirationDate } })
            this.addItemTolist(this.state.task)
        }

    }
    onChildChangeTaskName(value) {
        this.state.task.taskName = value;
        //this.setState({ task: { taskName: this.state.task.taskName, expirationDate: this.state.task.expirationDate } })
    }
    onChildChangeTaskExpirationDate(value) {
        this.state.task.expirationDate = value;
        //this.setState({ task: { expirationDate: this.state.task.expirationDate, taskName: this.state.task.taskName } })
    }
    deleteElementFromList(index) {
        this.state.listItems.splice(index, 1);
        this.setState({ listItems: this.state.listItems })
    }

    render() {
        return (
            <>
                <h4>Lista de tareas</h4>
                {
                    this.state.listItems.length > 0 ? (
                        <>
                            <div >
                                <List dense={true}>
                                    {
                                        this.state.listItems.map((item, index) => {
                                            return (
                                                <ListItem>
                                                    <ListItemText
                                                        primary={item.taskName}
                                                        secondary={'Vence el: ' + item.expirationDate}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="delete"
                                                            onClick={() => { this.deleteElementFromList(index) }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <div className='containerDiv'>
                                <div className='selectTaskFormDiv'>
                                    <ComboBox handleChange={this.onChildChangeTaskName} />
                                    <DatePicker handleChange={this.onChildChangeTaskExpirationDate} />
                                </div>
                                <IconButton edge="end" aria-label="add"
                                    onClick={() => { this.createTask() }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </>
                    ) : (
                            <>
                                <p>Aún no hay tareas seleccionadas</p>
                                <div className='containerDiv'>
                                    <div className='selectTaskFormDiv'>
                                        <ComboBox handleChange={this.onChildChangeTaskName} />
                                        <DatePicker handleChange={this.onChildChangeTaskExpirationDate} />
                                    </div>
                                    <IconButton edge="end" aria-label="add"
                                        onClick={() => { this.createTask() }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </>
                        )
                }
            </>
        )
    }
}