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
import * as labelActions from '@redux/Label/LabelReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as appActions from '@redux/App/AppReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import RenderDetail from '@modules/RenderDetail';
import LoadingIndicator from '@elements/LoadingIndicator';

class LabelShowList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { repository } = this.props;
        const n = nextProps;
        return (
            repository !== n.repository // ||
        );
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const { loadMore, loading, repository, ...inputProps } = this.props;

        return (
            <div className="label-show-list" id="label-show_list">
                {repository && (
                    <RenderDetail
                        repository={repository}
                        loadMore={loadMore}
                        loading={loading}
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

LabelShowList.defaultProps = {
    loading: false,
    repository: null,
};

LabelShowList.propTypes = {
    repository: PropTypes.object,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repository: labelActions.getDetail(state),
            loading: appActions.labelShowPageLoading(state),
        };
    },

    dispatch => ({
        loadMore: () => {
            dispatch(labelActions.getMoreDetail());
        },
    })
)(LabelShowList);
