import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import GradationButton from '@elements/GradationButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import AppPropTypes from '@extension/AppPropTypes';
import Ripple from '@elements/Ripple';
import models from '@network/client_models';
import tt from 'counterpart';

class RequestSimpleButton extends React.Component {
    static propTypes = {
        current_user: AppPropTypes.User,
        repository: AppPropTypes.User,
    };

    static defaultProps = {
        current_user: null,
        repository: models.User.build(),
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestSimpleButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {
            current_user,
            repository,
            isMyAccount,
            showNewRequest,
            showLogin,
            showPhoneConfirm,
        } = this.props;

        if (isMyAccount) return;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (!!current_user && !!repository && !!showNewRequest) {
            showNewRequest(current_user, repository);
        }
    }

    render() {
        const {
            current_user,
            repository,
            isMyAccount,
            showNewRequest,
        } = this.props;

        const { onClick } = this;
        return isMyAccount ? (
            <div />
        ) : (
            <GradationButton
                onClick={onClick}
                color={'blue'}
                src={'auction'}
                value={tt('g.request')}
                stop={true}
            />
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const isMyAccount = userActions.isMyAccount(state, props.repository);
        return {
            current_user,
            isMyAccount,
        };
    },

    dispatch => ({
        showNewRequest: (user, target_user) => {
            dispatch(contentActions.showNewRequest({ user, target_user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
    })
)(RequestSimpleButton);
