import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Img from 'react-image';
import tt from 'counterpart';
import { welcomeRoute } from '@infrastructure/RouteInitialize';

class LightingHeader extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        showHowTo: PropTypes.bool,
    };

    static defaultProps = {
        src: '/images/brands/lighting.png',
        showHowTo: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'LightingHeader'
        );
    }

    render() {
        const { src, showHowTo } = this.props;
        return (
            <div className="lighting-header">
                <div className="lighting-header__left">
                    <Img
                        className="lighting-header__left-image"
                        src={src}
                        alt={tt('alts.lighting')}
                    />
                </div>
                <div className="lighting-header__right">
                    <Img
                        className="lighting-header__right-image"
                        src={'/images/selfinity-logo.png'}
                        alt={tt('alts.lighting')}
                    />
                    <div className="lighting-header__right-texts">
                        <div className="lighting-header__right-texts__desc">
                            {tt('g.lighting_desc').split('\n')[0]}
                        </div>
                        <div className="lighting-header__right-texts__desc">
                            {tt('g.lighting_desc').split('\n')[1]}
                        </div>
                        <div className="lighting-header__right-texts__desc">
                            {tt('g.lighting_desc').split('\n')[2]}
                        </div>
                        <div className="lighting-header__right-texts__descs">
                            {tt('g.lighting_desc')
                                .replace('\n', '')
                                .replace(' ', '')}
                        </div>
                        <h1 className="lighting-header__right-texts__title">
                            {tt('g.lighting_title')}
                        </h1>
                    </div>
                    <div className="lighting-header__right-foot">
                        <Img
                            className="lighting-header__right-foot__image"
                            src={src}
                            alt={tt('alts.lighting')}
                        />
                    </div>
                </div>
                {showHowTo && (
                    <Link
                        className="lighting-header__link"
                        to={welcomeRoute.path}
                    >
                        {tt('g.what_selfinity_desc')}
                    </Link>
                )}
            </div>
        );
    }
}

/*<div className="lighting-header__right-texts__desc">
                            {tt('g.lighting_desc').split('\n')[3]}
                        </div>*/
export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(LightingHeader);
