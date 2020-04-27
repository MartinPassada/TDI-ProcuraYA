import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//pages
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";

//components
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

//css
import "./css/App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <LandingPage />
        </Route>
        <Route exact path='/Home'>
          <Home />
        </Route>
        <Route path="/CreateAccount">
          <CreateAccount />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
