import React, { Component, Fragment } from "react";
import TextMessageIcon from "@material-ui/icons/MessageOutlined";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebookF, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Sharer.css";

library.add(faFacebookF, faTwitter, faWhatsapp);


class Sharer extends Component {
    /*
     *  `href` attributes could have been easily added to
     *  anchor tags but they are being hidden if ad-blockers are active.
     *  Hence, a hacky way to keep sharing options visible
     */
    shareOn = (e) => {
        let brand = e.target.id;
        let shareURL;

        switch (brand) {
            case "twitter":
                shareURL = `https://twitter.com/share?text=${ this.props.text }&url=${ this.props.url }`;
                break;
            case "facebook":
                shareURL = `https://www.facebook.com/sharer.php?u=${ this.props.url }`;
                break;
            default:
                return;
        }

        window.open(shareURL, "_blank");
    };

    render() {
        return (
            <Fragment>
                <ul className="share-brands">
                    <li className="share-title">Share</li>
                    <li className="share-opt">
                        <a id="twitter" onClick={ e => this.shareOn(e) }>
                            <div><FontAwesomeIcon icon={["fab", "twitter"]}/></div>
                            Twitter
                        </a>
                    </li>
                    <li className="share-opt">
                        <a id="facebook" onClick={ e => this.shareOn(e) }>
                            <div><FontAwesomeIcon icon={["fab", "facebook-f"]}/></div>
                            Facebook
                        </a>
                    </li>
                    <li className="share-opt">
                        <a id="whatsapp" href={`https://wa.me/?text=${this.props.text}${this.props.url}`}>
                            <div><FontAwesomeIcon icon={["fab", "whatsapp"]}/></div>
                            WhatsApp
                        </a>
                    </li>
                    <li className="share-opt">
                        <a id="text" href={`sms:?body=${this.props.text}${this.props.url}`}>
                            <div><TextMessageIcon/></div>
                            Text
                        </a>
                    </li>
                    <li className="share-opt">
                        <a id="email" href={`mailto:?body=${this.props.text}${this.props.url}`}>
                            <div><EmailIcon/></div>
                            Email
                        </a>
                    </li>
                </ul>
            </Fragment>
        )
    }
}

export default Sharer;