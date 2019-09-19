import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import HomeShowItem from '@elements/HomeShowItem';
import ope from '@extension/operator';

class ConditionalShowShowItem extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: null,
    };

    state = {};

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { repository } = this.props;
        const renderShowItem = item => {
            if (!item) return <div />;
            switch (true) {
                case ope.isContent(item):
                    return <HomeShowItem repository={repository} />;
                case ope.isLabel(item):
                    return <LabelHeader repository={repository} />;
                case ope.isRequest(item):
                default:
                    return <div />;
            }
        };

        return (
            <div className="conditional-item">{renderShowItem(repository)}</div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalShowShowItem);
