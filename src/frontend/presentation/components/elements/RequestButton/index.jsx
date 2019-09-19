import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import SimpleButton from '@elements/SimpleButton';
import models from '@network/client_models';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import Ripple from '@elements/Ripple';
import IconButton from '@elements/IconButton';
import GradationIconButton from '@elements/GradationIconButton';

class RequestButton extends React.Component {
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
            'RequestButton'
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
            <GradationIconButton
                className="request-button__image"
                src="auction"
                size="2x"
                color={'blue'}
                onClick={onClick}
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
)(RequestButton);
