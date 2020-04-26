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
<<<<<<< HEAD
        <Route path="/">
=======
        <Route exact path='/'>
>>>>>>> ef026c6f431b08d85805f189a066d7f9006b2fbc
          <LandingPage />
        </Route>
        <Route path="/Home">
          <Home />
        </Route>
<<<<<<< HEAD
        <Route path="/CreateAccount">
=======
        <Route exact path='/CreateAccount'>
>>>>>>> ef026c6f431b08d85805f189a066d7f9006b2fbc
          <CreateAccount />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
