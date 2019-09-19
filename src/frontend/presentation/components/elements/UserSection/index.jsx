import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as userActions from '@redux/User/UserReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import FollowButton from '@elements/FollowButton';
import PictureItem from '@elements/PictureItem';
import { browserHistory } from 'react-router';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import tt from 'counterpart';
import RequestButton from '@elements/RequestButton';
import reward_config from '@constants/reward_config';
import RequestSimpleButton from '@elements/RequestSimpleButton';
import Responsible from '@modules/Responsible';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';

class UserSection extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
        image_width: PropTypes.number,
        image_height: PropTypes.number,
        // isPrivate: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.User.build({}),
        image_width: 44,
        image_height: 44,
        isPrivate: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserSection');
        this.onClickUser = this.onClickUser.bind(this);
    }

    onClickUser(e) {
        const { repository } = this.props;
        if (e) e.stopPropagation();
        if (!repository) return;
        if (repository.id)
            browserHistory.push(
                userShowRoute.getPath({
                    params: {
                        id: repository.id,
                    },
                })
            );
    }

    render() {
        const {
            repository,
            image_width,
            image_height,
            isMyAccount,
        } = this.props;

        const { onClickUser } = this;

        const isPrivate = Number.prototype.castBool(this.props.isPrivate);

        return (
            <div className="user-section">
                <div className="user-section__left" onClick={onClickUser}>
                    <div className="user-section__left-image">
                        <PictureItem
                            width={image_width}
                            redius={image_width / 2}
                            url={repository && repository.picture_small}
                            alt={repository && repository.nickname}
                        />
                    </div>
                    <div className="user-section__left-titles">
                        <div className="user-section__left-title">
                            {repository.nickname}
                        </div>
                    </div>
                </div>
                <div className="user-section__right">
                    {!isPrivate &&
                        !isMyAccount && (
                            <Responsible
                                className="user-section__right-button"
                                defaultContent={
                                    <RequestSimpleButton
                                        repository={repository}
                                    />
                                }
                                breakingContent={
                                    <RequestButton repository={repository} />
                                }
                                breakFm={true}
                            />
                        )}
                    {!isPrivate &&
                        !isMyAccount && (
                            <Responsible
                                className="user-section__right__help"
                                breakFm={true}
                                defaultContent={
                                    <NavigatorItem
                                        content={
                                            <NavigatorDescMenu>
                                                <NavigatorDescItem
                                                    title={tt(
                                                        'g.auction_title'
                                                    )}
                                                    value={tt('g.auction_desc')}
                                                    src={'auction'}
                                                />
                                            </NavigatorDescMenu>
                                        }
                                    />
                                }
                                breakingContent={
                                    <NavigatorItem
                                        xOffset={-60}
                                        content={
                                            <NavigatorDescMenu>
                                                <NavigatorDescItem
                                                    title={tt(
                                                        'g.auction_title'
                                                    )}
                                                    value={tt('g.auction_desc')}
                                                    src={'auction'}
                                                />
                                            </NavigatorDescMenu>
                                        }
                                    />
                                }
                            />
                        )}
                </div>
            </div>
        );
    }
}
/*
<div className="user-section__left-score">
                            <div className="user-section__left-score__title">
                                {tt('g.detail')}
                            </div>
                            <div className="user-section__left-score__value">
                                {repository.detail.slice(0, 10)}
                            </div>
                        </div>
*/

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const isMyAccount = userActions.isMyAccount(state, props.repository);
        return {
            current_user,
            isMyAccount,
        };
    },

    dispatch => ({})
)(UserSection);
