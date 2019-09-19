import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import RenderImpl from '@modules/Render';
import models from '@network/client_models';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ConditionalStickyHeader from '@modules/ConditionalStickyHeader';
import WaveBackground from '@elements/WaveBackground';
import InitialHeader from '@modules/InitialHeader';
import TabPager from '@modules/TabPager';
import SectionHeader from '@elements/SectionHeader';
import WaveHeader from '@elements/WaveHeader';
import CheckHeader from '@modules/CheckHeader';
import tt from 'counterpart';
import LightingHeader from '@elements/LightingHeader';
import Responsible from '@modules/Responsible';
import ope from '@extension/operator';
import OpinionNewViewer from '@modules/OpinionNewViewer';
import CollectionItem from '@elements/CollectionItem';
import { welcomeRoute } from '@infrastructure/RouteInitialize';

class RenderIndex extends React.Component {
    static propTypes = {
        repositories: PropTypes.array,
        isInitial: PropTypes.bool,
        isPager: PropTypes.bool,
        page: PropTypes.object,
        headerHidden: PropTypes.bool,
        sticky: PropTypes.bool,
        isShowHomeCheck: PropTypes.bool,
        isShowUserCheck: PropTypes.bool,
        isShowNewCheck: PropTypes.bool,
        isShowLighting: PropTypes.bool,
        isShowLightingHeader: PropTypes.bool,
    };

    static defaultProps = {
        repositories: null,
        isInitial: false,
        isPager: false,
        page: {},
        headerHidden: false,
        sticky: true,
        isShowHomeCheck: false,
        isShowUserCheck: false,
        isShowNewCheck: false,
        isShowLighting: false,
        isShowLightingHeader: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'RenderIndex');
    }

    render() {
        const {
            repositories,
            isInitial,
            isPager,
            pages,
            headerHidden,
            sticky,
            isShowHomeCheck,
            isShowUserCheck,
            isShowNewCheck,
            isShowLighting,
            isShowLightingHeader,
            hottests,
            ...inputProps
        } = this.props;

        const renderingCell = model =>
            model.items.map((item, index) => (
                <RenderImpl
                    key={`${model.key}${index}`}
                    keyIndex={`${model.key}${index}`}
                    count={model.key - 0}
                    repository={item}
                    align={true}
                    {...inputProps}
                />
            ));

        const rendering = items =>
            items.map((item, index) => (
                <div className="render-index__section" key={index}>
                    {ope.isUser(item.content) && (
                        <ConditionalStickyHeader
                            sticky={sticky}
                            repository={item.content}
                            key={index}
                        />
                    )}
                    {item.items.length > 0 && renderingCell(item)}
                </div>
            ));

        return (
            <div className="render-index">
                {!headerHidden && <WaveHeader />}
                {isShowLightingHeader && (
                    <div className="render-index__lighting">
                        <Responsible
                            defaultContent={<LightingHeader showHowTo={true} />}
                            breakingContent={
                                <LightingHeader
                                    src={'/images/brands/lighting.png'}
                                    showHowTo={true}
                                />
                            }
                            breakSm={true}
                        />
                    </div>
                )}
                {isShowLighting && (
                    <div className="render-index__check-header">
                        <CheckHeader
                            title={tt('checks.lighting.title')}
                            text={tt('checks.lighting.text')}
                            foot={tt('checks.lighting.foot')}
                            src={'megaphone'}
                        />
                    </div>
                )}
                {isShowLighting && (
                    <div className="render-index__actions">
                        <div className="render-index__action">
                            <CollectionItem
                                sizeS={true}
                                title={tt('lightings.opinion.title')}
                                src={'color-debate'}
                                value={tt('lightings.opinion.text')}
                                fill={false}
                            />
                        </div>
                        <div className="render-index__action">
                            <CollectionItem
                                sizeS={true}
                                title={tt('lightings.good.title')}
                                src={'color-upvote-img'}
                                value={tt('lightings.good.text')}
                                fill={false}
                            />
                        </div>
                        <div
                            className="render-index__action"
                            id={'render-index-action-last'}
                        >
                            <CollectionItem
                                sizeS={true}
                                title={tt('lightings.credit.title')}
                                src={'point'}
                                value={tt('lightings.credit.text')}
                                fill={false}
                            />
                        </div>
                    </div>
                )}
                {isShowLighting && (
                    <Link
                        className="render-index__actions-to"
                        to={welcomeRoute.path}
                    >
                        {tt('g.what_selfinity_desc')}
                    </Link>
                )}
                {hottests && (
                    <div>
                        <div className="render-index__check-header">
                            <CheckHeader
                                title={tt('checks.start.title')}
                                text={tt('checks.start.text')}
                                foot={tt('checks.start.foot')}
                            />
                        </div>
                        <div className="home-list__hottests">
                            <OpinionNewViewer repositories={hottests} />
                        </div>
                    </div>
                )}
                {isShowHomeCheck && (
                    <div className="render-index__check-header">
                        <CheckHeader
                            title={tt('checks.home.title')}
                            text={tt('checks.home.text')}
                            foot={tt('checks.home.foot')}
                        />
                    </div>
                )}
                {isShowUserCheck && (
                    <div className="render-index__check-header">
                        <CheckHeader
                            title={tt('checks.user.title')}
                            text={tt('checks.user.text')}
                            foot={tt('checks.user.foot')}
                            src={'auction'}
                        />
                    </div>
                )}
                {isShowNewCheck && (
                    <div className="render-index__check-header">
                        <CheckHeader
                            title={tt('checks.new.title')}
                            text={tt('checks.new.text')}
                            foot={tt('checks.new.foot')}
                            src={'feed'}
                        />
                    </div>
                )}
                {isInitial && (
                    <div className="render-index__initial-header">
                        <InitialHeader />
                    </div>
                )}
                {isPager && (
                    <SectionHeader>
                        <div className="render-index__pager">
                            <div className="render-index__pager__body">
                                <TabPager repositories={pages} />
                            </div>
                        </div>
                    </SectionHeader>
                )}
                {rendering(repositories)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(RenderIndex);
