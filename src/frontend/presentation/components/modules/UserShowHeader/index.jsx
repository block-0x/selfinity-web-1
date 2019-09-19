import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import AppPropTypes from '@extension/AppPropTypes';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import FollowButton from '@elements/FollowButton';
import FollowIconButton from '@elements/FollowIconButton';
import GradationButton from '@elements/GradationButton';
import RequestSimpleButton from '@elements/RequestSimpleButton';
import PictureItem from '@elements/PictureItem';
import LoadingIndicator from '@elements/LoadingIndicator';
import { getWindowSize } from '@network/window';
import tt from 'counterpart';
import Responsible from '@modules/Responsible';
import Point from '@elements/Point';
import TokenPoint from '@elements/TokenPoint';
import reward_config from '@constants/reward_config';
import { userShowRoute } from '@infrastructure/RouteInitialize';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';

class UserShowHeader extends React.Component {
    static propTypes = {
        current_user: PropTypes.shape({}),
        repository: AppPropTypes.User,
        isFollow: PropTypes.bool,
        isMyAccount: PropTypes.bool,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        current_user: models.User.build(),
        repository: models.User.build({
            picture_small: '/icons/noimage.svg',
        }),
        isFollow: false,
        isMyAccount: false,
        loading: false,
    };

    state = {
        mounted: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UserShowHeader'
        );
    }

    componentWillMount() {
        this.setState({
            mounted: false,
        });
    }

    componentDidMount() {
        this.setState({
            mounted: true,
        });
    }

    render() {
        const {
            current_user,
            repository,
            isFollow,
            isMyAccount,
            loading,
        } = this.props;
        if (loading || !this.state.mounted)
            return (
                <LoadingIndicator
                    type={'circle'}
                    style={{ marginLeft: '49%', marginRight: '49%' }}
                />
            );
        return (
            <div className="user-show-header">
                <div className="user-show-header__items">
                    <div className="user-show-header__items-left">
                        <div className="user-show-header__items-image">
                            <PictureItem
                                width={80}
                                redius={40}
                                url={repository && repository.picture_small}
                                alt={repository && repository.nickname}
                            />
                        </div>
                        <div className="user-show-header__items-namegroup">
                            <h1 className="user-show-header__items-name">
                                {repository && repository.nickname}
                            </h1>
                            <h2 className="user-show-header__items-uid">
                                {repository && repository.username}
                            </h2>
                        </div>
                    </div>
                    <div className="user-show-header__items-right">
                        {isMyAccount ? (
                            <div className="user-show-header__items-credit">
                                <div className="user-show-header__items-credit__help">
                                    <NavigatorItem
                                        content={
                                            <NavigatorDescMenu>
                                                <NavigatorDescItem
                                                    title={tt('g.merit_point')}
                                                    value={tt('g.token_desc')}
                                                    src={'selftoken-mini-logo'}
                                                />
                                            </NavigatorDescMenu>
                                        }
                                    />
                                </div>
                                <Responsible
                                    className="user-show-header__items-credit__point"
                                    defaultContent={
                                        <TokenPoint
                                            score={repository.token_balance}
                                            size={'L'}
                                        />
                                    }
                                    breakingContent={
                                        <TokenPoint
                                            score={''.decimalize(
                                                `${repository.token_balance}`
                                            )}
                                            size={'L'}
                                        />
                                    }
                                    breakMd={true}
                                />
                            </div>
                        ) : (
                            <div className="user-show-header__items-follow">
                                <FollowButton
                                    repository={repository && repository}
                                />
                            </div>
                        )}
                        {!isMyAccount ? (
                            <div className="user-show-header__items-requests">
                                <Responsible
                                    className="user-show-header__items-request__help1"
                                    defaultContent={
                                        <NavigatorItem
                                            content={
                                                <NavigatorDescMenu>
                                                    <NavigatorDescItem
                                                        title={tt(
                                                            'g.auction_title'
                                                        )}
                                                        value={tt(
                                                            'g.auction_desc'
                                                        )}
                                                        src={'auction'}
                                                    />
                                                </NavigatorDescMenu>
                                            }
                                        />
                                    }
                                    breakFm={true}
                                />
                                <div className="user-show-header__items-request">
                                    <RequestSimpleButton
                                        repository={repository && repository}
                                    />
                                </div>
                                <Responsible
                                    className="user-show-header__items-request__help2"
                                    breakingContent={
                                        <NavigatorItem
                                            content={
                                                <NavigatorDescMenu>
                                                    <NavigatorDescItem
                                                        title={tt(
                                                            'g.auction_title'
                                                        )}
                                                        value={tt(
                                                            'g.auction_desc'
                                                        )}
                                                        src={'auction'}
                                                    />
                                                </NavigatorDescMenu>
                                            }
                                        />
                                    }
                                    breakFm={true}
                                />
                            </div>
                        ) : (
                            <div className="user-show-header__items-edit">
                                <GradationButton
                                    src={'setting'}
                                    value={tt('g.user_edit')}
                                    url={
                                        userShowRoute.getPath({
                                            params: {
                                                id: current_user.id,
                                                section: 'edit',
                                            },
                                        }) + '#nav'
                                    }
                                    color={'blue'}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="user-show-header__detail">
                    {repository.detail}
                </h2>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const isFollow = !!props.repository
            ? userActions.isFollow(state, props.repository)
            : false;
        const isMyAccount = userActions.isMyAccount(state, props.repository);
        const loading = appActions.userShowPageLoading(state);
        return {
            current_user,
            isFollow,
            isMyAccount,
            loading,
            repository: userActions.bind(props.repository, state),
        };
    },

    dispatch => ({})
)(UserShowHeader);
