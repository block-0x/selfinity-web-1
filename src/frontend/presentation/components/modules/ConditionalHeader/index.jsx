import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import LabelHeader from '@modules/LabelHeader';
import HighLight from '@modules/HighLight';
import ContentHeader from '@modules/ContentHeader';
import RequestShowHeader from '@modules/RequestShowHeader';
import ope from '@extension/operator';
import UserHeader from '@modules/UserHeader';

class ConditionalItem extends React.Component {
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
        const renderItem = item => {
            switch (true) {
                case ope.isContent(item):
                    return <ContentHeader repository={repository} />;
                case ope.isRequest(item):
                    return <RequestShowHeader repository={repository} />;
                case ope.isLabel(item):
                    return <LabelHeader repository={repository} />;
                case ope.isUser(item):
                    return <UserHeader repository={repository} />;
                case ope.isRequest(item):
                default:
                    return <div />;
            }
        };
        return renderItem(repository);
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalItem);
