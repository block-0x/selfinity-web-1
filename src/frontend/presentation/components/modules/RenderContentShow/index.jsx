import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import RenderImpl from '@modules/Render';
import models from '@network/client_models';
import ConditionalShowItem from '@modules/ConditionalShowItem';
import * as appActions from '@redux/App/AppReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import ReplyAxis from '@elements/ReplyAxis';
import ReplySection from '@elements/ReplySection';
import ConditionalDetailHeader from '@modules/ConditionalDetailHeader';
import ConditionalRow from '@modules/ConditionalRow';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ContentViewer from '@elements/ContentViewer';
import HomeRow from '@elements/HomeRow';
import ContentShowItem from '@elements/ContentShowItem';
import UserSection from '@elements/UserSection';
import RequestSection from '@elements/RequestSection';
import { getWindowSize } from '@network/window';
import { isScrollEndByClass } from '@extension/scroll';
import EmptyCommentItem from '@elements/EmptyCommentItem';
import Responsible from '@modules/Responsible';
import ParentSection from '@elements/ParentSection';
import { contentShowRoute } from '@infrastructure/RouteInitialize';
import tt from 'counterpart';
import OpinionViewer from '@modules/OpinionViewer';
import EmptyNewItem from '@elements/EmptyNewItem';
import AdsCard from '@elements/AdsCard';
import { detected } from 'adblockdetect';
import ad_config from '@constants/ad_config';

const root_regexp = new RegExp(/^\/\d+/, 'g');
const getRootId = path =>
    path.match(root_regexp) && path.match(root_regexp)[0].replace('/', '');

