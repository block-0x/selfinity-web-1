import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import tt from 'counterpart';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';

class IntroductionNewButton extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'IntroductionNewButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {
            showNew,
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

        if (e) e.preventDefault();
        showNew();
    }

    render() {
        return (
            <Ripple>
                <div className="introduction-new-button" onClick={this.onClick}>
                    <div className="introduction-new-button__icon">
                        <Icon
                            src={'plus'}
                            size={'3x'}
                            className="introduction-new-button__icon-image"
                        />
                    </div>
                    <div className="introduction-new-button__value">
                        {tt('g.add_wanted')}
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
        showNew: () => {
            dispatch(contentActions.showNewForWanted());
        },
        showLogin: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showPhoneConfirm());
        },
    })
)(IntroductionNewButton);
