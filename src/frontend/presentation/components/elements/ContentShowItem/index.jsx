import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import BlurBackground from '@elements/BlurBackground';
import AppPropTypes from '@extension/AppPropTypes';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import StatsBar from '@modules/StatsBar';
import ContentViewer from '@elements/ContentViewer';
import Gallery from '@modules/Gallery';
import LabelTag from '@elements/LabelTag';
import TrapezoidBackground from '@modules/TrapezoidBackground';
import { sleep } from '@extension/sleep';
import ope from '@extension/operator';
import RequestBar from '@elements/RequestBar';
import LoadingIndicator from '@elements/LoadingIndicator';
import { routeEntities, notfoundRoute } from '@infrastructure/RouteInitialize';
import UserStatsBar from '@modules/UserStatsBar';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import models from '@network/client_models';
import OpinionAcceptButton from '@elements/OpinionAcceptButton';
import ConditionalBackground from '@modules/ConditionalBackground';
import ConditionalRow from '@modules/ConditionalRow';
import OpinionSectionButton from '@elements/OpinionSectionButton';
import RequestSimpleButton from '@elements/RequestSimpleButton';
import ReplyAxis from '@elements/ReplyAxis';
import EmptyNewItem from '@elements/EmptyNewItem';
import PointSection from '@modules/PointSection';

class ContentShowItem extends React.Component {
    static propTypes = {
        parent: PropTypes.oneOfType([
            AppPropTypes.Content,
            AppPropTypes.Request,
        ]),
        repository: AppPropTypes.Content,
        isBackground: PropTypes.bool,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Content.build(),
        isBackground: true,
        loading: false,
    };

    static redirect = url => {
        window.location.replace(url);
    };

