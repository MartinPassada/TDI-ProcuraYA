import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { useState, useEffect } from 'react';



//pages
import Home from './pages/Home'
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './pages/ProtectedRoute'
import Unauthorized from './pages/Unauthorized'


function App() {
  const [user, setUser] = useState(1);

  /*useEffect(() => {
    //window.location.replace('/Home')
  }, [user])*/

  const handleLogin = async () => {
    console.log('volvio a app');
    setUser(1)
    //window.location.replace('/Home')
  }

  const handleLogout = async () => {
    await fetch('/logout')
      .then(response => {
        if (response.status === 200 || response.status === 500) {
          setUser(0);
          window.location.replace('/');
        }
      })
  }

  return (
    <Router>
      <Switch>
        <LandingPage exact path="/" handleLogin={handleLogin} />
        <ProtectedRoute exact path='/Home' user={user} handleLogout={handleLogout} component={Home} />
        <Route exact path='/Unauthorized' component={Unauthorized} />
        <Route exact path="/CreateAccount" handleLogin={handleLogin} component={CreateAccount} />
        <Route exact path="/ResetPassword" component={ResetPassword} />
      </Switch>
    </Router >
  );
}

export default App;
