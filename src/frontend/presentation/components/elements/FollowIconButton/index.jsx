import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import tt from 'counterpart';
import SimpleIconButton from '@elements/SimpleIconButton';
import AppPropTypes from '@extension/AppPropTypes';

class FollowIconButton extends React.Component {
    static propTypes = {
        current_user: AppPropTypes.User,
        repository: AppPropTypes.User,
        isFollow: PropTypes.bool,
    };

    static defaultProps = {
        current_user: null,
        repository: models.User.build(),
        isFollow: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'FollowIconButton'
        );
    }

    componentWillMount() {
        this.setState({
            isFollow: this.props.isFollow,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isFollow: nextProps.isFollow,
        });
    }

    onClick(e) {
        const {
            follow,
            unfollow,
            current_user,
            repository,
            showLogin,
        } = this.props;

        const { isFollow } = this.state;

        if (!current_user) {
            showLogin();
            return;
        }

        if (isFollow) {
            unfollow(current_user, repository);
        } else {
            follow(current_user, repository);
        }

        this.setState({
            isFollow: !isFollow,
        });
    }

    render() {
        const { current_user, repository, isMyAccount } = this.props;
        const { isFollow } = this.state;
        const { onClick } = this;

        return isMyAccount ? (
            <div />
        ) : (
            <SimpleIconButton
                className="follow-icon-button__image"
                src="follow"
                size="2x"
                onClick={onClick}
                active={isFollow}
            />
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const isFollow = !!props.repository
            ? userActions.isFollow(state, props.repository)
            : false;
        const isMyAccount = userActions.isMyAccount(state, props.repository);
        return {
            current_user,
            isFollow,
            isMyAccount,
        };
    },
    dispatch => ({
        follow: (user, target_user) => {
            dispatch(transactionActions.follow({ user, target_user }));
        },
        unfollow: (user, target_user) => {
            dispatch(transactionActions.unfollow({ user, target_user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
    })
)(FollowIconButton);
