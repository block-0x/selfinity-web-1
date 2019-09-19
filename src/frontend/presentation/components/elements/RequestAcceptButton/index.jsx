import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SimpleButton from '@elements/SimpleButton';
import tt from 'counterpart';

class RequestAcceptButton extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
        target: AppPropTypes.Content,
    };

    static defaultProps = {};

    state = {
        active: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestAcceptButton'
        );
        this.onClick = this.onClick.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickDeny = this.onClickDeny.bind(this);
    }

    componentWillMount() {
        const { _repository } = this.props;
        this.setState({
            active:
                _repository.isAccepted == 1 || _repository.isAccepted == true,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { _repository } = nextProps;
        if (!_repository) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                _repository.isAccepted == 1 || _repository.isAccepted == true,
        });
    }

    onClick(e) {
        const { _repository, target, acceptRequest, denyRequest } = this.props;

        this.state.active
            ? denyRequest(_repository, target)
            : acceptRequest(_repository, target);

        this.setState({
            active: !this.state.active,
        });
    }

    onClickAccept(e) {
        const { _repository, target, acceptRequest, denyRequest } = this.props;

        acceptRequest(_repository, target);

        this.setState({
            active: true,
        });
    }

    onClickDeny(e) {
        const { _repository, target, acceptRequest, denyRequest } = this.props;

        denyRequest(_repository, target);

        this.setState({
            active: false,
        });
    }

    render() {
        const { _repository, target, current_user } = this.props;

        const { active } = this.state;

        if (!current_user.id) return <div />;
        if (current_user.id != _repository.VoterId) return <div />;

        return _repository.isResolved ? (
            <SimpleButton
                active={active}
                onClick={this.onClick}
                value={active ? tt('g.sent') : tt('g.repayouted')}
                color={'blue'}
            />
        ) : (
            <div className="request-accept-button">
                <div className="request-accept-button__item">
                    <SimpleButton
                        active={false}
                        onClick={this.onClickDeny}
                        value={tt('g.repayout')}
                        color={'blue'}
                    />
                </div>
                <div className="request-accept-button__item">
                    <SimpleButton
                        active={true}
                        onClick={this.onClickAccept}
                        value={tt('g.payout')}
                        color={'blue'}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            _repository: requestActions.bind(props.repository, state),
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        acceptRequest: (request, content) => {
            if (!request || !content) return;
            dispatch(transactionActions.acceptRequest({ request, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
        denyRequest: (request, content) => {
            if (!request || !content) return;
            dispatch(transactionActions.denyRequest({ request, content }));
            dispatch(requestActions.hideAcceptAlert());
        },
    })
)(RequestAcceptButton);
