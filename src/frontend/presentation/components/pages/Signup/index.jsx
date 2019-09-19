import React from 'react';
import SignupForm from '@modules/SignupForm';
import tt from 'counterpart';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as appActions from '@redux/App/AppReducer';
import { connect } from 'react-redux';
import LoadingIndicator from '@elements/LoadingIndicator';
import OAuthButtons from '@modules/OAuthButtons';
import { signupRoute } from '@infrastructure/RouteInitialize';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { SIGNUP_STEP } from '@entity';
import { ClientError } from '@extension/Error';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Signup');
    }

    componentWillMount() {
        const { isHeaderVisible, location, addError } = this.props;

        location.query.error_key && addError(location.query.error_key);
    }

    render() {
        const { isHeaderVisible, location, addError } = this.props;

        const parent_className = isHeaderVisible
            ? 'signup'
            : 'signup header-hidden';
        const body_className = isHeaderVisible
            ? 'signup__body'
            : 'signup__body header-hidden';

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
                <div className="signup__background">
                    <div className={body_className}>
                        <div className="signup__signup-form fade-in--1">
                            <SignupForm location={this.props.location} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'signup',
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
    )(Signup),
};
