import React from 'react';
import { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [user, setUser] = useState(true);

    useEffect(() => {
        async function checkSession() {
            const response = await fetch('/getUserInfo')
            if (response.status === 403 || response.status === 500) {
                setUser(false);
            } else {
                setUser(true)
            }
        }
        checkSession()
    }, [])

    if (!user) {
        return <Redirect to='/Unauthorized' />
    } else {
        return (
            <Route {...rest} render={
                props => {
                    if (user) {
                        return <Component {...rest} {...props} />
                    } else {
                        console.log('noAutorizado')
                        return <Redirect to={
                            {
                                pathname: '/Unauthorized',
                                state: {
                                    from: props.location
                                }
                            }
                        } />
                    }
                }
            } />
        )
    }

}

export default ProtectedRoute;

