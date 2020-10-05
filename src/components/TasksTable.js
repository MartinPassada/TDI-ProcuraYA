import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export default function DenseTable(props) {
    const classes = useStyles();

    return (
        <>
            {
                props.td.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tarea</TableCell>
                                    <TableCell align="right">Vencimiento</TableCell>
                                    <TableCell align="right">Estado&nbsp;</TableCell>
                                    <TableCell align="right">Cumplida por&nbsp;</TableCell>
                                    <TableCell align="right">Cumplida el&nbsp;</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.td.map((row) => (
                                    row.state === 'No realizada' ? (
                                        <TableRow key={row.taskName}>
                                            <TableCell component="th" scope="row">
                                                {row.taskName}
                                            </TableCell>
                                            <TableCell align="right">{row.expirationDate}</TableCell>
                                            <TableCell align="right">{row.state}</TableCell>
                                            <TableCell align="right">{''}</TableCell>
                                            <TableCell align="right">{''}</TableCell>
                                        </TableRow>
                                    ) : (
                                            <TableRow key={row.taskName}>
                                                <TableCell component="th" scope="row">
                                                    {row.taskName}
                                                </TableCell>
                                                <TableCell align="right">{row.expirationDate}</TableCell>
                                                <TableCell align="right">{row.state}</TableCell>
                                                <TableCell align="right">{row.completedBy}</TableCell>
                                                <TableCell align="right">{(new Date(row.completedDate)).toLocaleDateString()}</TableCell>
                                            </TableRow>
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
