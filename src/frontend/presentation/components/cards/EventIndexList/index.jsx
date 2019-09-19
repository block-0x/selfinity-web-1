import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RenderImpl from '@modules/Render';
import { EventModel, EventModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import LoadingIndicator from '@elements/LoadingIndicator';

class EventIndexList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'EventIndexList'
        );
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const { loadMore, loading, repository, ...inputProps } = this.props;

        return (
            <div className="event-index-list" id="event_index_list">
                {repository &&
                    repository.items.map((item, key) => (
                        <RenderImpl
                            repository={item}
                            key={key}
                            keyIndex={key}
                            count={key}
                        />
                    ))}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

EventIndexList.defaultProps = {
    loading: false,
};

EventIndexList.propTypes = {
    repository: PropTypes.object,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repository: contentActions.getEventContent(state),
        };
    },

    dispatch => ({})
)(EventIndexList);
