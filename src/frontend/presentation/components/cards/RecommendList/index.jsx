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
import RenderIndex from '@modules/RenderIndex';
import TaskHeader from '@elements/TaskHeader';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import * as contentActions from '@redux/Content/ContentReducer';

class RecommendList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RecommendList'
        );
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const { loadMore, loading, repositories, ...inputProps } = this.props;

        return (
            <div className="recommend-list" id="recommend_list">
                {repositories && <RenderIndex repositories={repositories} />}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

RecommendList.defaultProps = {
    loading: false,
};

RecommendList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repositories: contentActions.getRecommendContent(state),
        };
    },

    dispatch => ({})
)(RecommendList);
