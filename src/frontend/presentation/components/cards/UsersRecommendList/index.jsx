import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { Enum, defineEnum } from '@extension/Enum';
import RenderIndex from '@modules/RenderIndex';
import { HomeModel, HomeModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import * as userActions from '@redux/User/UserReducer';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import LoadingIndicator from '@elements/LoadingIndicator';
import { isScrollEndByClass } from '@extension/scroll';
import tt from 'counterpart';

class UsersRecommendList extends React.Component {
    static propTypes = {
        repositories: PropTypes.array,
        loadMore: PropTypes.func,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        loading: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UsersRecommendList'
        );
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }

    componentWillMount() {
        if (process.env.BROWSER)
            window.addEventListener('scroll', this.onWindowScroll, false);
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('scroll', this.onWindowScroll, false);
    }

    onWindowScroll = () => {
        const { loadMore } = this.props;
        const isEnd = isScrollEndByClass('users-recommend-list');
        if (isEnd && loadMore) loadMore();
    };

    render() {
        const {
            loadMore,
            loading,
            repositories,
            current_user,
            ...inputProps
        } = this.props;

        return (
            <div className="users-recommend-list" id="users_recommend_list">
                {repositories && (
                    <RenderIndex
                        repositories={repositories}
                        isInitial={
                            !current_user && !loading && !!process.env.BROWSER
                        }
                        isShowUserCheck={true}
                    />
                )}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            loading: appActions.usersRecommendPageLoading(state),
            repositories: userActions.getHomeContent(state),
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        loadMore: () => {
            dispatch(userActions.getMoreHome());
        },
    })
)(UsersRecommendList);
