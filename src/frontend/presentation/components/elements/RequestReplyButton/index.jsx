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
import Icon from '@elements/Icon';
import safe2json from '@extension/safe2json';
import tt from 'counterpart';

class RequestReplyButton extends React.Component {
    static propTypes = {
        current_user: AppPropTypes.User,
        repository: AppPropTypes.Request,
        showNewForRequest: PropTypes.func.isRequired,
    };

    static defaultProps = {
        current_user: null,
        repository: models.Request.build(),
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestReplyButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    onClick(e) {
        const {
            repository,
            showNewForRequest,
            current_user,
            showLogin,
            showPhoneConfirm,
        } = this.props;
        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user) {
            showPhoneConfirm();
            return;
        }
        if (!!repository && !!showNewForRequest) {
            showNewForRequest(repository);
        }
    }

    render() {
        const { current_user, repository, showNewForRequest } = this.props;

        const { onClick } = this;

        return (
            <SimpleButton
                active={false}
                value={tt('g.do_answer')}
                src="debate"
                onClick={onClick}
            />
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        return {
            current_user,
        };
    },

    dispatch => ({
        showNewForRequest: request => {
            dispatch(contentActions.showNewForRequest({ requests: [request] }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
    })
)(RequestReplyButton);
