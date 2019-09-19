/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import TrendIndexList from '@cards/TrendIndexList';
import IndexComponentImpl from '@pages/IndexComponent';
import LoadingIndicator from '@elements/LoadingIndicator';

class TrendIndex extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'TrendIndex');
    }

    render() {
        var { id } = this.props.routeParams;

        if (!id) id = 1;

        return (
            <IndexComponentImpl>
                <div className="trend-index">
                    <TrendIndexList id={id} />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/trends(/:id)',
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
    )(TrendIndex),
};
