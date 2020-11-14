import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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
    onAfterClose: () => {
    }
})
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export default function AttorneyTasksTable(props) {
    const classes = useStyles();

    const completeTask = (taskName, expirationdate, taskid) => {
        let data = {
            taskid: taskid,
            taskName: taskName,
            expirationDate: expirationdate,
            fileID: props.fileID
        }
        MySwal.fire({
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            icon: 'question',
            title: 'Completar Tarea',
            text: '¿Seguro quieres marcar esta tarea como completa?',
            showCancelButton: true,
            cancelButtonText: `No`,
            confirmButtonText: 'Si',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await fetch('/completeTask', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(data),
                }).then(async res => {
                    if (res.status === 500) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Server Error'
                        })
                    } else if (res.status === 403) {
                        await ExtendSessionFn();
                    } else if (res.status === 404) {
                        Toast.fire({
                            icon: 'question',
                            title: 'No encontramos el expediente'
                        })
                    } else if (res.status === 200) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Cambios guardados'
                        })
                    }
                })
            } else if (result.isDismissed) {
                //do nothing
            }
        })
    }

    return (
        <>
            {
                props.td && props.td.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tarea</TableCell>
                                    <TableCell align="right">Vencimiento</TableCell>
                                    <TableCell align="right">Estado&nbsp;</TableCell>
                                    <TableCell align="right">Accion&nbsp;</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.td.map((row) => (
                                    row.isBloqued ? (
                                        <TableRow key={row.taskName}>
                                            <TableCell component="th" scope="row">
                                                {row.taskName}
                                            </TableCell>
                                            <TableCell align="right">{row.expirationDate}</TableCell>
                                            <TableCell align="right">{'No cumplida'}</TableCell>
                                            <TableCell align="right">{''}</TableCell>
                                        </TableRow>
                                    ) : (
                                            row.isDone ? (
                                                <TableRow key={row.taskName}>
                                                    <TableCell component="th" scope="row">
                                                        {row.taskName}
                                                    </TableCell>
                                                    <TableCell align="right">{row.expirationDate}</TableCell>
                                                    <TableCell align="right">{"Completa"}</TableCell>
                                                    <TableCell align="right">{''}</TableCell>
                                                </TableRow>
                                            ) : (
                                                    <TableRow key={row.taskName}>
                                                        <TableCell component="th" scope="row">
                                                            {row.taskName}
                                                        </TableCell>
                                                        <TableCell align="right">{row.expirationDate}</TableCell>
                                                        <TableCell align="right">{"Lista para completar"}</TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Completar tarea" arrow>
                                                                <IconButton onClick={() => { completeTask(row.taskName, row.expirationDate, row.id) }}>
                                                                    <CheckIcon style={{ fontSize: 25, zIndex: 2, color: 'green' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                )

                                        )
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                        <p>Este expediente no tiene tareas asignadas</p>
                    )
            }


        </>
    );
}
