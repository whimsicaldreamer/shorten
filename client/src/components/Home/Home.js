import React, {Component, Fragment} from "react";
import Header from "../Header";
import Shortener from "../Shortener";
import "./Home.css";

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Header />
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
            </Fragment>
        )
    }
}

export default Home;