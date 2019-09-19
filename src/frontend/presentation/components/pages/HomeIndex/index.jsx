/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import HomeList from '@cards/HomeList';
import IndexComponentImpl from '@pages/IndexComponent';
import LoadingIndicator from '@elements/LoadingIndicator';
import * as appActions from '@redux/App/AppReducer';

class HomeIndex extends React.Component {
    static pushURLState(title) {
        if (window) window.history.pushState({}, title, '/');
    }

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeIndex');
    }

    componentWillMount() {
        const { isHeaderVisible, location, addSuccess } = this.props;

        if (location.query.success_key) {
            addSuccess(tt(location.query.success_key));
            HomeIndex.pushURLState('Selfinity');
        }
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
    path: '',
    component: connect(
        (state, ownProps) => {
            const show_side_bar = state.app.get('show_side_bar');
            return {
                show_side_bar,
            };
        },
        dispatch => {
            return {
                addSuccess: success =>
                    dispatch(
                        appActions.addSuccess({
                            success,
                        })
                    ),
            };
        }
    )(HomeIndex),
};
