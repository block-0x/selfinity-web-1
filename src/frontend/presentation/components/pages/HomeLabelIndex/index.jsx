/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import HomeLabelIndexList from '@cards/HomeLabelIndexList';
import IndexComponentImpl from '@pages/IndexComponent';

class HomeLabelIndex extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeLabelIndex'
        );
    }

    render() {
        return (
            <div className="home-label-index">
                <HomeLabelIndexList />
            </div>
        );
    }
}

module.exports = {
    path: '/customize',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(HomeLabelIndex),
};
