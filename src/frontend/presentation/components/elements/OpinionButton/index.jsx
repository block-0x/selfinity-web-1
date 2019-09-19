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

class OpinionButton extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OpinionButton'
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

        return (
            <SimpleButton
                active={false}
                onClick={this.onClick}
                value={tt('g.do_comment')}
                src={'comment'}
                color={'red'}
                stop={true}
            />
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
)(OpinionButton);
