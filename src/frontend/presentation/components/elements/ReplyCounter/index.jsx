import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import Icon from '@elements/Icon';
import LoadingIndicator from '@elements/LoadingIndicator';
import classNames from 'classnames';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import tt from 'counterpart';

class ReplyCounter extends React.Component {
    static propTypes = {
        score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClick: PropTypes.func,
        size: PropTypes.oneOf(['S', 'M', 'L']),
        repository: AppPropTypes.Content,
    };

    static defaultProps = {
        score: 0,
        onClick: () => {},
        size: 'M',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ReplyCounter'
        );
        autobind(this);
    }

    onClick(e) {
        if (e) e.stopPropagation();
        const {
            repository,
            showNew,
            current_user,
            showLogin,
            showPhoneConfirm,
            addSuccess,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        addSuccess(tt('flash.new_message_for_super'));
        showNew(repository, current_user);

        if (this.props.onClick) this.props.onClick();
    }

    render() {
        const { score, size } = this.props;

        const { onClick } = this;

        return (
            <div className={classNames('reply-counter', size)}>
                <div className="reply-counter__link" onClick={onClick}>
                    <Icon
                        src="comment"
                        size={size != 'S' ? '3x' : '2x'}
                        className="reply-counter__image"
                    />
                </div>
                {score == 'undefined' ? (
                    <div className="reply-counter__score">
                        <LoadingIndicator
                            type={'circle'}
                            style={{ marginTop: '-12px' }}
                        />
                    </div>
                ) : (
                    <div className="reply-counter__score">{`${score ||
                        0}`}</div>
                )}
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
        showNew: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        addSuccess: success => {
            dispatch(appActions.addSuccess({ success }));
        },
    })
)(ReplyCounter);
