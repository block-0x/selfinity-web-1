import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as sessionActions from '@redux/Session/SessionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import LoginModalList from '@cards/LoginModalList';
import CloseButton from '@elements/CloseButton';
import tt from 'counterpart';
import Responsible from '@modules/Responsible';
import IconButton from '@elements/IconButton';
import { resendConfirmationMailRoute } from '@infrastructure/RouteInitialize';

class ResendConfirmationMailModal extends React.Component {
    static propTypes = {
        type: PropTypes.object,
        mode: PropTypes.object,
        onCancel: PropTypes.func,
        content: PropTypes.object,
        ParentId: PropTypes.number,
    };

    static defaultProps = {
        ParentId: null,
    };

    static pushURLState(title) {
        if (window)
            window.history.pushState(
                {},
                title,
                resendConfirmationMailRoute.path
            );
    }

    static state = {
        beforePathname: '/',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ResendConfirmationMailModal'
        );
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.setState({
            beforePathname:
                browserHistory.getCurrentLocation().pathname !=
                    resendConfirmationMailRoute.path &&
                browserHistory.getCurrentLocation().pathname,
        });
    }

    componentDidMount() {
        ResendConfirmationMailModal.pushURLState(tt('g.signup'));
    }

    componentWillUnmount() {
        // if (!!this.state.beforePathname)
        //     browserHistory.push(this.state.beforePathname);
    }

    onCancel = e => {
        const { onCancel } = this.props;
        this.setState({ beforePathname: null });
        if (onCancel) onCancel();
    };

    render() {
        const { onCancel } = this.props;

        return (
            <div className="login-modal">
                <Responsible
                    defaultContent={
                        <CloseButton
                            onClick={onCancel}
                            className="login-modal__button"
                        />
                    }
                    breakingContent={
                        <IconButton
                            onClick={onCancel}
                            src="close"
                            size={'2x'}
                        />
                    }
                    breakMd={true}
                    className="login-modal__button"
                />
                <div className="login-modal-items">
                    <LoginModalList
                        onCancel={this.onCancel}
                        confirmationMail={true}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ResendConfirmationMailModal);
