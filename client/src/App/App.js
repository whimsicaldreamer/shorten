import React, { Component } from "react";
import Home from "../components/Home";
import Redirect from "../components/Redirect";
import { Switch, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/" component={ Home } />
                    <Route component={ Redirect } />
                </Switch>
            </div>
        );
    }
}

export default App;
