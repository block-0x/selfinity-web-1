import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import PictureItem from '@elements/PictureItem';
import * as authActions from '@redux/Auth/AuthReducer';
import * as sessionActions from '@redux/Session/SessionReducer';
import * as userActions from '@redux/User/UserReducer';
import * as appActions from '@redux/App/AppReducer';
import Icon from '@elements/Icon';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import LoadingIndicator from '@elements/LoadingIndicator';
import RenderImpl from '@modules/Render';
import UserShowHeader from '@modules/UserShowHeader';
import models from '@network/client_models';
import SETTING_MENU from '@entity/SettingMenu';
import SettingMenuItem from '@elements/SettingMenuItem';
import TextValueItem from '@elements/TextValueItem';
import NavigationBar from '@modules/NavigationBar';
import NavigationItem from '@elements/NavigationItem';
import NavigationContainer from '@cards/NavigationContainer';
import { userShowRoute, homeIndexRoute } from '@infrastructure/RouteInitialize';
import WalletList from '@cards/WalletList';
import UserEditList from '@cards/UserEditList';
import WaveHeader from '@elements/WaveHeader';
import InviteShowList from '@cards/InviteShowList';
import RenderIndex from '@modules/RenderIndex';
import { isScrollEndByClass } from '@extension/scroll';
import IntroductionViewer from '@modules/IntroductionViewer';
import classNames from 'classnames';
import oauth from '@network/oauth';
import CheckHeader from '@modules/CheckHeader';

