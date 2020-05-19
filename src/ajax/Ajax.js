/*

export default function doSignUp(userData, Toast) {

    var req = new XMLHttpRequest();

    req.onload = function () {

        Toast.fire()

        if (req.status == 200) {

            Toast.fire({
                icon: 'success',
                title: 'Registro Exitoso redireccionando al Home...'
            })

            window.location.replace(req.responseURL);

        } else if (req.status == 403) {
            //Mail ya existe


        } else if (req.status == 999) {
            // Nombre Usuario ya esta en uso

        } else {
            //otro error
        }
    }

    req.open("POST", "/signUp");
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(userData));
}
*/



