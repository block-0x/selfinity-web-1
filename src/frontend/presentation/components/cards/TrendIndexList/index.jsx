import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import CheckHeader from '@modules/CheckHeader';
import NavigationBar from '@modules/NavigationBar';
import NavigationItem from '@elements/NavigationItem';
import NavigationContainer from '@cards/NavigationContainer';
import { isScrollEndByClass } from '@extension/scroll';
import classNames from 'classnames';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as appActions from '@redux/App/AppReducer';
import * as labelActions from '@redux/Label/LabelReducer';
import LoadingIndicator from '@elements/LoadingIndicator';
import RenderImpl from '@modules/Render';
import models from '@network/client_models';
import WaveHeader from '@elements/WaveHeader';
import {
    userShowRoute,
    homeIndexRoute,
    trendRoute,
} from '@infrastructure/RouteInitialize';
import tt from 'counterpart';
import RenderIndex from '@modules/RenderIndex';
import LabelBar from '@modules/LabelBar';
import InitialHeader from '@modules/InitialHeader';

class TrendIndexList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        isLoadMore: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TrendIndexList'
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
        const { section, loadMore } = this.props;
        const isEnd = isScrollEndByClass('trend-iindex-list__body');
        if (isEnd && loadMore) {
            loadMore();
            this.setState({ isLoadMore: true });
        }
    }

    render() {
        const {
            current_user,
            id,
            loading,
            sections,
            repositories,
            relates,
            more_loading,
            loadMore,
        } = this.props;

        const { isLoadMore } = this.state;

        let body = <div />;

        // isInitial={!current_user && !loading}

        switch (id) {
            default:
                body = (
                    <div className="trend-iindex-list__body">
                        {repositories && (
                            <RenderIndex
                                headerHidden={true}
                                repositories={repositories}
                            />
                        )}
                    </div>
                );
                break;
        }

        const renderTopItems = items => (
            <NavigationItem value={tt('g.contents')} active={true} />
        );

        const top_menu = (
            <NavigationContainer style={{ marginBottom: '30px' }}>
                <NavigationBar>
                    {sections.map((label, key) => (
                        <NavigationItem
                            key={key}
                            value={label.title}
                            active={id - 1 == key}
                            url={trendRoute.getPath({
                                params: {
                                    id: key + 1,
                                },
                            })}
                        />
                    ))}
                </NavigationBar>
            </NavigationContainer>
        );

        const relate_bar = (
            <div className="trend-index-list__relates">
                <div className="trend-index-list__relates-bar">
                    <LabelBar repositories={relates} isWhite={true} />
                </div>
            </div>
        );

        return (
            <div className="trend-index-list">
                <WaveHeader />
                <div className="trend-index-list__check-header">
                    <CheckHeader
                        title={tt('checks.trend.title')}
                        text={tt('checks.trend.text')}
                        foot={tt('checks.trend.foot')}
                        src={'trend'}
                    />
                </div>
                <div className="trend-index-list__nav">
                    {top_menu}
                    {relate_bar}
                    {body}
                </div>
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

export default connect(
    (state, props) => {
        const repositories = labelActions.getTrendContent(state);
        const sections_state = state.label.get('trend_label');
        const sections = !!sections_state ? sections_state.toJS() : [];
        const relates = labelActions.getShowRelateLabel(state);
        const loading = appActions.trendIndexPageLoading(state);
        const current_user = authActions.getCurrentUser(state);
        return {
            repositories,
            sections,
            relates,
            loading,
            current_user,
            more_loading: state.app.get('more_loading'),
        };
    },

    dispatch => ({
        loadMore: () => {
            dispatch(labelActions.getMoreTrendContent());
        },
    })
)(TrendIndexList);
