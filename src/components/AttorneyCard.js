import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import AssignFilesIcon from './AssignFilesIcon'
import AssignTaskIcon from './AssignTaskIcon'
import SendMessageIcon from './SendMessageIcon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'




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
const useStyles = makeStyles({
    root: {
        width: 240,
        maxWidth: 270,
        textAlign: 'center',
        marginTop: '15px'
    },

});

export default function AttorneyCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Imagen de Usuario"
                    height="140"
                    image={props.attorneyData.userImg}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.attorneyData.userName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.attorneyData.userLastName}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardContent>
                <div class='customButtonsDiv'>
                    <AssignFilesIcon attorneyData={props.attorneyData} handleControlPanelUpdate={props.handleControlPanelUpdate} />
                    <AssignTaskIcon attorneyData={props.attorneyData} />
                    <SendMessageIcon attorneyData={props.attorneyData} />
                </div>
            </CardContent>

        </Card >
    );

}
