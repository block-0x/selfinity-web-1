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
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import LoadingIndicator from '@elements/LoadingIndicator';
import { isScrollEndByClass } from '@extension/scroll';
import CheckHeader from '@modules/CheckHeader';
import OpinionNewViewer from '@modules/OpinionNewViewer';

class HomeList extends Component {
    state = {
        isLoadMore: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeList');
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

    onWindowScroll = () => {
        const { loadMore } = this.props;
        const isEnd = isScrollEndByClass('home-list');
        if (isEnd && loadMore) {
            loadMore();
            this.setState({ isLoadMore: true });
        }
    };

    render() {
        const {
            loadMore,
            loading,
            repositories,
            hottests,
            current_user,
            more_loading,
            ...inputProps
        } = this.props;

        const { isLoadMore } = this.state;

        return (
            <div className="home-list" id="home_list">
                {repositories && (
                    <RenderIndex
                        repositories={repositories}
                        hottests={hottests}
                        isShowHomeCheck={true}
                        isShowLightingHeader={true /*!current_user*/}
                    />
                )}
                {more_loading &&
                    loading && (
                        <div style={{ marginLeft: '48%', marginRight: '48%' }}>
                            <LoadingIndicator
                                style={{ marginBottom: '2rem' }}
                            />
                        </div>
                    )}
                {isLoadMore && (
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

HomeList.defaultProps = {
    loading: false,
};

HomeList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            more_loading: state.app.get('more_loading'),
            loading: appActions.homeIndexPageLoading(state),
            repositories: contentActions.getHomeContent(state),
            hottests: contentActions.getHomeHottestContent(state),
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        loadMore: () => {
            dispatch(contentActions.getMoreHome());
        },
    })
)(HomeList);
