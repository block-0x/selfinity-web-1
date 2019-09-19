/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import EventIndexList from '@cards/EventIndexList';
import IndexComponentImpl from '@pages/IndexComponent';

class EventIndex extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'EventIndex');
    }

    render() {
        return (
            <IndexComponentImpl>
                <div className="event-index">
                    <EventIndexList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/events',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(EventIndex),
};
