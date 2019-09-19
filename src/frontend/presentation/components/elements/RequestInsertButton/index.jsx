import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import tt from 'counterpart';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import AppPropTypes from '@extension/AppPropTypes';

class RequestInsertButton extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestInsertButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {
            showNew,
            current_user,
            showPhoneConfirm,
            showLogin,
            addSuccess,
            repository,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (e) e.preventDefault();
        addSuccess(tt('flash.new_message_for_super'));
        showNew(repository, current_user);
    }

    render() {
        return (
            <Ripple>
                <div className="request-insert-button" onClick={this.onClick}>
                    <div className="request-insert-button__icon">
                        <Icon
                            src={'plus'}
                            size={'3x'}
                            className="request-insert-button__icon-image"
                        />
                    </div>
                    <div className="request-insert-button__value">
                        {tt('g.request')}
                    </div>
                </div>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        showNew: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showLogin: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showPhoneConfirm());
        },
        addSuccess: success => {
            dispatch(appActions.addSuccess({ success }));
        },
    })
)(RequestInsertButton);
