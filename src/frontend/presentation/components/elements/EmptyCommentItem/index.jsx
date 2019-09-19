import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import * as userActions from '@redux/User/UserReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import CollectionItem from '@elements/CollectionItem';
import tt from 'counterpart';
import Responsible from '@modules/Responsible';
import GradationButton from '@elements/GradationButton';

class EmptyCommentItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'EmptyCommentItem'
        );
        this.handleClickComment = this.handleClickComment.bind(this);
        this.handleClickReques = this.handleClickRequest.bind(this);
        this.handleClickPost = this.handleClickPost.bind(this);
    }

    handleClickComment = e => {
        const {
            repository,
            showNewComment,
            current_user,
            showPhoneConfirm,
            showLogin,
            addSuccess,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (repository && current_user) {
            addSuccess(tt('flash.new_message_for_super'));
            showNewComment(repository, current_user);
        }
    };

    handleClickRequest = e => {
        const {
            repository,
            showNewRequest,
            current_user,
            showPhoneConfirm,
            showLogin,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (repository && current_user)
            showNewRequest(current_user, repository.User);
    };

    handleClickPost = e => {
        const { repository, showNew, current_user } = this.props;
        if (current_user) showNew();
    };

    render() {
        const {
            current_user,
            repository,
            showNewComment,
            isMyAccount,
        } = this.props;

        if (!repository) return <div />;

        const isPostShow =
            isMyAccount || Number.prototype.castBool(repository.isPrivate);

        return (
            <div className="empty-comment-item__buttons">
                <div className="empty-comment-item__button">
                    <GradationButton
                        value={isPostShow ? tt('g.post') : tt('g.request')}
                        src={isPostShow ? 'post' : 'auction'}
                        color={isPostShow ? '' : 'blue'}
                        onClick={
                            isPostShow
                                ? this.handleClickPost
                                : this.handleClickRequest
                        }
                    />
                </div>
                <div className="empty-comment-item__button">
                    <GradationButton
                        value={tt('g.do_comment')}
                        src={'comment'}
                        color={'red'}
                        onClick={this.handleClickComment}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const repository = contentActions.getShowPrunedContent(state);
        return {
            current_user: authActions.getCurrentUser(state),
            repository,
            isMyAccount:
                repository && userActions.isMyAccount(state, repository.User),
        };
    },

    dispatch => ({
        showNewComment: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showNewRequest: (user, target_user) => {
            dispatch(contentActions.showNewRequest({ user, target_user }));
        },
        showNew: () => {
            dispatch(contentActions.showNew());
        },
        hideNew: () => {
            dispatch(contentActions.hideNew());
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
)(EmptyCommentItem);
