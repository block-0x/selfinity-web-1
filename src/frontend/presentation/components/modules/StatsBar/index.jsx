import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import models from '@network/client_models';
import Point from '@elements/Point';
import ReplyCounter from '@elements/ReplyCounter';
import CheeringCounter from '@elements/CheeringCounter';
import GoodOpinionCounter from '@elements/GoodOpinionCounter';
import Upvote from '@elements/Upvote';
import Downvote from '@elements/Downvote';
import MoreMenu from '@elements/MoreMenu';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import AppPropTypes from '@extension/AppPropTypes';
import reward_config from '@constants/reward_config';
import Responsible from '@modules/Responsible';
import TokenPoint from '@elements/TokenPoint';
import autobind from 'class-autobind';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';
import tt from 'counterpart';

class StatsBar extends React.Component {
    static propTypes = {
        repository: PropTypes.oneOfType([
            AppPropTypes.Content,
            AppPropTypes.Request,
            AppPropTypes.Label,
        ]),
        repository_user: AppPropTypes.User,
        onUpvote: PropTypes.func,
        onDownvote: PropTypes.func,
        onClickMenu: PropTypes.func,
        onClickPoint: PropTypes.func,
        onClickTime: PropTypes.func,
        showUpvote: PropTypes.bool,
        showDownvote: PropTypes.bool,
        showPoint: PropTypes.bool,
        showTokenPoint: PropTypes.bool,
        showReplyCounter: PropTypes.bool,
        showCheeringCounter: PropTypes.bool,
        showGoodOpinionCounter: PropTypes.bool,
        showHelp: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Content.build(),
        repository_user: null,
        onUpvote: () => {},
        onDownvote: () => {},
        onClickTime: () => {},
        onClickMenu: () => {},
        onClickPoint: () => {},
        showUpvote: true,
        showDownvote: true,
        showPoint: true,
        showTokenPoint: false,
        showReplyCounter: false,
        showCheeringCounter: false,
        showGoodOpinionCounter: false,
        showHelp: false,
    };

    constructor(props) {
        super(props);
        this.onUpvote = e => {
            if (e) e.preventDefault();
            this.props.onUpvote();
        };

        this.onDownvote = e => {
            if (e) e.preventDefault();
            this.props.onDownvote();
        };

        this.onClickMenu = e => {
            if (e) e.preventDefault();
            this.props.onClickMenu();
        };

        this.onClickPoint = e => {
            if (e) e.preventDefault();
            this.props.onClickPoint();
        };

        this.onClickTokenPoint = e => {
            if (e) e.preventDefault();
            this.props.onClickTokenPoint();
        };

        this.onClickTime = e => {
            if (e) e.preventDefault();
            this.props.onClickTime();
        };
        autobind(this);

        this.shouldComponentUpdate = shouldComponentUpdate(this, 'StatsBar');
    }

    render() {
        const {
            repository,
            repository_user,
            showUpvote,
            showDownvote,
            showPoint,
            showHelp,
            showTokenPoint,
            showReplyCounter,
            showCheeringCounter,
            showGoodOpinionCounter,
        } = this.props;

        const {
            onUpvote,
            onDownvote,
            onClickPoint,
            onClickTokenPoint,
            onClickMenu,
            onClickTime,
        } = this;

        return (
            <div className="stats-bar">
                <div className="stats-bar__item">
                    {showPoint && (
                        <Point
                            score={''.decimalize(
                                `${reward_config.getScore(repository)}`
                            )}
                            onClick={onClickPoint}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showTokenPoint && (
                        <TokenPoint
                            score={''.decimalize(`${repository.bid_amount}`)}
                            onClick={onClickTokenPoint}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showReplyCounter && (
                        <ReplyCounter
                            score={''.decimalize(`${repository.count - 1}`)}
                            onClick={onClickPoint}
                            repository={repository}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showCheeringCounter && (
                        <CheeringCounter
                            score={''.decimalize(
                                `${reward_config.getScore(repository)}`
                            )}
                            onClick={onClickPoint}
                            repository={repository}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showGoodOpinionCounter && (
                        <GoodOpinionCounter
                            score={''.decimalize(
                                `${repository.good_opinion_count}`
                            )}
                            onClick={onClickPoint}
                            repository={repository}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showUpvote && (
                        <Upvote
                            score={''.decimalize(
                                `${reward_config.getScore(repository)}`
                            )}
                            onClick={onUpvote}
                            content={repository}
                        />
                    )}
                </div>
                <div className="stats-bar__item">
                    {showDownvote && (
                        <Downvote
                            score={''.decimalize(
                                `${reward_config.getScore(repository)}`
                            )}
                            onDownvote={onDownvote}
                            content={repository}
                        />
                    )}
                </div>
                {showHelp &&
                    showCheeringCounter &&
                    showGoodOpinionCounter && (
                        <div
                            className="stats-bar__item"
                            style={{ padding: '4px 0', margin: '0' }}
                        >
                            <NavigatorItem
                                content={
                                    <div className="stats-bar__menu">
                                        <NavigatorDescMenu>
                                            <NavigatorDescItem
                                                title={tt('g.good_opinion')}
                                                value={tt(
                                                    'g.good_opinion_desc'
                                                )}
                                                src={'color-upvote-img'}
                                            />
                                            <NavigatorDescItem
                                                title={tt('g.cheering')}
                                                value={tt('g.cheering_desc')}
                                                src={'red-good-img'}
                                            />
                                        </NavigatorDescMenu>
                                    </div>
                                }
                            />
                        </div>
                    )}
                <div className="stats-bar__menu">
                    <MoreMenu
                        onClick={onClickMenu}
                        repository={repository}
                        repository_user={repository_user}
                    />
                </div>
            </div>
        );
    }
}

/*
<div className="stats-bar__item">
                    <div className="stats-bar__item__time">
                        <TimeAgoWrapper date={repository.created_at} />
                    </div>
                </div>
*/

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(StatsBar);
