import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import CollectionItem from '@elements/CollectionItem';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import tt from 'counterpart';
import {
    signupRoute,
    welcomeRoute,
    loginRoute,
} from '@infrastructure/RouteInitialize';
import Img from 'react-image';

class InitialHeader extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'InitialHeader'
        );
    }

    render() {
        const renderItem = (
            <div className="initial-header__items">
                <div className="initial-header__item">
                    <CollectionItem
                        src="noimage"
                        title={tt('g.signup')}
                        value={tt('g.signup_desc')}
                        link={signupRoute.path}
                    />
                </div>
                <div className="initial-header__item">
                    <CollectionItem
                        src="selfinity-mini-logo"
                        title={tt('g.what_selfinity')}
                        value={tt('g.what_selfinity_desc')}
                        link={welcomeRoute.path}
                    />
                </div>
            </div>
        );
        return (
            <div className="initial-header">
                <Img
                    className="initial-header__logo"
                    src="/images/selfinity-logo.png"
                    alt={tt('alts.default')}
                />
                <div className="initial-header__welcome">{tt('g.welcome')}</div>
                <div className="initial-header__desc">
                    {tt('g.first_user?')}
                </div>
                {renderItem}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(InitialHeader);

/*
<div className="initial-header__item" >
    <CollectionItem
        scr={'feed'}
        title={tt('g.login')}
        value={tt('g.login_desc')}
        link={loginRoute.path}
    />
</div>
*/
