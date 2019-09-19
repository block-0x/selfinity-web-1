import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ReactDOM from 'react-dom';
import AlertMessages from '@modules/AlertMessages';
import Alert from '@elements/Alert';
import tt from 'counterpart';

class AlertContainer extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'AlertContainer'
        );
    }

    render() {
        const {
            showAcceptAlert,
            hideAcceptAlert,
            acceptRequests,
            denyRequests,
            acceptRequest,
            denyRequest,
            show_accept_alert,
            solving_requests,
            show_content,
        } = this.props;

        if (!show_accept_alert) return <div />;

        return (
            <div className="alert-container">
                {show_accept_alert && (
                    <AlertMessages>
                        <Alert
                            onCancel={() =>
                                denyRequest(solving_requests[0], show_content)
                            }
                            onComplete={() =>
                                acceptRequest(solving_requests[0], show_content)
                            }
                            onClose={hideAcceptAlert}
                            isTimeLimit={false}
                            title={tt('g.alert_request_title')}
                            message={tt('g.alert_request_desc')}
                            cancelText={tt('g.repayout')}
                            completeText={tt('g.payout')}
                        />
                    </AlertMessages>
                )}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            show_content: contentActions.getShowContent(state).content,
            show_accept_alert: state.request.get('show_accept_alert'),
            solving_requests: requestActions.getSolvingRequests(state),
        };
    },

    dispatch => ({
        showAcceptAlert: () => {
            dispatch(requestActions.showAcceptAlert());
        },
        hideAcceptAlert: () => {
            dispatch(requestActions.hideAcceptAlert());
        },
        acceptRequests: (requests, content) => {
            dispatch(transactionActions.acceptRequests({ requests, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
        denyRequests: (requests, content) => {
            dispatch(transactionActions.denyRequests({ requests, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
        acceptRequest: (request, content) => {
            dispatch(transactionActions.acceptRequest({ request, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
        denyRequest: (request, content) => {
            dispatch(transactionActions.denyRequest({ request, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
    })
)(AlertContainer);
