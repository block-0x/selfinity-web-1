/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ContentShowList from '@cards/ContentShowList';
import IndexComponentImpl from '@pages/IndexComponent';

class ContentShow extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ContentShow');
    }

    render() {
        return (
            <IndexComponentImpl>
                <div className="content-show">
                    <ContentShowList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/content/:id',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(ContentShow),
};
