import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '@elements/Icon';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import tt from 'counterpart';

class ReplySection extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (e) e.stopPropagation();
        const {
            onClick,
            showNew,
            repository,
            current_user,
            showLogin,
            addSuccess,
            showPhoneConfirm,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (showNew) {
            addSuccess(tt('flash.new_message_for_super'));
            showNew(repository, current_user);
        }
        if (onClick) onClick();
    }

    render() {
        return (
            <div className="reply-section">
                <Link className="reply-section__link" onClick={this.onClick}>
                    <Icon
                        src="debate"
                        size={'2_4x'}
                        className="reply-section__image"
                    />
                </Link>
                <div className="reply-section__title">
                    {tt('g.disscussion')}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const repository = contentActions.getShowContent(state).content;
        return {
            current_user,
            repository,
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
)(ReplySection);