class RenderContentShow extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
        relate_repositories: PropTypes.object,
        loading: PropTypes.bool,
        relate_loading: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Content.build(),
        relate_repositories: [],
        loading: false,
        relate_loading: false,
    };

    state = {
        lg: false,
        adBlocked: !ad_config.show_ads,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RenderContentShow'
        );
        this.handleResize = this.handleResize.bind(this);
        this.toggleRelate = this.toggleRelate.bind(this);
        this.toggleRequest = this.toggleRequest.bind(this);
        this.state.repository = props.repository;
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }

    handleResize() {
        var size = getWindowSize();

        if (size.width > 999) {
            this.setState({
                lg: true,
            });
        } else {
            this.setState({
                lg: false,
            });
        }

        // this.toggleRelate();
    }

    componentWillMount() {
        this.handleResize();
        if (process.env.BROWSER)
            window.addEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.addEventListener('scroll', this.onWindowScroll, false);
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.removeEventListener('scroll', this.onWindowScroll, false);
    }

    onWindowScroll = () => {
        const { loadMore } = this.props;
        const isEnd = isScrollEndByClass('render-content-show__left');
        if (isEnd && loadMore) loadMore();
    };

    toggleRelate() {
        const { repository, relate_repositories } = this.props;

        const { lg } = this.state;

        if (lg) {
            if (repository.section)
                repository.section.removeByValueEnum('value', 'relate');
            this.setState({
                repository: repository,
            });
        } else {
            if (!relate_repositories) return;
            if (relate_repositories.length == 0) return;
            if (repository.section)
                repository.section.insertBeforeOtherEnum(
                    {
                        value: 'relate',
                    },
                    'value',
                    'reply_section'
                );
            this.setState({
                repository: repository,
            });
        }
    }

    componentDidMount = () => {
        this.setState({
            adBlocked: detected() || !ad_config.show_ads,
        });
    };

    toggleRequest(e) {
        if (e) e.preventDefault();
        const { repository } = this.props;
        repository.toggleRequest();
        this.setState({
            repository: repository,
        });
    }

    render() {
        const {
            relate_repositories,
            loading,
            relate_loading,
            repository,
            loadMore,
        } = this.props;

        const { adBlocked } = this.state;

        // const { repository } = this.state;

        if (!repository) return <div />;

        const renderRelate = relate_repositories =>
            relate_repositories ? (
                <div className="render-content-show__relates">
                    {!adBlocked && (
                        <div className="render-content-show__ad">
                            <AdsCard />
                        </div>
                    )}
                    <RenderImpl
                        responsible={false}
                        repository={relate_repositories}
                        keyIndex={`render-content-show__relates`}
                        loading={relate_loading}
                    />
                </div>
            ) : (
                <div />
            );

        const renderResponsibleRelate = (relate_repositories, key) =>
            relate_repositories ? (
                <Responsible
                    key={key}
                    breakingContent={
                        <div className="render-content-show__relates" key={key}>
                            <OpinionViewer
                                repositories={relate_repositories.contents}
                                keyIndex={`render-content-show__relates`}
                                loading={relate_loading}
                                readOnly={true}
                                isAds={true}
                            />
                        </div>
                    }
                    breakLg={true}
                />
            ) : (
                <div />
            );

        const childrenRow = (children, key) => (
            <div className="render-content-show__children" key={key}>
                {children.map((child, index) => (
                    <div className="render-content-show__child" key={index}>
                        <HomeRow key={index} repository={child} />
                    </div>
                ))}
                {repository.parent && (
                    <div className="render-content-show__root">
                        <Link
                            className="render-content-show__root-link"
                            to={contentShowRoute.getPath({
                                params: {
                                    id: getRootId(repository.content.path),
                                },
                            })}
                        >
                            {tt('g.show_more') + '...'}
                        </Link>
                    </div>
                )}
            </div>
        );

        const requestsRow = (requests, key) => (
            <div className="render-content-show__request-items" key={key}>
                {requests.map((request, index) => (
                    <div className="render-content-show__request" key={index}>
                        <ConditionalRow key={index} repository={request} />
                    </div>
                ))}
            </div>
        );

        const requestSectionRow = (model, key) => (
            <div className="render-content-show__requests" key={key}>
                <div className="render-content-show__request-section">
                    <RequestSection
                        onClick={e => {
                            model.toggleRequest();
                            this.forceUpdate();
                        }}
                        isFold={!model.showRequest}
                    />
                </div>
                {requestsRow(model.requests, key)}
            </div>
        );

        const parentSectionRow = (model, key) => (
            <div className="render-content-show__requests" key={key}>
                <div className="render-content-show__request-section">
                    <ParentSection
                        onClick={e => {
                            model.toggleParent();
                            this.forceUpdate();
                        }}
                        isFold={!model.showParent}
                    />
                </div>
                {model.parent && childrenRow([model.parent], key)}
            </div>
        );

        const replySectionRow = key => (
            <div key={key}>
                <div className="render-content-show__reply-section">
                    <ReplySection />
                </div>
                <EmptyCommentItem />
                <div className="render-content-show__empty-opinion">
                    <EmptyNewItem repository={repository.content} />
                </div>
            </div>
        );

        const contentRow = (content, parent, key) => (
            <div className="render-content-show__content" key={key}>
                <Responsible
                    defaultContent={
                        <ContentShowItem repository={content} parent={parent} />
                    }
                    breakingContent={
                        <ContentShowItem
                            repository={content}
                            parent={parent}
                            isBackground={false}
                        />
                    }
                    breakFm={true}
                />
            </div>
        );

        const userRow = (content, key) => (
            <div className="render-content-show__user" key={key}>
                <UserSection
                    repository={content.User}
                    isPrivate={content.isPrivate}
                />
            </div>
        );

        const renderLeftRow = item =>
            item.section._enums.map((row, index) => {
                switch (row.value) {
                    case 'body':
                        return item.content ? (
                            contentRow(
                                item.content,
                                item._parent || item._requests[0],
                                index
                            )
                        ) : (
                            <div key={index} />
                        );
                        break;
                    case 'relate':
                        return (
                            <div key={index}>
                                <Responsible
                                    breakingContent={
                                        <div className="render-content-show__relates-title">
                                            {tt('g.related')}
                                        </div>
                                    }
                                    breakLg={true}
                                />
                                {renderResponsibleRelate(
                                    relate_repositories,
                                    index
                                )}
                            </div>
                        );
                    case 'reply_section':
                        return replySectionRow(index);
                    case 'request_section':
                        return requestSectionRow(item, index);
                    case 'parent_section':
                        return parentSectionRow(item, index);
                    case 'user_section':
                        return !item.isPrivate && userRow(item.content, index);
                    case 'children':
                        return item.children.length > 0 ? (
                            childrenRow(item.children, index)
                        ) : (
                            <div key={index} />
                        );
                    default:
                        return <div key={index} />;
                }
            });

        const bodyRow = content => {
            return (
                <div className="render-content-show__body">
                    <div className="render-content-show__left">
                        {content && renderLeftRow(content)}
                    </div>
                    <div className="render-content-show__right">
                        <Responsible
                            defaultContent={
                                relate_repositories &&
                                renderRelate(relate_repositories)
                            }
                            breakLg={true}
                        />
                    </div>
                </div>
            );
        };

        return (
            <div className="render-content-show">
                {repository.content && bodyRow(repository)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const relate_loading = appActions.contentShowRelateLoading(state);
        return {
            relate_loading,
        };
    },

    dispatch => ({
        loadMore: () => {
            dispatch(contentActions.getMoreComment());
        },
    })
)(RenderContentShow);
