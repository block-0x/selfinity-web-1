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
import RenderShow from '@modules/RenderShow';
import TaskHeader from '@elements/TaskHeader';
import { HomeModel, HomeModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';

class HomeShowList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeShowList'
        );
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const {
            loadMore,
            loading,
            repository,
            relate_repositories,
            ...inputProps
        } = this.props;

        return (
            <div className="home-show-list" id="home_show_list">
                {repository && (
                    <RenderShow
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

HomeShowList.defaultProps = {
    loading: false,
    repository: null,
    relate_repositories: [],
};

HomeShowList.propTypes = {
    repository: PropTypes.object,
    relate_repositories: PropTypes.object,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repository: contentActions.getModalShowContent(state),
            relate_repositories: contentActions.getShowRelateContent(state),
        };
    },

    dispatch => ({})
)(HomeShowList);
