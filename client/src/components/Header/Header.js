import React, {Component, Fragment} from "react";
import "./Header.css";

class Header extends Component {
    static defaultProps = {
        showNav: true
    };

    render() {
        let { showNav } = this.props;

        return (
            <Fragment>
                <header>
                    <div className="navBar">
                        <div className="content">
                            <div className="brand">
                                Shorten
                            </div>
                            {
                                showNav ? (
                                    <div className="navigation">
                                        <a className="inverted">Login</a>
                                        <a>Sign Up</a>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </header>
            </Fragment>
        )
    }
}

export default Header;