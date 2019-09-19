/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import RequestShowList from '@cards/RequestShowList';
import IndexComponentImpl from '@pages/IndexComponent';
import * as requestActions from '@redux/Request/RequestReducer';
import * as appActions from '@redux/App/AppReducer';
import {
    contentShowRoute,
    notfoundRoute,
} from '@infrastructure/RouteInitialize';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';

class RequestShow extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
    };

    static defaultProps = {
        repository: models.Request.build(),
    };

    static redirect = url => {
        window.location.replace(url);
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'RequestShow');
    }

    componentWillReceiveProps(nextProps) {
        const { repository } = nextProps;
        if (!repository) return;
        if (repository.hasAnswer) {
            RequestShow.redirect(
                contentShowRoute.getPath({
                    params: {
                        id: repository.getAnswerId,
                    },
                })
            );
        }
    }

    render() {
        return (
            <IndexComponentImpl>
                <div className="request-show">
                    <RequestShowList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/request/:id',
    component: connect(
        (state, ownProps) => {
            return {
                repository: requestActions.getDetail(state),
            };
        },
        dispatch => {
            return {};
        }
    )(RequestShow),
};
