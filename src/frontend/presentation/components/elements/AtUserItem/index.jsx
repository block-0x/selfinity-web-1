import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import FollowButton from '@elements/FollowButton';
import PictureItem from '@elements/PictureItem';
import { browserHistory } from 'react-router';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import tt from 'counterpart';
import reward_config from '@constants/reward_config';

class AtUserItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
        image_width: PropTypes.number,
        image_height: PropTypes.number,
    };

    static defaultProps = {
        repository: models.User.build({}),
        image_width: 44,
        image_height: 44,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'AtUserItem');
        this.onClickUser = this.onClickUser.bind(this);
    }

    onClickUser(e) {
        const { repository } = this.props;
        if (e) e.stopPropagation();
        if (!repository) return;
        // if (repository.id) browserHistory.push(userShowRoute.getPath({ params: { id: repository.id } }));
    }

    render() {
        const { repository, image_width, image_height } = this.props;

        const { onClickUser } = this;

        return (
            <div className="at-user-item">
                <div className="at-user-item__left" onClick={onClickUser}>
                    <div className="at-user-item__left-image">
                        <PictureItem
                            width={image_width}
                            redius={image_width / 2}
                            url={repository && repository.picture_small}
                            alt={repository.nickname}
                        />
                    </div>
                    <div className="at-user-item__left-titles">
                        <div className="at-user-item__left-title">
                            {repository.nickname}
                        </div>
                    </div>
                </div>
                <div className="at-user-item__right">
                    <div className="at-user-item__right-button" />
                </div>
            </div>
        );
    }
}

/*
<div className="at-user-item__left-score">
                            {repository.detail}
                        </div>
*/

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(AtUserItem);
