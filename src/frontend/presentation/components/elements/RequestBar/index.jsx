import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PictureItem from '@elements/PictureItem';
import Icon from '@elements/Icon';
import models from '@network/client_models';
import Upvote from '@elements/Upvote';
import Downvote from '@elements/Downvote';
import Point from '@elements/Point';
import reward_config from '@constants/reward_config';

class RequestBar extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
    };

    static defaultProps = {
        repository: models.Request.build(),
    };

    render() {
        const { repository } = this.props;

        return (
            <div className="request-bar">
                <div className="request-bar__item">
                    <Point
                        score={''.decimalize(
                            `${reward_config.getScore(repository)}`
                        )}
                    />
                </div>
                <div className="request-bar__item">
                    <Upvote content={repository} />
                </div>
                <div className="request-bar__item">
                    <Downvote content={repository} />
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
)(RequestBar);