class UserShowList extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UserShowList'
        );
        this.onClickSettingMenu = this.onClickSettingMenu.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }

    onClickSettingMenu(e, item) {
        if (e) e.prevendDefault();
        if (item == SETTING_MENU.Logout) {
            oauth.removeAccessToken(localStorage);
            this.props.logout();
            return;
        }
        if (item == SETTING_MENU.ChangePassword) {
            this.props.showSendDeletePasswordConfirmationMailModal();
            return;
        }
        if (item == SETTING_MENU.Delete)
            this.props.showConfirmLoginForDeleteModal();
    }

    componentWillMount() {
        if (process.env.BROWSER)
            window.addEventListener('scroll', this.onWindowScroll, false);
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('scroll', this.onWindowScroll, false);
    }

    onWindowScroll() {
        const { getMoreUserContent, section } = this.props;
        if (section != 'posts') return;
        const isEnd = isScrollEndByClass('user-show-list__user-contents');
        if (isEnd && getMoreUserContent) getMoreUserContent();
    }

    render() {
        const {
            current_user,
            repository,
            isMyAccount,
            section,
            loading,
            logout,
            user_contents,
            user_comments,
            user_requests,
            user_wanteds,
            user_send_requests,
            user_accepted_requests,
            user_unaccepted_requests,
            contents_loading,
            comments_loading,
            requests_loading,
            send_requests_loading,
            accepted_requests_loading,
            unaccepted_requests_loading,
            getMoreUserContent,
            getMoreUserComment,
            getMoreUserRequest,
            getMoreUserSendRequest,
            getMoreUserAcceptedRequest,
            getMoreUserUnAcceptedRequest,
        } = this.props;

        const { onClickSettingMenu } = this;

        let body = <div />;

        switch (section) {
            case 'transfers':
                if (!isMyAccount) {
                    body = <div />;
                    break;
                }
                body = <WalletList />;
                break;

            case 'edit':
                body = <UserEditList />;
                break;

            // case 'invite':
            //     body = <InviteShowList />;
            //     break;

            case 'settings':
                if (!isMyAccount) {
                    body = <div />;
                    break;
                }
                body = SETTING_MENU._enums.map((item, index) => (
                    <div className="user-show-list__setting-menu" key={index}>
                        <SettingMenuItem
                            title={item.value()}
                            url={
                                item.value ==
                                SETTING_MENU.Edit
                                    .value /*||
                                item.value == SETTING_MENU.Invite.value*/
                                    ? item.url(current_user.id)
                                    : item.url
                            }
                            onClick={e => onClickSettingMenu(e, item)}
                        />
                    </div>
                ));
                break;

            case 'comments':
                body = (
                    <RenderImpl
                        repository={user_comments}
                        key={`user_comments`}
                        keyIndex={`user_comments`}
                        loading={comments_loading}
                        loadMore={getMoreUserComment}
                    />
                );
                break;

            default:
            case 'posts':
                this.shouldComponentUpdate = shouldComponentUpdate(
                    this,
                    'IntroductionNewButton'
                );

                body = (
                    <div className="user-show-list__user-contents">
                        {user_contents && (
                            <RenderImpl
                                repository={user_contents}
                                key={`user_contents`}
                                keyIndex={`user_contents`}
                                loading={contents_loading}
                                loadMore={getMoreUserContent}
                            />
                        )}
                        {contents_loading && (
                            <center>
                                <LoadingIndicator
                                    type={'circle'}
                                    style={{ marginBottom: '2rem' }}
                                />
                            </center>
                        )}
                    </div>
                );
                break;

            case 'requests':
                body = (
                    <RenderImpl
                        repository={user_requests}
                        key={`user_requests`}
                        keyIndex={`user_requests`}
                        loading={requests_loading}
                        loadMore={getMoreUserRequest}
                    />
                );
                break;

            case 'sent':
                body = (
                    <RenderImpl
                        repository={user_send_requests}
                        key={`user_send_requests`}
                        keyIndex={`user_send_requests`}
                        loading={send_requests_loading}
                        loadMore={getMoreUserSendRequest}
                    />
                );
                break;

            case 'solved':
                body = (
                    <RenderImpl
                        repository={user_accepted_requests}
                        key={`user_accepted_requests`}
                        keyIndex={`user_accepted_requests`}
                        loading={accepted_requests_loading}
                        loadMore={getMoreUserAcceptedRequest}
                    />
                );
                break;

            case 'unsolved':
                body = (
                    <div>
                        {isMyAccount &&
                            user_unaccepted_requests &&
                            user_unaccepted_requests.contents.length > 0 && (
                                <div className="render-index__check-header">
                                    <CheckHeader
                                        title={tt('checks.auction.title')}
                                        text={tt('checks.auction.text')}
                                        foot={tt('checks.auction.foot')}
                                    />
                                </div>
                            )}
                        <RenderImpl
                            repository={user_unaccepted_requests}
                            key={`user_unaccepted_requests`}
                            keyIndex={`user_unaccepted_requests`}
                            loading={unaccepted_requests_loading}
                            loadMore={getMoreUserUnAcceptedRequest}
                        />
                    </div>
                );
                break;

            case 'recent-replies':
                break;

            case 'permissions':
                break;

            case 'password':
                break;
        }

        const introduction = (
            <div
                className={classNames('user-show-list__introduction', {
                    'none-item': user_wanteds.length == 0 || !user_wanteds,
                })}
            >
                <IntroductionViewer repository={repository} />
            </div>
        );

        const top_menu = (
            <NavigationContainer
                style={{
                    marginBottom: '30px',
                }}
                inlineStyle={{
                    width: '780px',
                    margin: '0 auto',
                }}
            >
                <NavigationBar>
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                            },
                        })}
                        value={tt('g.contents')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) &&
                            (section == '' ||
                                section == null ||
                                section == 'posts')
                        }
                    />
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                                section: 'unsolved',
                            },
                        })}
                        value={tt('g.auction')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) && section == 'unsolved'
                        }
                    />
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                                section: 'solved',
                            },
                        })}
                        value={tt('g.resolved')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) && section == 'solved'
                        }
                    />
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                                section: 'sent',
                            },
                        })}
                        value={tt('g.sent')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) && section == 'sent'
                        }
                    />
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                                section: 'transfers',
                            },
                        })}
                        show={isMyAccount}
                        value={tt('g.wallet')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) && section == 'transfers'
                        }
                    />
                    <NavigationItem
                        url={userShowRoute.getPath({
                            params: {
                                id: repository && repository.id,
                                section: 'settings',
                            },
                        })}
                        show={isMyAccount}
                        value={tt('g.settings')}
                        active={
                            userShowRoute.isValidPath(
                                browserHistory.getCurrentLocation().pathname
                            ) && section == 'settings'
                        }
                    />
                </NavigationBar>
            </NavigationContainer>
        );

        return (
            <div className="user-show-list">
                <WaveHeader />
                <div className="user-show-list__head">
                    <UserShowHeader repository={repository && repository} />
                </div>
                {!(user_wanteds.length == 0 && !isMyAccount) && introduction}
                <div id="nav" />
                <div className="user-show-list__nav">
                    {top_menu}
                    {body}
                </div>
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

UserShowList.defaultProps = {
    className: '',
    showSpam: false,
    isMyAccount: false,
    repository: models.User.build({ id: 1 }), //TODO:
    section: '',
};

UserShowList.propTypes = {
    classes: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.bool,
    showSpam: PropTypes.bool,
    section: PropTypes.string.isRequired,
    repository: PropTypes.shape({}),
    isMyAccount: PropTypes.bool,
    section: PropTypes.string,
    getMoreUserContent: PropTypes.func.isRequired,
    getMoreUserComment: PropTypes.func.isRequired,
    getMoreUserRequest: PropTypes.func.isRequired,
};

export default connect(
    (state, props) => {
        let repository = userActions.getShowUser(state);
        const current_user = authActions.getCurrentUser(state);
        const isMyAccount =
            !!repository && !!current_user
                ? current_user.id == repository.id
                : false;
        const user_contents = userActions.getUserContent(state);
        const user_comments = userActions.getUserComment(state);
        const user_requests = userActions.getUserRequest(state);
        const user_send_requests = userActions.getUserSendRequest(state);
        const user_accepted_requests = userActions.getUserAcceptedRequest(
            state
        );
        const user_unaccepted_requests = userActions.getUserUnAcceptedRequest(
            state
        );
        const loading = appActions.userShowPageLoading(state);
        const contents_loading = appActions.userShowContentsLoading(state);
        const comments_loading = appActions.userShowCommentsLoading(state);
        const requests_loading = appActions.userShowRequestsLoading(state);
        const send_requests_loading = appActions.userShowSendRequestsLoading(
            state
        );
        const accepted_requests_loading = appActions.userShowAcceptedRequestsLoading(
            state
        );
        const unaccepted_requests_loading = appActions.userShowUnAcceptedRequestsLoading(
            state
        );

        return {
            current_user,
            isMyAccount,
            repository,
            user_contents,
            user_comments,
            user_requests,
            user_send_requests,
            user_wanteds: userActions.getUserWanted(state)
                ? userActions.getUserWanted(state).contents
                : [],
            contents_loading,
            comments_loading,
            requests_loading,
            user_accepted_requests,
            user_unaccepted_requests,
            accepted_requests_loading,
            unaccepted_requests_loading,
            send_requests_loading,
            // loading,
        };
    },
    dispatch => ({
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showConfirmLoginForDeleteModal: () => {
            dispatch(authActions.showConfirmLoginForDeleteModal());
        },
        logout: () => {
            dispatch(authActions.logout());
        },
        getMoreUserContent: () => {
            dispatch(userActions.getMoreUserContent());
        },
        getMoreUserComment: () => {
            dispatch(userActions.getMoreUserComment());
        },
        getMoreUserRequest: () => {
            dispatch(userActions.getMoreUserRequest());
        },
        getMoreUserSendRequest: () => {
            dispatch(userActions.getMoreUserSendRequest());
        },
        getMoreUserUnAcceptedRequest: () => {
            dispatch(userActions.getMoreUserUnAcceptedRequest());
        },
        getMoreUserAcceptedRequest: () => {
            dispatch(userActions.getMoreUserAcceptedRequest());
        },
        deleteUser: () => {
            dispatch(userActions.deleteUser());
        },
        showSendDeletePasswordConfirmationMailModal: () => {
            dispatch(
                sessionActions.showSendDeletePasswordConfirmationMailModal()
            );
        },
    })
)(UserShowList);
