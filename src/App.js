import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//pages
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";


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
      </Switch>
    </Router>
  );
}

export default App;
