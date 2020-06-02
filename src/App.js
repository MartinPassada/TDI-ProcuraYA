import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//pages
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";
import ResetPassword from './pages/ResetPassword'


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path='/Home'>
          <Home />
        </Route>
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
