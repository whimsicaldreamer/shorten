import React, { Component, Fragment } from "react";
import axios from "axios";
import Notifier, { notify } from "../Notifier";
import Modal from "react-responsive-modal";
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';
import clipboardCopy from "clipboard-copy";
import QRCode from "qrcode.react";
import Sharer from "../Sharer";
import "./Shortener.css";

class Shortener extends Component {
    constructor(props) {
        super(props);
        this.state = {
            longUrl: "",
            shortUrl: "",
            modalActive: false,
        }
    }

    generateShortUrl = () => {
        let url = this.state.longUrl;

        if(url) {
            axios.post("/api/url", {
                longUrl: url,
            })
                .then(response => {
                    this.setState({
                        modalActive: true,
                        shortUrl: response.data.shortUrl,
                    });
                })
                .catch(error => {
                    let errorStatus = error.response.data.status;
                    let msg;
                    switch (errorStatus) {
                        case "FAILED":
                            msg = "Something went wrong. Try again!";
                            break;
                        case "INVALID_URL":
                            msg = "Please enter a proper URL";
                            break;
                        case "INVALID_ALIAS":
                            msg = "Aliases can contain only A-Z, a-z, 0-9, -, _ only.";
                            break;
                        case "DUPLICATE":
                            msg = "The alias already exists.";
                            break;
                        default:
                            msg = "An unknown error occurred. Try after sometime!";
                    }

                    notify({
                        message: msg,
                        type: "error"
                    });
                })
        }
        else {
            notify({
                message: "URL cannot be empty",
                type: "error"
            });
        }
    };

    closeModal = () => {
        this.setState({ modalActive: false });
    };

    copyToClipboard = () => {
        clipboardCopy(`http://${ this.state.shortUrl }`);
        notify({
            message: "Copied to clipboard",
            type: "success"
        });
    };

    render() {
        return (
            <Fragment>
                <Notifier
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    autoHide={ true }
                />


                <Modal
                    center
                    onClose={ () => this.setState({ modalActive: false }) }
                    open={ this.state.modalActive }
                    showCloseIcon={ false }
                    classNames={
                        {
                            "overlay": "overlay",
                            "modal": "modal"
                        }
                    }
                >
                    <div className="title">
                        Your Short URL
                        <IconButton
                            classes={{ root: "closeBtn" }}
                            disableRipple={ true }
                            onClick={ this.closeModal }
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="modalContent">
                        <div className="shortUrlContainer">
                            <span className="short-url">
                                { this.state.shortUrl }
                                <IconButton
                                    classes={{ root: "copyBtn" }}
                                    disableRipple={ true }
                                    onClick={ this.copyToClipboard }
                                    aria-label="copy"
                                >
                                    <FileCopyIcon />
                                </IconButton>
                            </span>
                        </div>
                        <div className="qrcodeContainer">
                            <QRCode value={`http://${this.state.shortUrl}`} renderAs="svg" size={200} />
                            <div className="share">
                                <Sharer
                                    text = "Check out this useful link: "
                                    url = {`http://${this.state.shortUrl}`}
                                />
                            </div>
                        </div>
                        <div className="actions">
                            <Button
                                classes={{ root: "doneBtn"}}
                                variant="contained"
                                size="large"
                                disableRipple={ true }
                                onClick={ this.closeModal }
                            >
                                DONE
                            </Button>
                        </div>
                    </div>
                </Modal>









                <div className="shortener">
                    <div className="inputContainer">
                        <input
                            placeholder="Paste your long URL"
                            value={ this.state.longUrl }
                            onChange={ e => this.setState({ longUrl: e.target.value })}
                        />
                    </div>
                    <button onClick={ this.generateShortUrl }>SHORTEN</button>
                </div>
            </Fragment>
        )
    }
}

export default Shortener;
