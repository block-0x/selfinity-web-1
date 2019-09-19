import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import SimpleButton from '@elements/SimpleButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as labelActions from '@redux/Label/LabelReducer';
import * as appActions from '@redux/App/AppReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import RenderContentShow from '@modules/RenderContentShow';
import LoadingIndicator from '@elements/LoadingIndicator';
import {
    contentShowRoute,
    notfoundRoute,
} from '@infrastructure/RouteInitialize';

class ContentShowList extends Component {
    static redirect = url => {
        window.location.replace(url);
    };

    state = {
        mounted: false,
    };

    constructor(props) {
        super(props);
        this.unwrap = this.unwrap.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ContentShowList'
        );
    }

    componentWillMount() {
        this.setState({ mounted: false });
    }

    componentDidMount() {
        const {
            loadMore,
            loading,
            repository,
            relate_repositories,
            ...inputProps
        } = this.props;
        this.setState({ mounted: true });
        this.timer = setTimeout(() => {
            if (loading && !this.unwrap() && this.state.mounted)
                ContentShowList.redirect(notfoundRoute.path);
        }, 4000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        this.props.hideAcceptAlert();
    }

    unwrap() {
        const { repository } = this.props;
        if (!repository) return true;
        if (Object.keys(repository.content).length == 0) return false;
        if (
            !repository.content.id &&
            !repository.content.title &&
            !repository.content.body
        )
            return false;
        return true;
    }

    render() {
        const {
            loadMore,
            loading,
            repository,
            relate_repositories,
            ...inputProps
        } = this.props;

        return (
            <div className="content-show-list" id="content-show_list">
                {this.unwrap() &&
                    !loading && (
                        <RenderContentShow
                            repository={repository}
                            relate_repositories={relate_repositories}
                        />
                    )}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

ContentShowList.defaultProps = {
    loading: false,
    repository: null,
};

ContentShowList.propTypes = {
    repository: PropTypes.object,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repository: contentActions.getShowContent(state),
            relate_repositories: contentActions.getShowRelateContent(state),
            loading: appActions.contentShowPageLoading(state),
        };
    },

    dispatch => ({
        hideAcceptAlert: () => {
            dispatch(requestActions.hideAcceptAlert());
        },
    })
)(ContentShowList);
