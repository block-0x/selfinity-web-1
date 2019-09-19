import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import PictureItem from '@elements/PictureItem';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';

class UserItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
    };

    static defaultProps = {
        repository: models.User.build(),
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserItem');
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const { repository } = this.props;
        if (e) e.preventDefault();
        browserHistory.push(`/user/${repository.id}`);
    }

    render() {
        const { repository } = this.props;

        return (
            <div className="user-item__link" onClick={this.onClick}>
                <div className="user-item">
                    <div className="user-item__picture">
                        <PictureItem
                            width={44}
                            radius={22}
                            url={repository.picture_small}
                            alt={repository.nickname}
                        />
                    </div>
                    <h3 className="user-item__title">{repository.nickname}</h3>
                    <div className="user-item__border" />
                    <div className="user-item__body">{repository.detail}</div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(UserItem);
