/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import FeedIndexList from '@cards/FeedIndexList';
import IndexComponentImpl from '@pages/IndexComponent';

class FeedIndex extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'FeedIndex');
    }

    render() {
        var { section } = this.props.routeParams;

        if (!section) section = 'disscussions';

        return (
            <IndexComponentImpl>
                <div className="feed-index">
                    <FeedIndexList section={section} />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/feeds(/:section)',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(FeedIndex),
};
