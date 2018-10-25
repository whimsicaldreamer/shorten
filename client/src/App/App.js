import React, { Component } from "react";
import Shortener from "../components/Shortener";
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header>
                    <div className="navBar">
                        <div className="content">
                            <div className="brand">
                                Shorten
                            </div>
                            <div className="navigation">
                                <a className="inverted">Login</a>
                                <a>Sign Up</a>
                            </div>
                        </div>
                    </div>
                </header>
                <section className="mainContainer">
                    <div className="container">
                        <h1>Shorten your loooooooong URLs.</h1>
                        <h3>Shorten, target and track every link created with Shorten</h3>
                        <Shortener/>
                        <div className="navigation">
                            <a>Get Started</a>
                            <a className="inverted">Learn More</a>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default App;
