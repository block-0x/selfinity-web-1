import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import HomeItem from '@elements/HomeItem';
import LabelItem from '@elements/LabelItem';
import RequestItem from '@elements/RequestItem';
import UserItem from '@elements/UserItem';
import ope from '@extension/operator';

class ConditionalItem extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
        align: PropTypes.bool,
    };

    static defaultProps = {
        repository: null,
        align: false,
    };

    render() {
        const { repository, align } = this.props;

        const renderItem = item => {
            if (!item) return <div />;
            switch (true) {
                case ope.isContent(item):
                    return <HomeItem repository={repository} align={align} />;
                case ope.isLabel(item):
                    return <LabelItem repository={repository} />;
                case ope.isRequest(item):
                    return <RequestItem repository={repository} />;
                case ope.isUser(item):
                    return <UserItem repository={repository} />;
                default:
                    return <div />;
            }
        };

        return <div className="conditional-item">{renderItem(repository)}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalItem);
