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

class Upvote extends React.Component {
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

        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Upvote');

        this.onClick = e => {
            const {
                onClick,
                upvote,
                current_user,
                content,
                deleteUpvote,
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
            if (upvote && current_user && content) {
                if (!active) {
                    upvote(current_user, content);
                } else if (active) {
                    deleteUpvote(current_user, content);
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
            !content.UpVotes ||
            !(content.UpVotes instanceof Array)
        ) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                content.UpVotes.filter(
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
                nextProps.content.UpVotes.filter(
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
                    className={classNames('upvote', {
                        active: active,
                    })}
                    onClick={onClick}
                >
                    <div className="upvote__link">
                        <Icon
                            src="upvote"
                            size={'3x'}
                            className="upvote__image"
                        />
                    </div>
                    {showScore && (
                        <div className="upvote__score">{`${score}`}</div>
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
        upvote: (user, content) => {
            if (ope.isContent(content)) {
                dispatch(transactionActions.upvote({ user, content }));
            } else if (ope.isRequest(content)) {
                dispatch(transactionActions.requestUpvote({ user, content }));
            }
        },
        deleteUpvote: (user, content) => {
            if (ope.isContent(content)) {
                dispatch(transactionActions.deleteUpvote({ user, content }));
            } else if (ope.isRequest(content)) {
                dispatch(
                    transactionActions.deleteRequestUpvote({ user, content })
                );
            }
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
    })
)(Upvote);
