import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as labelActions from '@redux/Label/LabelReducer';
import * as appActions from '@redux/App/AppReducer';
import Icon from '@elements/Icon';
import PopoverMenu from '@modules/PopoverMenu';
import PopoverMenuItem from '@elements/PopoverMenuItem';
import PopoverContainer from '@cards/PopoverContainer';
import AppPropTypes from '@extension/AppPropTypes';
import ope from '@extension/operator';
import tt from 'counterpart';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class MoreMenu extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        repository: PropTypes.oneOfType([
            AppPropTypes.Content,
            AppPropTypes.Request,
        ]),
        current_user: AppPropTypes.User,
        repository_user: AppPropTypes.User,
    };

    static defaultProps = {
        onClick: () => {},
    };

    state = {
        popoverVisible: false,
    };

    constructor(props) {
        super(props);
        this.handleMoreMenuVisibleChange = e => {
            this.setState({
                popoverVisible: !this.state.popoverVisible,
            });
        };
        this.onClick = this.onClick.bind(this);
        this.handleMoreMenuVisibleChange = this.handleMoreMenuVisibleChange.bind(
            this
        );
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickComment = this.onClickComment.bind(this);
        this.onClickForRequest = this.onClickForRequest.bind(this);
        this.requireLogin = this.requireLogin.bind(this);
        this.onClickStock = this.onClickStock.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'MoreMenu');
    }

    requireLogin() {
        if (!this.props.current_user) {
            this.props.showLogin();
        } else if (!this.props.current_user.verified) {
            this.props.showPhoneConfirm();
        }
        return !!this.props.current_user;
    }

    onClick(e) {
        if (e) e.stopPropagation();
        this.props.onClick();
    }

    onClickEdit(e) {
        const { repository, showNewForEdit } = this.props;
        if (!this.requireLogin()) return;
        if (!!repository) showNewForEdit(repository);
    }

    onClickDelete(e) {
        const { repository, deleteContent, deleteRequest } = this.props;
        if (!this.requireLogin()) return;
        if (!!repository) {
            ope.isRequest(repository)
                ? deleteRequest(repository)
                : deleteContent(repository);
        }
    }

    onClickComment(e) {
        const {
            repository,
            showNewComment,
            current_user,
            addSuccess,
        } = this.props;
        if (!this.requireLogin()) return;
        if (!!repository) {
            addSuccess(tt('flash.new_message_for_super'));
            showNewComment(repository, current_user);
        }
    }

    onClickStock(e) {
        const { repository, stock, current_user } = this.props;
        if (!this.requireLogin()) return;
        if (!!repository) stock(current_user, repository);
    }

    onClickForRequest(e) {
        const { repository, showNewForRequest, current_user } = this.props;
        if (!this.requireLogin()) return;
        if (!!repository) showNewForRequest(repository);
    }

    render() {
        const {
            onClick,
            onClickEdit,
            onClickDelete,
            onClickComment,
            onClickForRequest,
            onClickStock,
        } = this;

        const {
            repository,
            repository_user,
            current_user,
            showLogin,
        } = this.props;

        const popover = () => {
            if (!current_user)
                return (
                    <PopoverMenu>
                        <PopoverMenuItem
                            key="comment"
                            value={tt('g.do_comment')}
                            src="comment"
                            onClick={onClickComment}
                        />
                        <PopoverMenuItem
                            key="login"
                            value={tt('g.login')}
                            src="noimage"
                            onClick={showLogin}
                        />
                    </PopoverMenu>
                );

            switch (true) {
                case ope.isContent(repository) &&
                    repository_user.id == current_user.id:
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="edit"
                                value={tt('g.edit')}
                                src="post"
                                onClick={onClickEdit}
                            />
                            <PopoverMenuItem
                                key="delete"
                                value={tt('g.delete')}
                                src="circle-close"
                                onClick={onClickDelete}
                            />
                            <PopoverMenuItem
                                key="comment"
                                value={tt('g.do_comment')}
                                src="comment"
                                onClick={onClickComment}
                            />
                        </PopoverMenu>
                    );
                case ope.isContent(repository) &&
                    repository_user.id != current_user.id:
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="comment"
                                value={tt('g.do_comment')}
                                src="comment"
                                onClick={onClickComment}
                            />
                        </PopoverMenu>
                    );
                case ope.isRequest(repository) &&
                    repository_user.id == current_user.id:
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="edit"
                                value={tt('g.edit')}
                                src="post"
                                onClick={onClickEdit}
                            />
                            <PopoverMenuItem
                                key="delete"
                                value={tt('g.delete')}
                                src="circle-close"
                                onClick={onClickDelete}
                            />
                        </PopoverMenu>
                    );
                case ope.isRequest(repository) &&
                    repository_user.id != current_user.id &&
                    repository.VoteredId == current_user.id &&
                    !repository.isResolved &&
                    !repository.isAnswered:
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="reply"
                                value={tt('g.do_answer')}
                                src="comment"
                                onClick={onClickForRequest}
                            />
                        </PopoverMenu>
                    );
                case ope.isLabel(repository):
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="stock"
                                value={tt('g.stock')}
                                src="plus"
                                onClick={onClickStock}
                            />
                        </PopoverMenu>
                    );
                default:
                    return (
                        <PopoverMenu>
                            <PopoverMenuItem
                                key="nothing"
                                value={tt('g.dismiss')}
                                src="close"
                            />
                        </PopoverMenu>
                    );
            }
        };
        return (
            <div className="moremenu">
                <PopoverContainer
                    visible={this.state.popoverVisible}
                    onVisibleChange={this.handleMoreMenuVisibleChange}
                    content={popover()}
                >
                    <Icon
                        src="more"
                        size={'2_4x'}
                        className="moremenu__image"
                    />
                </PopoverContainer>
            </div>
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
        showNewForEdit: content => {
            dispatch(contentActions.showNewForEdit({ content }));
        },
        deleteContent: content => {
            dispatch(contentActions.deleteContent({ content }));
        },
        deleteRequest: request => {
            dispatch(transactionActions.deleteRequest({ request }));
        },
        showNewComment: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showNewForRequest: request => {
            dispatch(contentActions.showNewForRequest({ requests: [request] }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin({ isError: false }));
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        stock: (user, label) => {
            dispatch(labelActions.stock({ user, label }));
        },
        unstock: (user, label) => {
            dispatch(labelActions.unstock({ user, label }));
        },
        addSuccess: success => {
            dispatch(appActions.addSuccess({ success }));
        },
    })
)(MoreMenu);

/*

*/
