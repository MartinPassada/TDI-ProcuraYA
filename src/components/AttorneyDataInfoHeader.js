import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Avatar from '@material-ui/core/Avatar';
import '../css/AttorneyDataInfoHeader.css'



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

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

export default function AttorneyDataInfoHeader(props) {
    const classes = useStyles();
    return (
        <>
            <div class='attorneyDataContainer'>
                <img className='userImg' height={'40px'} src={props.attorneyData.userImg}></img>
                {props.attorneyData.userName + ' ' + props.attorneyData.userLastName}
            </div>
        </>
    )
}