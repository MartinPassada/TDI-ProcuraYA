export async function state() {
    await fetch('/getUserName', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 200) {
                return true;
            } else if (response.status === 403) {
                console.log('salio por aca')
                return false;
            } else {
                return false;
            }
        })

}


