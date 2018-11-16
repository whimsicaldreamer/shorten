import React, { Component, Fragment } from "react";
import axios from "axios";
import Header from "../Header";
import "./Redirect.css";

function Error(props) {
    let errorType = props.errorType;

    return (
        <Fragment>
            <Header showNav={ false } />
            <section className="container">
                <div className="inner">
                    <ErrorMsg type={ errorType } />
                </div>
            </section>
        </Fragment>
    );
}

function ErrorMsg(props) {
    let errorType = props.type;

    if(errorType === "NOT_FOUND") {
        return (
            <Fragment>
                <p>404: Page Not Found - The page <strong>https://examp.le/1234</strong> does not exist.</p>
                <p>If you typed in or copied/pasted this URL, make sure you included all the characters, with no extra punctuation.</p>
            </Fragment>
        )
    }
    else {
        return (
            <Fragment>
                <p>500: Internal Server Error - We encountered an error while redirecting you.</p>
                <p>Try again after some time.</p>
            </Fragment>
        )
    }
}

class Redirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayError: false,
            errorType: "",
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;

        axios.get(`/api/${id}`)
            .then(response => {
                window.location.replace(response.data.url);
            })
            .catch(error => {
                this.setState({ displayError: true, errorType: error.response.data.status })
            });
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.displayError ? (
                        <Error errorType={ this.state.errorType } />
                    ) : null
                }
            </Fragment>
        )
    }
}

export default Redirect;