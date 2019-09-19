/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import LabelShowList from '@cards/LabelShowList';
import IndexComponentImpl from '@pages/IndexComponent';

class LabelShow extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'LabelShow');
    }

    componentDidUpdate(prevProps) {}

    render() {
        return (
            <IndexComponentImpl>
                <div className="label-show">
                    <LabelShowList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/label/:id',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(LabelShow),
};
