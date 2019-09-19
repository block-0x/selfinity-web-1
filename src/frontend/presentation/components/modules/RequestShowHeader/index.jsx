import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { Map } from 'immutable';
import tt from 'counterpart';
import { HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';

import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RequestItem from '@elements/RequestItem';
import RequestRow from '@elements/RequestRow';

class RequestShowHeader extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
    };

    static defaultProps = {
        repository: models.Request.build(),
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestShowHeader'
        );
    }

    render() {
        const { repository } = this.props;
        return <RequestRow allowAnswer={true} repository={repository} />;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(RequestShowHeader);
