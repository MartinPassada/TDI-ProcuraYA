import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);
const handleLogout = async () => {
    let body = {
        token: localStorage.getItem('jwtRToken')
    }
    await fetch('/logout', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.status === 200 || response.status === 500) {
                localStorage.removeItem('jwtToken')
                window.location.replace('/');
            }
        })
}
export default async function ExtendSessionFn(props) {
    return await MySwal.fire({
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        icon: 'warning',
        title: 'Sesion Expirada',
        text: '¿Extender sesion?',
        showCancelButton: true,
        cancelButtonText: `No`,
        confirmButtonText: 'Si',
        showLoaderOnConfirm: true,
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let body = {
                token: localStorage.getItem('jwtRToken')
            }
            await fetch('/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            }).then(async res => {
                if (res.status === 401) {
                    window.location.replace('/Home');
                } else if (res.status === 403) {
                    window.location.replace('/Home');
                } else if (res.status === 200) {
                    console.log('data from /token')
                    res.json().then(json => {
                        console.log(json)
                        const newAccessToken = json.accessToken;
                        localStorage.setItem('jwtToken', newAccessToken);
                        window.location.replace('/Home');
                        return true
                    })

                }
            })
        } else if (result.isDismissed) {
            handleLogout();
        }
    })
}

