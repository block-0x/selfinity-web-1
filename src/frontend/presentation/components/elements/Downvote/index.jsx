import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import Icon from '@elements/Icon';
import classNames from 'classnames';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Ripple from '@elements/Ripple';
import { COLOR } from '@entity/Color';
import ope from '@extension/operator';
import reward_config from '@constants/reward_config';

class Downvote extends React.Component {
    static propTypes = {
        score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        showScore: PropTypes.bool,
        onClick: PropTypes.func,
        content: PropTypes.shape({}),
    };

    static defaultProps = {
        score: 0,
        onClick: () => {},
        content: null,
        showScore: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Downvote');

        this.onClick = e => {
            const {
                onClick,
                downvote,
                current_user,
                content,
                deleteDownvote,
                showLogin,
                showPhoneConfirm,
            } = this.props;

            if (e) e.stopPropagation();

            if (!current_user) {
                showLogin();
                return;
            } else if (!current_user.verified) {
                showPhoneConfirm();
                return;
            }

            const { active } = this.state;
            if (downvote && current_user && content) {
                if (!active) {
                    downvote(current_user, content);
                } else if (active) {
                    deleteDownvote(current_user, content);
                }
                this.setState({
                    active: !active,
                });
            }
            if (onClick) onClick();
        };

        this.onClick.bind(this);
    }

    componentWillMount() {
        const { current_user, content } = this.props;
        if (
            !current_user ||
            !content.DownVotes ||
            !(content.DownVotes instanceof Array)
        ) {
            this.setState({
                active: false,
            });
            return;
        }

        if (!current_user) {
            return;
        }

        this.setState({
            active:
                !!content.DownVotes.filter(
                    val =>
                        val.VoterId == current_user.id ||
                        val.voter_id == current_user.id
                ).length > 0,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.current_user || !nextProps.content.UpVotes) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                nextProps.content.DownVotes.filter(
                    val =>
                        val.VoterId == nextProps.current_user.id ||
                        val.voter_id == nextProps.current_user.id
                ).length > 0,
        });
    }

    render() {
        const { score, content, showScore } = this.props;

        const { onClick } = this;

        const { active } = this.state;
        return (
            <Ripple isOut={false} isHover={false}>
                <div
                    className={classNames('downvote', {
                        active: active,
                    })}
                >
                    <div className="downvote__link" onClick={onClick}>
                        <Icon
                            src="downvote"
                            size={'3x'}
                            className="downvote__image"
                        />
                    </div>
                    {showScore && (
                        <div className="downvote__score">{`${score}`}</div>
                    )}
                </div>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        return {
            current_user: current_user,
        };
    },

    dispatch => ({
        downvote: (user, content) => {
            if (ope.isContent(content)) {
                dispatch(transactionActions.downvote({ user, content }));
            } else if (ope.isRequest(content)) {
                dispatch(transactionActions.requestDownvote({ user, content }));
            }
        },
        deleteDownvote: (user, content) => {
            if (ope.isContent(content)) {
                dispatch(transactionActions.deleteDownvote({ user, content }));
            } else if (ope.isRequest(content)) {
                dispatch(
                    transactionActions.deleteRequestDownvote({ user, content })
                );
            }
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
    })
)(Downvote);
