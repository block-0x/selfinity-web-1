import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import PictureItem from '@elements/PictureItem';
import Point from '@elements/Point';
import SectionHeader from '@elements/SectionHeader';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import reward_config from '@constants/reward_config';
import Ripple from '@elements/Ripple';
import RequestButton from '@elements/RequestButton';
import RequestSimpleButton from '@elements/RequestSimpleButton';
import Responsible from '@modules/Responsible';

class UserHeader extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
        style: PropTypes.object,
    };

    static defaultProps = {
        repository: models.User.build(),
        style: {},
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserHeader');
    }

    render() {
        const { repository, style } = this.props;

        return (
            <SectionHeader style={style}>
                <Ripple>
                    <Link
                        className="user-header__link"
                        to={userShowRoute.getPath({
                            params: { id: repository.id },
                        })}
                    >
                        <div className="user-header">
                            <div className="user-header__body">
                                <div className="user-header__image">
                                    <PictureItem
                                        url={repository.picture_small}
                                        width={36}
                                        radius={18}
                                        alt={repository.nickname}
                                    />
                                </div>
                                <div className="user-header__nickname">
                                    {repository.nickname}
                                </div>
                                <div className="user-header__point">
                                    <Point
                                        score={''.decimalize(
                                            `${reward_config.getScore(
                                                repository
                                            )}`
                                        )}
                                    />
                                </div>
                                <Responsible
                                    className="user-header__request"
                                    defaultContent={
                                        <RequestSimpleButton
                                            repository={repository}
                                        />
                                    }
                                    breakingContent={
                                        <RequestButton
                                            repository={repository}
                                        />
                                    }
                                    breakFm={true}
                                />
                            </div>
                        </div>
                    </Link>
                </Ripple>
            </SectionHeader>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(UserHeader);
