import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as appActions from '@redux/App/AppReducer';
import AppPropTypes from '@extension/AppPropTypes';
import Icon from '@elements/Icon';
import LoadingIndicator from '@elements/LoadingIndicator';
import classNames from 'classnames';
import data_config from '@constants/data_config';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import { ClientError } from '@extension/Error';

class GoodOpinionCounter extends React.Component {
    static propTypes = {
        score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClick: PropTypes.func,
        size: PropTypes.oneOf(['S', 'M', 'L']),
    };

    static defaultProps = {
        score: 0,
        onClick: () => {},
        size: 'M',
    };

    state = {
        active: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'GoodOpinionCounter'
        );
        autobind(this);
    }

    componentWillMount() {
        const { current_user, repository } = this.props;
        if (
            !current_user ||
            !repository.UpVotes ||
            !(repository.UpVotes instanceof Array)
        ) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                repository.UpVotes.filter(
                    val =>
                        (Number.prototype.castBool(val.isBetterOpinion) ||
                            Number.prototype.castBool(val.isBetterAnswer)) &&
                        (val.VoterId == current_user.id ||
                            val.voter_id == current_user.id)
                ).length > 0 ||
                repository.UpVotes.filter(
                    val =>
                        Number.prototype.castBool(val.isBetterOpinion) ||
                        Number.prototype.castBool(val.isBetterAnswer)
                ).length >= data_config.good_opinion_max_limit,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.current_user || !nextProps.repository.UpVotes) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                nextProps.repository.UpVotes.filter(
                    val =>
                        (Number.prototype.castBool(val.isBetterOpinion) ||
                            Number.prototype.castBool(val.isBetterAnswer)) &&
                        (val.VoterId == nextProps.current_user.id ||
                            val.voter_id == nextProps.current_user.id)
                ).length > 0 ||
                nextProps.repository.UpVotes.filter(
                    val =>
                        Number.prototype.castBool(val.isBetterOpinion) ||
                        Number.prototype.castBool(val.isBetterAnswer)
                ).length >= data_config.good_opinion_max_limit,
        });
    }

    onClick(e) {
        if (e) e.stopPropagation();

        const {
            repository,
            acceptOpinion,
            current_user,
            acceptRequest,
            unacceptOpinion,
            denyRequest,
            showLogin,
            showPhoneConfirm,
        } = this.props;

        const { active } = this.state;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (repository.Requests && repository.Requests.length > 0) {
            active
                ? denyRequest(repository.Requests[0], repository)
                : acceptRequest(repository.Requests[0], repository);
        } else {
            active ? unacceptOpinion(repository) : acceptOpinion(repository);
        }

        if (this.props.onClick) this.props.onClick();
    }

    render() {
        const { score, size } = this.props;

        const { onClick } = this;

        const { active } = this.state;

        return (
            <div
                className={classNames('good-opinion-counter', size, {
                    active,
                })}
            >
                <div className="good-opinion-counter__link" onClick={onClick}>
                    <Icon
                        src="color-upvote"
                        size={size != 'S' ? '3x' : '2x'}
                        className={classNames('good-opinion-counter__image', {
                            active,
                        })}
                    />
                </div>
                {score == 'undefined' ? (
                    <div className="good-opinion-counter__score">
                        <LoadingIndicator
                            type={'circle'}
                            style={{ marginTop: '-12px' }}
                        />
                    </div>
                ) : (
                    <div className="good-opinion-counter__score">{`${score ||
                        0}/${data_config.good_opinion_max_limit}`}</div>
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
            dispatch(contentActions.showNewCheering({ content, user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        acceptOpinion: content => {
            if (!content) return;
            dispatch(transactionActions.acceptOpinion({ content }));
        },
        unacceptOpinion: content => {
            if (!content) return;
            dispatch(transactionActions.unacceptOpinion({ content }));
        },
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
        addError: error => {
            dispatch(appActions.addError({ error }));
        },
    })
)(GoodOpinionCounter);
