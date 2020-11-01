import React from "react";
import ReactDOM from 'react-dom';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import SendFileButton from './SendFileButton'
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

export default function InnerCard(props) {
    const classes = useStyles();
    const cleanLocationsDiv = async () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('locationsDiv'));
        document.getElementById('locationsDiv').innerHTML = '';
        return true
    }
    return (
        <>
            {
                props.rooms && props.rooms.length > 0 ? (
                    props.rooms.map(e => {
                        return <div>
                            <Card className={classes.root}>
                                <CardActionArea>
                                    <CardMedia
                                        //component="img"
                                        //alt="Imagen Jurisdiccion"
                                        height="140"
                                        //image={props.locationsData.userImg}
                                        title={e.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {e.name}
                                        </Typography>
                                        {/*<Typography variant="body2" color="textSecondary" component="p">
                                {props.locationsData.userLastName}
                                    </Typography>*/}
                                    </CardContent>
                                </CardActionArea>
                                <CardContent>
                                    <div class='customButtonsDiv'>
                                        {
                                            props.userData.type ? ('')
                                                : (
                                                    <>
                                                        <SendFileButton userData={props.userData} />
                                                    </>
                                                )
                                        }
                                    </div>
                                </CardContent>
                            </Card >
                        </div>
                    })
                ) : ('')
            }
            {

                props.secretaries && props.secretaries.length > 0 ? (
                    props.secretaries.map(e => {
                        return <div>
                            <Card className={classes.root}>
                                <CardActionArea>
                                    <CardMedia
                                        //component="img"
                                        //alt="Imagen Jurisdiccion"
                                        height="140"
                                        //image={props.locationsData.userImg}
                                        title={e.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {e.name}
                                        </Typography>
                                        {/*<Typography variant="body2" color="textSecondary" component="p">
                                        {props.locationsData.userLastName}
                                        </Typography>*/}
                                    </CardContent>
                                </CardActionArea>
                                <CardContent>
                                    <div class='customButtonsDiv'>
                                        {
                                            props.userData.type ? ('')
                                                : (
                                                    <>
                                                        <SendFileButton userData={props.userData} />
                                                    </>
                                                )
                                        }
                                    </div>
                                </CardContent>
                            </Card >
                        </div>
                    })
                ) : ('')
            }
        </>
    );

}
