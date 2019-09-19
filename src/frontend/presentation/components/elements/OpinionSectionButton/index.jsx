import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as appActions from '@redux/App/AppReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SimpleButton from '@elements/SimpleButton';
import GradationButton from '@elements/GradationButton';
import tt from 'counterpart';
import EmbedNavigator from '@modules/EmbedNavigator';
import PictureItem from '@elements/PictureItem';

class OpinionSectionButton extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OpinionSectionButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        const { repository } = this.props;
    }

    componentWillReceiveProps(nextProps) {
        const { repository } = nextProps;
    }

    onClick(e) {
        const {
            _repository,
            showNew,
            showLogin,
            showPhoneConfirm,
            current_user,
            addSuccess,
        } = this.props;

        if (e) e.stopPropagation();

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (showNew) {
            addSuccess(tt('flash.new_message_for_super'));
            showNew(_repository, current_user);
        }
    }

    render() {
        const {
            _repository,
            target,
            current_user,
            isShowOpinionButton,
        } = this.props;

        const src = current_user
            ? current_user.picture_small
            : '/icons/noimage.svg';

        const alt = current_user ? current_user.nickname : '/icons/noimage.svg';

        return (
            <div className="opinion-section-button" onClick={this.onClick}>
                <div className="opinion-section-button__user">
                    <PictureItem url={src} width={32} radius={16} alt={alt} />
                </div>
                <div className="opinion-section-button__input">
                    {tt('g.do_comment') + '...'}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const _repository = contentActions.bind(props.repository, state);
        return {
            _repository,
            current_user: authActions.getCurrentUser(state),
            isShowOpinionButton: contentActions.isShowOpinionButton(
                _repository,
                state
            ),
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
)(OpinionSectionButton);
