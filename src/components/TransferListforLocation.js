import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AttorneyDataInfoHeader from "./AttorneyDataInfoHeader"
import '../css/TransferList.css'
import ExtendSessionFn from './ExtendSesion';


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
    onAfterClose: () => { }
})
const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    checkbox: {
        zIndex: 2,
    },

}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function TransferListforLocation(props) {


    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);

    let assignedArray = [];
    let userFiles = [];

    async function buildAssignedArray() {
        if (props.assignedFiles.length > 0) {
            props.assignedFiles.forEach(e => {
                assignedArray.push(e.fileID);
            });
            return assignedArray
        } else {
            return []
        }

    }
    async function filterUserFilesArray() {
        const res = await fetch('/getMyFilesToAssign', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });
        if (res.status === 200) {
            let data = await res.json();
            if (data.length > 0) {
                data.forEach(async e => {
                    userFiles.push(e.fileID);
                })
                return userFiles
            } else {
                return []
            }
        } else if (res.status === 500) {
            Toast.fire({
                icon: 'error',
                title: 'Server Error'
            })
        } else if (res.status === 404) {
            return []
        } else if (res.status === 403) {
            await ExtendSessionFn()
        }

    }

    useEffect(() => {
        filterUserFilesArray().then(res => { setLeft(res) })
        buildAssignedArray().then(res => { setRight(res) });
    }, [])


    const classes = useStyles();
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };
    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox className={classes.checkbox}
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'Todos Seleccionados' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length}`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox className={classes.checkbox}
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`Expediente N° ${value}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <>
            {/*<AttorneyDataInfoHeader attorneyData={props.attorneyData} />*/}
            <div className='TranferListsContainer'>
                <div className='TransferListLeft' id='TlistLeft'>
                    <Grid item>{customList('Disponible para enviar', left)}</Grid>
                </div>
                <div className='TransferListButtonsContainer'>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="Enviar"
                    >
                        &gt;
                        </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="Traer"
                    >
                        &lt;
                </Button>
                </div>
                <div className='TranferListRight' id='TlistRight'>
                    <Grid item>{customList('En jurisdiccion', right)}</Grid>
                </div>

            </div >
        </>
    );
}
