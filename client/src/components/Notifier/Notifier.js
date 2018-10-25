import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

import { withStyles } from "@material-ui/core/styles";

let notifyFn, closeFn;

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    success: {
        backgroundColor: "#43A047",
    },
    error: {
        backgroundColor: "#D22F2F",
    },
    info: {
        backgroundColor: "#1976D2",
    },
    warning: {
        backgroundColor: "#FFA000",
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: "flex",
        alignItems: "center"
    }
});

function MySnackbarContent(props) {
    const {classes, className, message, variant} = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    { variant ? (<Icon className={classNames(classes.icon, classes.iconVariant)} />) : null }
                    { message }
                </span>
            }
        />
    );
}

MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["success", "warning", "error", "info"])
};

const MySnackbarContentWrapper = withStyles(styles)(MySnackbarContent);




class Notifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            messageInfo: {}
        };
    }

    queue = [];

    componentDidMount() {
        notifyFn = this.notify;
        closeFn = this.closeNotify;
    }

    // Public function
    notify = ({ message, type }) => {

        this.queue.push({
            message: message,
            type: type,
            key: new Date().getTime(),
        });

        if (this.state.open && this.props.autoHide) {
            this.setState({ open: false });
        } else {
            this.processQueue();
        }
    };

    closeNotify = () => {
        this.handleClose();
    };

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                open: true,
            });
        }
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    handleExited = () => {
        this.processQueue();
    };

    render() {
        let autoHide = this.props.autoHide;
        const { message, type, key } = this.state.messageInfo;

        return (
            autoHide ? (
                <Snackbar
                    key={ key }
                    open={ this.state.open }
                    onClose={ this.handleClose }
                    onExited={ this.handleExited }
                    autoHideDuration={ this.props.autoHideDuration || 6000 }
                    anchorOrigin={ this.props.anchorOrigin }
                >
                    <MySnackbarContentWrapper
                        variant={ type }
                        message={ message }
                    />
                </Snackbar>
            ) : (
                <Snackbar
                    open={ this.state.open }
                    anchorOrigin={ this.props.anchorOrigin }
                >
                    <MySnackbarContentWrapper
                        variant={ type }
                        message={ message }
                    />
                </Snackbar>
            )
        );
    }
}

export function notify({ message, type }) {
    notifyFn({ message, type });
}

export function closeNotify() {
    closeFn();
}

export default Notifier;