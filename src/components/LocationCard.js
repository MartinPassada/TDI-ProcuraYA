import React from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import AssignFilesIcon from './AssignFilesIcon'
import AssignTaskIcon from './AssignTaskIcon'
import SendMessageIcon from './SendMessageIcon'
import InnerLocationCard from './InnerLocationCard'
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

export default function LocationCard(props) {
    const classes = useStyles();
    const cleanLocationsDiv = async () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('locationsDiv'));
        document.getElementById('locationsDiv').innerHTML = '';
        return true
    }
    return (
        <div onClick={async () => {
            let query = props.locationsData.name
            await fetch(`/getLocation?name=${query}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                }
            }).then(async res => {
                let data = await res.json().then(jsonData => {
                    console.log(jsonData);
                    cleanLocationsDiv().then(cleaned => {
                        if (cleaned) {
                            let locationsDiv = document.getElementById('locationsDiv');
                            Object.keys(jsonData).forEach(property => {
                                ReactDOM.render(<InnerLocationCard array={jsonData} userData={props.userData} />, locationsDiv)
                            })


                        }
                    })

                });

            })
        }}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        //component="img"
                        //alt="Imagen Jurisdiccion"
                        height="140"
                        //image={props.locationsData.userImg}
                        title={props.locationsData.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            {props.locationsData.name}
                        </Typography>
                        {/*<Typography variant="body2" color="textSecondary" component="p">
                        {props.locationsData.userLastName}
                </Typography>*/}
                    </CardContent>
                </CardActionArea>
            </Card >
        </div>
    );

}
