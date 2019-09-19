import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RenderIndex from '@modules/RenderIndex';
import { HomeModel, HomeModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import * as searchActions from '@redux/Search/SearchReducer';
import * as appActions from '@redux/App/AppReducer';
import { browserHistory } from 'react-router';
import LoadingIndicator from '@elements/LoadingIndicator';
import TabPager from '@modules/TabPager';
import { searchRoute } from '@infrastructure/RouteInitialize';

class SearchIndexList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'SearchIndexList'
        );
    }

    componentWillMount() {
        const {
            queryParams,
            searchContent,
            searchUser,
            searchLabel,
            section,
        } = this.props;

        if (!!queryParams.q && !!searchContent && section != 'users') {
            searchContent(queryParams.q);
        }

        if (!!queryParams.q && !!searchUser && section == 'users') {
            searchUser(queryParams.q);
        }

        if (!!queryParams.q && !!searchUser && section == 'labels') {
            searchLabel(queryParams.q);
        }

        this.setState({
            pages: [
                {
                    title: tt('g.post'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'contents',
                        },
                    }),
                },
                {
                    title: tt('g.label'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'labels',
                        },
                    }),
                },
                {
                    title: tt('g.user'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'users',
                        },
                    }),
                },
            ],
        });
    }

    componentWillReceiveProps(nextProps) {
        const {
            queryParams,
            searchContent,
            searchUser,
            searchLabel,
            section,
        } = this.props;

        if (
            !!queryParams.q &&
            !!searchContent &&
            nextProps.section == 'contents'
        ) {
            searchContent(nextProps.queryParams.q);
        }

        if (
            !!queryParams.q &&
            !!searchContent &&
            nextProps.section == 'labels'
        ) {
            searchLabel(nextProps.queryParams.q);
        }

        if (!!queryParams.q && !!searchUser && nextProps.section == 'users') {
            searchUser(nextProps.queryParams.q);
        }

        this.setState({
            pages: [
                {
                    title: tt('g.post'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'contents',
                        },
                    }),
                },
                {
                    title: tt('g.label'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'labels',
                        },
                    }),
                },
                {
                    title: tt('g.user'),
                    url: searchRoute.getPath({
                        query: {
                            q: queryParams.q,
                        },
                        params: {
                            section: 'users',
                        },
                    }),
                },
            ],
        });
    }

    render() {
        const {
            loadMore,
            loading,
            repositories,
            user_repositories,
            label_repositories,
            user_loading,
            label_loading,
            section,
            loadMoreUser,
            loadMoreLabel,
            ...inputProps
        } = this.props;

        const getRendering = () => {
            switch (section) {
                default:
                case 'contents':
                    return (
                        <RenderIndex
                            repositories={repositories}
                            key={`search`}
                            keyIndex={`search`}
                            loading={loading}
                            loadMore={loadMore}
                            isPager={true}
                            pages={this.state.pages}
                            align={false}
                        />
                    );
                case 'users':
                    return (
                        <RenderIndex
                            repositories={user_repositories}
                            key={`search`}
                            keyIndex={`search`}
                            loading={user_loading}
                            loadMore={loadMoreUser}
                            isPager={true}
                            pages={this.state.pages}
                            align={false}
                        />
                    );
                case 'labels':
                    return (
                        <RenderIndex
                            repositories={label_repositories}
                            key={`search`}
                            keyIndex={`search`}
                            loading={label_loading}
                            loadMore={loadMoreLabel}
                            isPager={true}
                            pages={this.state.pages}
                            align={false}
                        />
                    );
            }
        };

        return (
            <div className="search-index-list">
                {repositories && getRendering()}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

SearchIndexList.defaultProps = {
    loading: false,
    section: '',
};

SearchIndexList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            loading: appActions.searchPageLoading(state),
            user_loading: appActions.searchUserPageLoading(state),
            label_loading: appActions.searchLabelPageLoading(state),
            queryParams: browserHistory.getCurrentLocation().query,
            repositories: searchActions.getSearchContent(state),
            user_repositories: searchActions.getSearchUser(state),
            label_repositories: searchActions.getSearchLabel(state),
        };
    },

    dispatch => ({
        searchContent: keyword => {
            dispatch(searchActions.searchContent({ keyword }));
        },
        searchUser: keyword => {
            dispatch(searchActions.searchUser({ keyword }));
        },
        searchLabel: keyword => {
            dispatch(searchActions.searchLabel({ keyword }));
        },
        loadMore: () => {
            dispatch(searchActions.getMoreSearchContent());
        },
        loadMoreUser: () => {
            dispatch(searchActions.getMoreSearchUser());
        },
        loadMoreLabel: () => {
            dispatch(searchActions.getMoreSearchLabel());
        },
    })
)(SearchIndexList);
