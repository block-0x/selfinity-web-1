import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import HomeItem from '@elements/HomeItem';
import SimpleButton from '@elements/SimpleButton';
import debounce from 'lodash.debounce';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as requestActions from '@redux/Request/RequestReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as appActions from '@redux/App/AppReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import RenderDetail from '@modules/RenderDetail';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';
import {
    contentShowRoute,
    notfoundRoute,
} from '@infrastructure/RouteInitialize';
import LoadingIndicator from '@elements/LoadingIndicator';

class RequestShowList extends Component {
    static redirect = url => {
        window.location.replace(url);
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestShowList'
        );
        this.unwrap = this.unwrap.bind(this);
    }

    unwrap() {
        const { repository } = this.props;
        if (!repository) return true;
        if (
            repository.title == RequestShowList.defaultProps.repository.title &&
            repository.body == RequestShowList.defaultProps.repository.body &&
            repository.VoterId ==
                RequestShowList.defaultProps.repository.VoterId &&
            repository.id == RequestShowList.defaultProps.repository.id
        )
            return false;
        return true;
    }

    render() {
        const { loadMore, loading, repository, ...inputProps } = this.props;

        if (repository) {
            if (repository.hasAnswer) return <div />;
        }

        if (!this.props.loading && !this.unwrap() && process.env.BROWSER) {
            RequestShowList.redirect(notfoundRoute.path);
        }

        return (
            <div className="request-show-list" id="request-show_list">
                {this.unwrap() && <RenderDetail repository={repository} />}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

RequestShowList.defaultProps = {
    loading: false,
    repository: models.Request.build(),
};

RequestShowList.propTypes = {
    repository: AppPropTypes.Request,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repository: requestActions.getDetail(state),
            loading: appActions.requestShowPageLoading(state),
        };
    },

    dispatch => ({})
)(RequestShowList);
