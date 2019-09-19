import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import models from '@network/client_models';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import AppPropTypes from '@extension/AppPropTypes';
import reward_config from '@constants/reward_config';
import PictureItem from '@elements/PictureItem';

class UserStatsBar extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        repository: models.User.build(),
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.onClick = e => {
            if (e) e.stopPropagation();
            browserHistory.push(
                userShowRoute.getPath({
                    params: { id: this.props.repository.id },
                })
            );
            this.props.onClick();
        };

        this.onClick.bind(this);

        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UserStatsBar'
        );
    }

    render() {
        const { repository } = this.props;

        const { onClick } = this;

        return (
            repository && (
                <div className="user-stats-bar" onClick={onClick}>
                    <div className="user-stats-bar__image">
                        <PictureItem
                            width={22}
                            redius={22 / 2}
                            url={repository && repository.picture_small}
                            alt={repository && repository.nickname}
                        />
                    </div>
                    <div className="user-stats-bar__value">
                        {repository.nickname}
                    </div>
                </div>
            )
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(UserStatsBar);
