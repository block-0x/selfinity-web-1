/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ReplyAxis from '@elements/ReplyAxis';
import SimpleButton from '@elements/SimpleButton';
import { Enum, defineEnum } from '@extension/Enum';
import { HomeModel } from '@entity';
import CategoryItem from '@elements/CategoryItem';
import HighLight from '@modules/HighLight';
import ConditionalItem from '@modules/ConditionalItem';
import ConditionalHeader from '@modules/ConditionalHeader';
import NotFoundItem from '@elements/NotFoundItem';
import Gallery from '@modules/Gallery';
import LoadingIndicator from '@elements/LoadingIndicator';
import { isScrollEndByClass } from '@extension/scroll';
import classNames from 'classnames';
import ope from '@extension/operator';
import ConditionalViewer from '@modules/ConditionalViewer';
import HomeCategoryItem from '@elements/HomeCategoryItem';
import OpinionViewer from '@modules/OpinionViewer';
import AdsCard from '@elements/AdsCard';
import ad_config from '@constants/ad_config';
import Responsible from '@modules/Responsible';
import {
    breakpointXs,
    breakpointSm,
    breakpointFm,
    breakpointMd,
    breakpointLg,
    breakpointXl,
    breakpointXxl,
    getWindowSize,
} from '@network/window';
import { detected } from 'adblockdetect';

export default class RenderImpl extends React.Component {
    state = {
        md: false,
        adBlocked: !ad_config.show_ads,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'RenderImpl');
        this.onClickLoadMore = this.onClickLoadMore.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        var size = getWindowSize();

