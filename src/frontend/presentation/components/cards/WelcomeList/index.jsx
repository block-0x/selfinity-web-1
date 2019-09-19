import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import CollectionItem from '@elements/CollectionItem';
import Icon from '@elements/Icon';
import GradationButton from '@elements/GradationButton';
import TrapezoidBackground from '@modules/TrapezoidBackground';
import tt from 'counterpart';
import { loginRoute, signupRoute } from '@infrastructure/RouteInitialize';
import Responsible from '@modules/Responsible';
import FunctionShowItem from '@elements/FunctionShowItem';
import Img from 'react-image';
import LightingHeader from '@elements/LightingHeader';

class WelcomeList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'WelcomeList');
        this.getItemSize = this.getItemSize.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleSleepResize = this.handleSleepResize.bind(this);
        this.handleRect = this.handleRect.bind(this);
    }

    getItemSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('welcome-list')[0],
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
    }

    handleSleepResize(sec = 0) {
        sleep(sec, () => {
            var size = this.getItemSize();
            this.setState({
                height: size.height,
                width: size.width,
            });
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
        const { height, width, mounted } = this.state;

        const actionBody = (
            <div className="welcome-list__foreground-actions">
                <div className="welcome-list__foreground-action">
                    <CollectionItem
                        title={tt('g.productivity')}
                        src={'point'}
                        value={tt('g.productivity_desc')}
                        fill={false}
                    />
                </div>
                <div className="welcome-list__foreground-action">
                    <CollectionItem
                        title={tt('g.credition')}
                        src={'color-upvote-img'}
                        value={tt('g.credition_desc')}
                        fill={false}
                    />
                </div>
                <div className="welcome-list__foreground-action">
                    <CollectionItem
                        title={tt('g.quality')}
                        src={'success'}
                        value={tt('g.quality_desc')}
                        fill={false}
                    />
                </div>
            </div>
        );

        const creditBody = (
            <div className="welcome-list__foreground-credit">
                <div className="welcome-list__foreground-credit-image">
                    <Icon src="point" size={'3x'} />
                </div>
                <div className="welcome-list__foreground-credit-desc">
                    {tt('g.credit_desc')}
                </div>
            </div>
        );

        const meritBody = (
            <div className="welcome-list__foreground-merit">
                <div className="welcome-list__foreground-merit-title">
                    {tt('g.merit_title')}
                </div>
                <div className="welcome-list__foreground-merit-border" />
                <div className="welcome-list__foreground-merit-body">
                    <Img
                        className="welcome-list__foreground-merit-body__image"
                        src="/images/selftoken-mini-logo.png"
                        alt={tt('alts.default')}
                    />
                    <div className="welcome-list__foreground-merit-body__text">
                        <div className="welcome-list__foreground-merit-body__text-title">
                            {tt('g.merit_point')}
                        </div>
                        <div className="welcome-list__foreground-merit-body__text-body">
                            {tt('g.merit_desc')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const wayBody = (
            <div className="welcome-list__foreground-way">
                <div className="welcome-list__foreground-way-title">
                    {tt('g.flow_title')}
                </div>
                <div className="welcome-list__foreground-way-border" />
                <div className="welcome-list__foreground-way__actions">
                    <div className="welcome-list__foreground-way__action">
                        <CollectionItem
                            sizeS={true}
                            title={tt('lightings.opinion.title')}
                            src={'color-debate'}
                            value={tt('lightings.opinion.text')}
                            fill={false}
                        />
                    </div>
                    <div className="welcome-list__foreground-way__action">
                        <CollectionItem
                            sizeS={true}
                            title={tt('lightings.good.title')}
                            src={'color-upvote-img'}
                            value={tt('lightings.good.text')}
                            fill={false}
                        />
                    </div>
                    <div className="welcome-list__foreground-way__action">
                        <CollectionItem
                            sizeS={true}
                            title={tt('lightings.credit.title')}
                            src={'point'}
                            value={tt('lightings.credit.text')}
                            fill={false}
                        />
                    </div>
                </div>
            </div>
        );

        const finallyBody = (
            <div className="welcome-list__foreground-finally">
                <Img
                    className="welcome-list__foreground-finally-image"
                    src="/images/selfinity-logo.png"
                />
                <div className="welcome-list__foreground-finally-desc">
                    {tt('g.welcome_desc')}
                </div>
                <div className="welcome-list__foreground-finally-button">
                    <GradationButton
                        value={tt('g.signup')}
                        color="blue"
                        url={signupRoute.path}
                    />
                </div>
                <div className="welcome-list__foreground-finally-button">
                    <GradationButton
                        value={tt('g.login')}
                        url={loginRoute.path}
                    />
                </div>
            </div>
        );

        const functionBody = (
            <div className="welcome-list__foreground__function">
                <div className="welcome-list__foreground__function-title">
                    {tt('g.function_title')}
                </div>
                <div className="welcome-list__foreground__function-border" />
                <div className="welcome-list__foreground__function-text">
                    {tt('g.function_desc')}
                </div>
                <div className="welcome-list__foreground__function-items">
                    <div className="welcome-list__foreground__function-item">
                        <FunctionShowItem
                            title={tt('g.function_super_good')}
                            src={'/images/brands/super-good.png'}
                            text={tt('g.function_super_good_desc')}
                            backTitle={'1'}
                            reverse={false}
                        />
                    </div>
                    <div className="welcome-list__foreground__function-item">
                        <FunctionShowItem
                            title={tt('g.function_bid')}
                            src={'/images/brands/bid-function.png'}
                            text={tt('g.function_bid_desc')}
                            backTitle={'2'}
                            reverse={true}
                        />
                    </div>
                </div>
            </div>
        );

        /*
        <h2 className="welcome-list__foreground-title">
                        {tt('g.summary_selfinity')}
                    </h2>
                    {actionBody}
        */

        return (
            <div
                className="welcome-list"
                id="welcome-list"
                ref={divElement => this.handleRect(divElement)}
            >
                <Responsible
                    className="welcome-list__background"
                    defaultContent={
                        <Img
                            src={'/images/trapezoid-repeating-white.png'}
                            className="welcome-list__background__image"
                        />
                    }
                    breakingContent={
                        <TrapezoidBackground
                            height={height}
                            width={width}
                            boxWidth={width || 3000}
                            boxHeight={height || 3000}
                            styleC={{ fill: '#F0F0F0' }}
                            styleB={{ fill: '#FFFFFF' }}
                            styleA={{ fill: '#D2D2D2' }}
                            styleD={{ fill: '#FFFFFF' }}
                        />
                    }
                    breakMd={true}
                />
                <div className="welcome-list__foreground">
                    <Img
                        className="welcome-list__foreground-logo"
                        src="/images/selfinity-mini-logo3.png"
                        alt={tt('g.selfinity_mission')}
                    />
                    <h1 className="welcome-list__foreground-mission">
                        {tt('g.selfinity_mission')}
                    </h1>
                    {functionBody}
                    {meritBody}
                    <div className="render-index__lighting">
                        <Responsible
                            defaultContent={<LightingHeader />}
                            breakingContent={
                                <LightingHeader
                                    src={'/images/brands/lighting.png'}
                                />
                            }
                            breakSm={true}
                        />
                    </div>
                    {finallyBody}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(WelcomeList);

/*
<TrapezoidBackground
    height={height}
    width={width}
    boxWidth={width || 3000}
    boxHeight={height || 3000}
    styleC={{ fill: '#F0F0F0' }}
    styleB={{ fill: '#FFFFFF' }}
    styleA={{ fill: '#D2D2D2' }}
    styleD={{ fill: '#FFFFFF' }}
/>
*/
