import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import AppPropTypes from '@extension/AppPropTypes';
import Icon from '@elements/Icon';
import LoadingIndicator from '@elements/LoadingIndicator';
import classNames from 'classnames';
import data_config from '@constants/data_config';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import { ClientError } from '@extension/Error';
import tt from 'counterpart';

class CheeringCounter extends React.Component {
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

    state = {
        active: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'CheeringCounter'
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
                        Number.prototype.castBool(val.isCheering) &&
                        (val.VoterId == current_user.id ||
                            val.voter_id == current_user.id)
                ).length >
                0 /* ||
                repository.UpVotes.filter(val =>
                    Number.prototype.castBool(val.isCheering)
                ).length >= data_config.vote_max_limit*/,
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
                        Number.prototype.castBool(val.isCheering) &&
                        (val.VoterId == nextProps.current_user.id ||
                            val.voter_id == nextProps.current_user.id)
                ).length >
                0 /* ||
                nextProps.repository.UpVotes.filter(val =>
                    Number.prototype.castBool(val.isCheering)
                ).length >= data_config.vote_max_limit*/,
        });
    }

    onClick(e) {
        if (e) e.stopPropagation();
        const {
            repository,
            showNew,
            current_user,
            showLogin,
            showPhoneConfirm,
            addError,
            addSuccess,
            showNewComment,
        } = this.props;

        const { active } = this.state;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        // if (
        //     repository.UpVotes.filter(val =>
        //         Number.prototype.castBool(val.isCheering)
        //     ).length >= data_config.vote_max_limit
        // ) {
        //     addError(
        //         new ClientError({
        //             error: new Error('is_limit_vote'),
        //             tt_key: 'errors.is_limit_vote',
        //             tt_params: { limit: data_config.vote_max_limit },
        //         })
        //     );
        //     return;
        // }

        if (
            repository.UpVotes.filter(
                val =>
                    Number.prototype.castBool(val.isCheering) &&
                    (val.VoterId == current_user.id ||
                        val.voter_id == current_user.id)
            ).length > 0
        ) {
            addError(
                new ClientError({
                    error: new Error('errors.is_already_vote'),
                    tt_key: 'errors.is_already_vote',
                })
            );
            return;
        }

        if (current_user.id == repository.UserId) {
            addError(
                new ClientError({
                    error: new Error('errors.cannot_vote_own'),
                    tt_key: 'errors.cannot_vote_own',
                })
            );
            return;
        }

        // if (
        //     repository.ParentContent &&
        //     repository.ParentContent.UserId == current_user.id
        // ) {
        //     addError(
        //         new ClientError({
        //             error: new Error('should_better_vote'),
        //             tt_key: 'errors.should_better_vote',
        //         })
        //     );
        //     // addSuccess(tt('flash.new_message_for_super'));
        //     showNewComment(repository, current_user);
        //     if (this.props.onClick) this.props.onClick();
        //     return;
        // }

        addSuccess(tt('flash.new_message_upvote'));

        showNew(repository, current_user);
        if (this.props.onClick) this.props.onClick();
    }

    render() {
        const { score, size } = this.props;

        const { onClick } = this;

        const { active } = this.state;

        return (
            <div
                className={classNames('cheering-counter', size, {
                    active,
                })}
            >
                <div className="cheering-counter__link" onClick={onClick}>
                    <Icon
                        src="red-good"
                        size={size != 'S' ? '3x' : '2x'}
                        className={classNames('cheering-counter__image', {
                            active,
                        })}
                    />
                </div>
                {score == 'undefined' ? (
                    <div className="cheering-counter__score">
                        <LoadingIndicator
                            type={'circle'}
                            style={{ marginTop: '-12px' }}
                        />
                    </div>
                ) : (
                    <div className="cheering-counter__score">{`${score ||
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
            dispatch(contentActions.showNewCheering({ content, user }));
        },
        showNewComment: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        addError: error => {
            dispatch(appActions.addError({ error }));
        },
        addSuccess: success => {
            dispatch(appActions.addSuccess({ success }));
        },
    })
)(CheeringCounter);