        this.setState({
            md: size.width < breakpointMd,
        });
    }

    componentWillMount() {
        this.setState({
            mounted: false,
        });
        if (process.env.BROWSER)
            window.addEventListener('scroll', this.onWindowScroll, false);
        this.handleResize();
        if (process.env.BROWSER)
            window.addEventListener('resize', this.handleResize);
    }

    componentDidMount() {
        this.setState({
            mounted: true,
            adBlocked: detected() || !ad_config.show_ads,
        });
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('scroll', this.onWindowScroll, false);
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.handleResize);
    }

    onWindowScroll = () => {
        const { loadMore, keyIndex } = this.props;
        const isEnd = isScrollEndByClass(`r${keyIndex}`);
        if (isEnd && loadMore) loadMore();
    };

    onClickLoadMore(e) {
        const { loadMore } = this.props;
        if (e) e.preventDefault();
        if (loadMore) loadMore();
    }

    render() {
        const {
            repository,
            keyIndex,
            loading,
            responsible,
            align,
            count,
        } = this.props;

        const { onClickLoadMore } = this;

        const { md, adBlocked } = this.state;

        if (loading || !this.state.mounted)
            return (
                <LoadingIndicator
                    type={'circle'}
                    style={{ marginLeft: '49%', marginRight: '49%' }}
                />
            );

        const adsRow = (children, className, key) => (
            <div key={key}>
                <div className={className} key={`${key}:ad`}>
                    <AdsCard />
                </div>
                {children}
            </div>
        );

        const categoryRow = (string, key) => {
            return string != '' && !!string ? (
                <div
                    className="render__category"
                    id={`${this.props.keyIndex}${key}`}
                    key={`${this.props.keyIndex}${key}`}
                >
                    <CategoryItem value={string} />
                </div>
            ) : (
                <div key={`${this.props.keyIndex}${key}`} />
            );
        };

        const homeCategoryRow = (content, key) => {
            return !!content ? (
                <div
                    className="render__home-category"
                    id={`${this.props.keyIndex}${key}`}
                    key={`${this.props.keyIndex}${key}`}
                >
                    <HomeCategoryItem repository={content} />
                </div>
            ) : (
                <div key={`${this.props.keyIndex}${key}`} />
            );
        };

        const viewerRow = (items, content, index) => (
            <div className={'render__viewer'} key={index}>
                <ConditionalViewer
                    repositories={items}
                    repository={content}
                    isAds={(count + 1) % ad_config.show_section_count == 0}
                />
            </div>
        );

        const pureCategoryRow = (string, key) => (
            <div className="render__pure-category" key={key}>
                {string}
            </div>
        );

        const headerRow = (repository, key) => (
            <div className="render__header" key={key}>
                <ConditionalHeader repository={repository} />
            </div>
        );

        const wideHeaderRow = (repository, key) => (
            <div className="render__wide-header" key={key}>
                <ConditionalHeader repository={repository} />
            </div>
        );

        // const highLightRow = (repositories, key) => (
        //     <div className="render__high-light" key={key} >
        //         <HighLight repositories={repositories} />
        //     </div>
        // );

        const notfoundRow = key => (
            <div className="render__not-found" key={key}>
                <NotFoundItem />
            </div>
        );

        const bodyRow = items =>
            items.filter(item => !(item == OpinionViewer.adsKey)).map(
                (item, index) =>
                    0 == (index + 1) % ad_config.show_grid_count &&
                    (ope.isContent(item) || ope.isLabel(item)) &&
                    !md &&
                    !adBlocked ? (
                        adsRow(
                            <div
                                className={classNames({
                                    render__item:
                                        ope.isContent(item) ||
                                        ope.isLabel(item),
                                    'render__item-request': ope.isRequest(item),
                                    'render__item-user': ope.isUser(item),
                                })}
                                key={index}
                            >
                                <ConditionalItem
                                    repository={item}
                                    align={align}
                                />
                            </div>,
                            classNames('render__item-ad', {
                                render__item:
                                    ope.isContent(item) || ope.isLabel(item),
                                'render__item-request': ope.isRequest(item),
                                'render__item-user': ope.isUser(item),
                            }),
                            index
                        )
                    ) : (
                        <div
                            className={classNames({
                                render__item:
                                    ope.isContent(item) || ope.isLabel(item),
                                'render__item-request': ope.isRequest(item),
                                'render__item-user': ope.isUser(item),
                            })}
                            key={index}
                        >
                            <ConditionalItem repository={item} align={align} />
                        </div>
                    )
            );

        const uplightRow = items =>
            items
                .filter(item => !(item == OpinionViewer.adsKey))
                .map((item, index) => (
                    <div className="render__uplight" key={index}>
                        <ConditionalItem repository={item} />
                    </div>
                ));

        const buttonRow = key => (
            <div className="render__detail" key={key}>
                <SimpleButton value="もっと見る" onClick={onClickLoadMore} />
            </div>
        );

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'category':
                        return categoryRow(repository.categories[0], index);
                    case 'notfound':
                        return notfoundRow(index);
                    case 'pure_category':
                        return pureCategoryRow(repository.categories[0], index);
                    // case 'highlight':
                    //     return highLightRow(repository.storyContents, index);
                    //     break;
                    case 'border':
                        return <div className="render__border" key={index} />;
                    case 'uplight':
                        return uplightRow(repository.contents);
                    case 'horizon':
                        return (
                            <div className="render__horizon">
                                <OpinionViewer
                                    key={index}
                                    repositories={repository.contents}
                                />
                            </div>
                        );
                    case 'body':
                        return (
                            <div className="render__body" key={index}>
                                <Gallery key={index}>
                                    {bodyRow(repository.contents)}
                                </Gallery>
                            </div>
                        );
                    case 'header':
                        return headerRow(repository.storyContents[0], index);
                        break;
                    case 'wide_header':
                        return wideHeaderRow(
                            repository.storyContents[0],
                            index
                        );
                    case 'button':
                        return buttonRow(index);
                    case 'homeCategory':
                        return homeCategoryRow(
                            repository.storyContents[0],
                            index
                        );
                    case 'viewer':
                        return viewerRow(
                            repository.contents,
                            repository.storyContents[0],
                            index
                        );
                    default:
                        return <div key={index} />;
                }
            });

        return responsible ? (
            <div className={`render r${keyIndex}`} key={keyIndex}>
                {repository && renderItem(repository.section)}
            </div>
        ) : (
            <div
                className={`r${keyIndex}`}
                key={keyIndex}
                style={{ marginTop: '20px' }}
            >
                {repository && renderItem(repository.section)}
            </div>
        );
    }
}

RenderImpl.defaultProps = {
    repository: null,
    loading: false,
    keyIndex: `00`,
    responsible: true,
    align: false,
    count: 0,
};

RenderImpl.propTypes = {
    repository: PropTypes.object,
    keyIndex: PropTypes.any,
    loading: PropTypes.bool,
    loadMore: PropTypes.func,
    responsible: PropTypes.bool,
    align: PropTypes.bool,
    count: PropTypes.number,
};
