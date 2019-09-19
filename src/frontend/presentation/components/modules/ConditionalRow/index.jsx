import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import HomeRow from '@elements/HomeRow';
import RequestRow from '@elements/RequestRow';
import ope from '@extension/operator';

class ConditionalRow extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: null,
    };

    render() {
        const { repository } = this.props;
        const renderItem = item => {
            if (!item) return <div />;
            switch (true) {
                case ope.isContent(item):
                    return <HomeRow repository={repository} />;
                case ope.isRequest(item):
                    return <RequestRow repository={repository} />;
                default:
                    return <div />;
            }
        };

        return <div className="conditional-row">{renderItem(repository)}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalRow);
