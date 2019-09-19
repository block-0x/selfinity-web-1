import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { confirmForPrivateKeyRoute } from '@infrastructure/RouteInitialize';
import LoginModalList from '@cards/LoginModalList';
import CloseButton from '@elements/CloseButton';
import tt from 'counterpart';
import Responsible from '@modules/Responsible';
import IconButton from '@elements/IconButton';

class LoginModalForPrivateKey extends React.Component {
    static propTypes = {
        type: PropTypes.object,
        mode: PropTypes.object,
        onCancel: PropTypes.func,
        content: PropTypes.object,
        ParentId: PropTypes.number,
    };

    static defaultProps = {
        ParentId: null,
    };

    static pushURLState(title) {
        if (window)
            window.history.pushState({}, title, confirmForPrivateKeyRoute.path);
    }

    static state = {
        beforePathname: '/',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'LoginModalForPrivateKey'
        );
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.setState({
            beforePathname:
                browserHistory.getCurrentLocation().pathname !=
                    confirmForPrivateKeyRoute.path &&
                browserHistory.getCurrentLocation().pathname,
        });
    }

    componentDidMount() {
        LoginModalForPrivateKey.pushURLState(tt('g.login'));
    }

    componentWillUnmount() {
        // if (!!this.state.beforePathname)
        //     browserHistory.push(this.state.beforePathname);
    }

    onCancel = e => {
        const { onCancel } = this.props;
        this.setState({ beforePathname: null });
        if (onCancel) onCancel();
    };

    render() {
        const { onCancel } = this.props;

        return (
            <div className="login-modal">
                <Responsible
                    defaultContent={
                        <CloseButton
                            onClick={onCancel}
                            className="login-modal__button"
                        />
                    }
                    breakingContent={
                        <IconButton
                            onClick={onCancel}
                            src="close"
                            size={'2x'}
                        />
                    }
                    breakMd={true}
                    className="login-modal__button"
                />
                <div className="login-modal-items">
                    <LoginModalList
                        onCancel={this.onCancel}
                        confirmForPrivateKey={true}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(LoginModalForPrivateKey);
