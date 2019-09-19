/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import PickupModalList from '@cards/PickupModalList';
import IndexComponentImpl from '@pages/IndexComponent';
import LoadingIndicator from '@elements/LoadingIndicator';
import HomeList from '@cards/HomeList';

class PickupModalAlias extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'PickupModalAlias'
        );
    }

    render() {
        return (
            <IndexComponentImpl>
                <div className="home-index">
                    <HomeList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/pickup/contents',
    component: connect(
        (state, ownProps) => {
            const show_side_bar = state.app.get('show_side_bar');
            return {
                show_side_bar,
            };
        },
        dispatch => {
            return {};
        }
    )(PickupModalAlias),
};
