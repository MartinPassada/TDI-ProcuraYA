import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

//pages
import Home from './pages/Home'
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";
import ResetPassword from './pages/ResetPassword'
//import { state } from './components/isAuthenticated'
//var isAutenticated = state();
/*async function state() {
  await fetch('/getUserName', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      if (response.status === 200) {
        isAutenticated = true;
      } else if (response.status === 403) {
        console.log('salio por aca')
        isAutenticated = false;
      } else {
        isAutenticated = false;
      }
    })

}*/


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/Home">
          <Home />
        </Route>
        {/*isAutenticated ? <> <Route path="/Home" exact component={Home} /> </> : <Redirect to="/" />*/}
        <Route exact path="/CreateAccount">
          <CreateAccount />
        </Route>
        <Route exact path="/ResetPassword">
          <ResetPassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
