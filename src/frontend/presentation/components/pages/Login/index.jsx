import React from 'react';
import LoginForm from '@modules/LoginForm';
import tt from 'counterpart';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as appActions from '@redux/App/AppReducer';
import { connect } from 'react-redux';
import LoadingIndicator from '@elements/LoadingIndicator';
import OAuthButtons from '@modules/OAuthButtons';
import { loginRoute } from '@infrastructure/RouteInitialize';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { ClientError } from '@extension/Error';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Login');
    }

    componentWillMount() {
        const { isHeaderVisible, location, addError } = this.props;

        location.query.error_key && addError(location.query.error_key);
    }

    render() {
        const { isHeaderVisible, location } = this.props;

        const parent_className = isHeaderVisible
            ? 'login'
            : 'login header-hidden';
        const body_className = isHeaderVisible
            ? 'login__body'
            : 'login__body header-hidden';

        if (!process.env.BROWSER) {
            // don't render this page on the server
            return (
                <div className={parent_className}>
                    <div className="signup__load">
                        <LoadingIndicator />
                    </div>
                </div>
            );
        }

        return (
            <div className={parent_className}>
                <div className="login__background" />
                <div className={body_className}>
                    <OAuthButtons isSession={false} />
                    <div className="login__login-form fade-in--1">
                        <LoginForm />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'login',
    component: connect(
        (state, ownProps) => {
            const isHeaderVisible = state.app.get('show_header');
            return {
                isHeaderVisible,
            };
        },
        dispatch => ({
            showHeader: () => dispatch(appActions.showHeader()),
            hideHeader: () => dispatch(appActions.hideHeader()),
            addError: (tt_key, tt_params = null) =>
                dispatch(
                    appActions.addError({
                        error: new ClientError({
                            error: new Error(tt_key),
                            tt_key,
                            tt_params,
                        }),
                    })
                ),
        })
    )(Login),
};
