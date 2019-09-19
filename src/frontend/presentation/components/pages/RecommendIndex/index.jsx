/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RecommendList from '@cards/RecommendList';
import IndexComponentImpl from '@pages/IndexComponent';

class RecommendIndex extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RecommendIndex'
        );
    }

    componentDidUpdate(prevProps) {}

    render() {
        return (
            <IndexComponentImpl>
                <div className="recommend-index">
                    <RecommendList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/recommend',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(RecommendIndex),
};
