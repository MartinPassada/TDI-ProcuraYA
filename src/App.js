import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

//pages
import Home from './pages/Home'
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";
import NewLandingPage from './pages/NewLandingPage'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './pages/ProtectedRoute'
import Unauthorized from './pages/Unauthorized'


function App() {

  const handleLogout = async () => {
    await fetch('/logout')
      .then(response => {
        if (response.status === 200 || response.status === 500) {
          window.location.replace('/');
        }
      })
  }

  return (
    <Router>
      <Switch>
        <NewLandingPage exact path="/" />
        <ProtectedRoute exact path='/Home' handleLogout={handleLogout} component={Home} />
        <Route exact path='/Unauthorized' component={Unauthorized} />
        <Route exact path="/CreateAccount" component={CreateAccount} />
        <Route exact path="/ResetPassword" component={ResetPassword} />
      </Switch>
    </Router >
  );
}

export default App;
