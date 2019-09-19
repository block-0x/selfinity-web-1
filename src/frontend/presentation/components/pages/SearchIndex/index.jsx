/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SearchIndexList from '@cards/SearchIndexList';
import IndexComponentImpl from '@pages/IndexComponent';

class SeachIndex extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'SeachIndex');
    }

    render() {
        const { section, id } = this.props.routeParams;
        return (
            <IndexComponentImpl>
                <div className="search-index">
                    <SearchIndexList section={section} />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/search(/:section)',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(SeachIndex),
};