    state = {
        height: 0,
        width: 0,
        offsetY: 0,
        lg: false,
        top: 0,
        scrolled: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ContentShowItem'
        );
        this.getItemSize = this.getItemSize.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleSleepResize = this.handleSleepResize.bind(this);
        this.handleRect = this.handleRect.bind(this);
        this.unwrap = this.unwrap.bind(this);
    }

    unwrap() {
        const { repository } = this.props;
        if (!repository) return false;
        if (
            repository.title == ContentShowItem.defaultProps.repository.title &&
            repository.body == ContentShowItem.defaultProps.repository.body &&
            repository.UserId == ContentShowItem.defaultProps.repository.UserId
        )
            return false;
        return true;
    }

    getItemSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('content-show-item')[0],
            w = w.innerWidth || e.clientWidth || g.clientWidth,
            h = w.innerHeight || e.clientHeight || g.clientHeight;
        return {
            width: w,
            height: h,
        };
    }

    handleResize() {
        var size = this.getItemSize();
        this.setState({
            height: size.height,
            width: size.width,
        });
        if (size.width > 999) {
            this.setState({
                lg: true,
            });
        } else {
            this.setState({
                lg: false,
            });
        }
        const element = document.getElementById('content-show-item-top');
        if (element) {
            const clientRect = element.getBoundingClientRect();
            this.setState({
                offsetY: clientRect.height,
                top: clientRect.top,
            });
        }
    }

    handleSleepResize(sec = 0) {
        sleep(sec, () => {
            var size = this.getItemSize();
            this.setState({
                height: size.height,
                width: size.width,
            });
            if (size.width > 999) {
                this.setState({
                    lg: true,
                });
            } else {
                this.setState({
                    lg: false,
                });
            }
            const element = document.getElementById('content-show-item-top');
            if (element) {
                const clientRect = element.getBoundingClientRect();
                this.setState({
                    offsetY: clientRect.height,
                    top: clientRect.top,
                });
            }

            const { lg, scrolled } = this.state;
            const { parent } = this.props;
            if (!!parent && !lg && !scrolled) {
                browserHistory.push(
                    browserHistory.getCurrentLocation().pathname +
                        '#content-show-item-axis'
                );
                // const element2 = document.getElementById(
                //     'content-show-item-title'
                // );
                // if (element2) {
                //     const clientRect = element2.getBoundingClientRect();
                //     window.scrollTo(0, clientRect.top - 77);
                //     this.setState({ scrolled: true });
                // }
                this.setState({ scrolled: true });
            }
        });
    }

    componentWillMount() {
        this.handleResize();
        if (process.env.BROWSER)
            window.addEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.addEventListener('click', this.handleResize);
        this.setState({
            mounted: false,
        });
    }

    componentDidMount() {
        this.setState({
            mounted: true,
        });
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.removeEventListener('click', this.handleResize);
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        this.handleSleepResize(0);
        this.handleSleepResize(1);
    }

    handleRect(divElement) {
        this.divElement = divElement;
        if (!!divElement) {
            this.setState({
                height: divElement.clientHeight,
                width: divElement.clientWidth,
            });
        }
    }

    render() {
        const {
            repository,
            _repository,
            isBackground,
            loading,
            isShowAcceptButton,
            isShowOpinionButton,
            parent,
            isMyAccount,
        } = this.props;
        const { height, width, mounted, offsetY } = this.state;

        if (!this.unwrap()) {
            ContentShowItem.redirect(notfoundRoute.path);
            return <div />;
        }

        const loadView = (
            <center>
                <LoadingIndicator />
            </center>
        );

        if (loading || !mounted || !_repository) {
            return <div className="content-show-item">{loadView}</div>;
        }

        const renderLabelItem = items =>
            items.map((item, index) => (
                <div className="content-show-item__item-label" key={index}>
                    <LabelTag key={index} repository={item} />
                </div>
            ));

        const item = (
            <ConditionalBackground
                repository={_repository}
                className="content-show-item__item"
                offsetY={offsetY}
            >
                {parent && (
                    <div
                        className="content-show-item__parent"
                        id="content-show-item-top"
                    >
                        <ConditionalRow repository={parent} />
                        <div
                            className="content-show-item__parent-axis"
                            id="content-show-item-axis"
                        >
                            <ReplyAxis />
                        </div>
                        <div className="content-show-item__parent-axis-1">
                            <ReplyAxis />
                        </div>
                    </div>
                )}
                <h1
                    className="content-show-item__item-title"
                    id="content-show-item-title"
                >
                    {routeEntities.params_value(
                        'id',
                        browserHistory.getCurrentLocation().pathname
                    ) == _repository.id && _repository.title}
                </h1>
                <div className="content-show-item__item-border" />
                <div className="content-show-item__item-body">
                    <ContentViewer
                        body={_repository.body}
                        loading={
                            routeEntities.params_value(
                                'id',
                                browserHistory.getCurrentLocation().pathname
                            ) != _repository.id
                        }
                    />
                </div>
                {isMyAccount && (
                    <div className="content-show-item__item-point">
                        <PointSection repository={_repository} />
                    </div>
                )}
                {_repository.Labelings && (
                    <div className="content-show-item__item-labels">
                        <Gallery>
                            {renderLabelItem(
                                repository.Labelings.notBotLabels(
                                    repository.Labelings
                                )
                            )}
                        </Gallery>
                    </div>
                )}
                {isShowAcceptButton && (
                    <div className="content-show-item__button">
                        <OpinionAcceptButton repository={_repository} />
                    </div>
                )}
                {Number.prototype.castBool(repository.isRequestWanted) && (
                    <div className="content-show-item__button">
                        <RequestSimpleButton repository={_repository.User} />
                    </div>
                )}
                {!_repository.isPrivate && (
                    <div className="content-show-item__item-user">
                        <UserStatsBar
                            repository={_repository.User || _repository.Voter}
                        />
                    </div>
                )}
                <div className="content-show-item__item-foot">
                    <StatsBar
                        repository={_repository}
                        repository_user={_repository.User || _repository.Voter}
                        showReplyCounter={true}
                        showCheeringCounter={true}
                        showGoodOpinionCounter={true}
                        showPoint={false}
                        showUpvote={false}
                        showDownvote={false}
                        showHelp={true}
                    />
                </div>
                {(isShowOpinionButton ||
                    Number.prototype.castBool(_repository.isOpinionWanted)) && (
                    <div className="content-show-item__button">
                        <OpinionSectionButton repository={_repository} />
                    </div>
                )}
            </ConditionalBackground>
        );
        // <BlurBackground />

        return isBackground ? (
            <div
                className="content-show-item"
                id="content_show_item"
                ref={divElement => this.handleRect(divElement)}
            >
                <div className="content-show-item__background">
                    <TrapezoidBackground
                        height={height}
                        width={width}
                        boxHeight={height}
                        boxWidth={width}
                        styleA={{ fill: '#7BEBFF' }}
                        styleB={{ fill: '#13B4FC' }}
                        styleC={{ fill: '#7BEBFF' }}
                        styleD={{ fill: '#13B4FC' }}
                    />
                </div>
                <div className="content-show-item__foreground">
                    {_repository && item}
                </div>
            </div>
        ) : (
            <div className="content-show-item">{_repository && item}</div>
        );
    }
}

/*
{ope.isRequest(repository) &&
    !ope.isContent(repository) && (
        <div className="content-show-item__request-bar">
            <RequestBar repository={repository} />
        </div>
    )
}
*/

export default connect(
    (state, props) => {
        const _repository = contentActions.bind(props.repository, state);
        const current_user = authActions.getCurrentUser(state);
        const isMyAccount =
            !!_repository && !!current_user
                ? current_user.id == _repository.UserId
                : false;
        return {
            show_side_bar: state.app.get('show_side_bar'),
            isShowAcceptButton: contentActions.isShowAcceptButton(
                _repository,
                state
            ),
            isShowOpinionButton: contentActions.isShowOpinionButton(
                _repository,
                state
            ),
            _repository,
            current_user,
            isMyAccount,
        };
    },

    dispatch => ({})
)(ContentShowItem);
