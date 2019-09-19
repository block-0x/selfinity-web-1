import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RenderIndex from '@modules/RenderIndex';
import { FeedModel, FeedModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import * as appActions from '@redux/App/AppReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import LoadingIndicator from '@elements/LoadingIndicator';
import { isScrollEndByClass } from '@extension/scroll';
import InitialHeader from '@modules/InitialHeader';
import * as authActions from '@redux/Auth/AuthReducer';
import WaveHeader from '@elements/WaveHeader';
import { feedsRoute } from '@infrastructure/RouteInitialize';

class FeedIndexList extends Component {
    state = {
        isLoadMore: false,
        pages: [
            {
                title: tt('g.disscussion'),
                url: feedsRoute.getPath({
                    params: {
                        section: 'disscussions',
                    },
                }),
            },
            {
                title: tt('g.newest'),
                url: feedsRoute.getPath({
                    params: {
                        section: 'newests',
                    },
                }),
            },
        ],
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'FeedIndexList'
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

    componentWillReceiveProps(nextProps) {
        if (!nextProps.repositories || !this.props.repositories) return;
        if (
            !nextProps.repositories.contents ||
            !this.props.repositories.contents
        )
            return;
        if (
            nextProps.repositories.contents.length >
            this.props.repositories.contents.length
        ) {
            this.setState({ isLoadMore: false });
        }
    }

    onWindowScroll() {
        const { loadMore, section } = this.props;
        const isEnd = isScrollEndByClass('feed-index-list');
        if (isEnd && loadMore) {
            loadMore(section);
            this.setState({ isLoadMore: true });
        }
    }

    render() {
        const {
            loadMore,
            loading,
            more_loading,
            repositories,
            current_user,
            section,
            ...inputProps
        } = this.props;

        const { isLoadMore, pages } = this.state;

        return (
            <div className="feed-index-list" id="feed_index_list">
                {repositories && (
                    <RenderIndex
                        repositories={repositories}
                        isPager={true}
                        pages={pages}
                        isShowNewCheck={true}
                    />
                )}
                {loading && (
                    <div style={{ marginLeft: '48%', marginRight: '48%' }}>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </div>
                )}
                {more_loading &&
                    isLoadMore && (
                        <div style={{ marginLeft: '48%', marginRight: '48%' }}>
                            <LoadingIndicator
                                type="circle"
                                style={{ marginBottom: '2rem' }}
                            />
                        </div>
                    )}
            </div>
        );
    }
}

FeedIndexList.defaultProps = {
    loading: false,
};

FeedIndexList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            loading:
                props.section == 'newests'
                    ? appActions.feedIndexNewestPageLoading(state)
                    : appActions.feedIndexPageLoading(state),
            more_loading: state.app.get('more_loading'),
            repositories:
                props.section == 'newests'
                    ? contentActions.getNewestContent(state)
                    : contentActions.getFeedContent(state),
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        loadMore: section => {
            if (section == 'newests') {
                dispatch(contentActions.getMoreNewest());
            } else {
                dispatch(contentActions.getMoreFeed());
            }
        },
    })
)(FeedIndexList);
