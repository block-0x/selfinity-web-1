/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import HomeList from '@cards/HomeList';
import IndexComponentImpl from '@pages/IndexComponent';
import LoadingIndicator from '@elements/LoadingIndicator';

class SendDeletePasswordConfirmationMailAlias extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'SendDeletePasswordConfirmationMailAlias'
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
    path: '/session/send/confirmation/password/delete',
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
    )(SendDeletePasswordConfirmationMailAlias),
};
