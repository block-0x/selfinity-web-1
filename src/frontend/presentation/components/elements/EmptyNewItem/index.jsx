import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import tt from 'counterpart';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import PictureItem from '@elements/PictureItem';

class EmptyNewItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'EmptyNewItem'
        );
    }

    onClick(e) {
        const {
            showNewComment,
            current_user,
            showPhoneConfirm,
            showLogin,
            repository,
            addSuccess,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (current_user && repository) {
            addSuccess(tt('flash.new_message_for_super'));
            showNewComment(repository, current_user);
        }
    }

    render() {
        const { onClick } = this;

        const { current_user } = this.props;

        const src = current_user
            ? current_user.picture_small
            : '/icons/noimage.svg';

        const alt = current_user ? current_user.nickname : '/icons/noimage.svg';

        return (
            <div className="empty-new-item" onClick={onClick}>
                <div className="empty-new-item__user">
                    <PictureItem url={src} width={32} radius={16} alt={alt} />
                </div>
                <div className="empty-new-item__input">
                    {tt('g.do_comment') + '...'}
                </div>
            </div>
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
        showNewComment: (content, user) => {
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
)(EmptyNewItem);
