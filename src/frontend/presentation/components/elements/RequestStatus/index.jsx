import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';
import tt from 'counterpart';
import classNames from 'classnames';
import { REQUEST_STATUS_TYPE, getStatusKey } from '@entity';

class RequestStatus extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
    };

    static defaultProps = {
        repository: models.Request.build(),
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestStatus'
        );
    }

    render() {
        const { repository } = this.props;

        return (
            <div
                className={classNames({
                    'request-status-accepted': REQUEST_STATUS_TYPE.Accepted.is(
                        repository
                    ),
                    'request-status-unaccepted': REQUEST_STATUS_TYPE.UnAccepted.is(
                        repository
                    ),
                    'request-status-unsolved': REQUEST_STATUS_TYPE.UnSolved.is(
                        repository
                    ),
                })}
            >
                {tt(getStatusKey(repository))}
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

    dispatch => ({})
)(RequestStatus);
