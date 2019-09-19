import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Point from '@elements/Point';
import MoreMenu from '@elements/MoreMenu';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import models from '@network/client_models';
import reward_config from '@constants/reward_config';
import ReplyCounter from '@elements/ReplyCounter';
import CheeringCounter from '@elements/CheeringCounter';
import GoodOpinionCounter from '@elements/GoodOpinionCounter';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';
import tt from 'counterpart';

class IndexBar extends React.Component {
    static propTypes = {
        repository: PropTypes.shape({}),
        repository_user: AppPropTypes.User,
        onClickTime: PropTypes.func,
        onClickMenu: PropTypes.func,
        onClickPoint: PropTypes.func,
    };

    static defaultProps = {
        repository: models.Content.build(),
        repository_user: models.User.build(),
        onClickTime: () => {},
        onClickMenu: () => {},
        onClickPoint: () => {},
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'IndexBar');
        this.onClickTime = e => {
            if (e) e.preventDefault();
            this.props.onClickTime();
        };

        this.onClickMenu = e => {
            if (e) e.preventDefault();
            this.props.onClickMenu();
        };

        this.onClickPoint = e => {
            if (e) e.preventDefault();
            this.props.onClickPoint();
        };
        this.onClickTime.bind(this);
        this.onClickMenu.bind(this);
        this.onClickPoint.bind(this);
    }

    render() {
        const { repository, repository_user } = this.props;
        const { onClickTime, onClickPoint, onClickMenu } = this;
        return (
            <div className="index-bar">
                <div className="index-bar__item">
                    <ReplyCounter
                        size={'S'}
                        score={''.decimalize(`${repository.count - 1}`)}
                        repository={repository}
                        onClick={onClickPoint}
                    />
                </div>
                <div className="index-bar__item">
                    <CheeringCounter
                        size={'S'}
                        score={''.decimalize(
                            `${reward_config.getScore(repository)}`
                        )}
                        onClick={onClickPoint}
                        repository={repository}
                    />
                </div>
                <div className="index-bar__item">
                    <GoodOpinionCounter
                        size={'S'}
                        score={''.decimalize(
                            `${repository.good_opinion_count}`
                        )}
                        onClick={onClickPoint}
                        repository={repository}
                    />
                </div>
                <div className="index-bar__menu">
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
<div className="index-bar__item">
                    <div className="index-bar__item__time">
                        <TimeAgoWrapper date={repository.created_at} />
                    </div>
                </div>

<div className="index-bar__item" style={{ margin: '0' }}>
                    <NavigatorItem
                        content={
                            <div className="index-bar__menu">
                                <NavigatorDescMenu>
                                    <NavigatorDescItem
                                        title={tt('g.good_opinion')}
                                        value={tt('g.good_opinion_desc')}
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
*/

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(IndexBar);
