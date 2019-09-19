import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ope from '@extension/operator';
import UserHeader from '@modules/UserHeader';
import TaskHeader from '@elements/TaskHeader';
import ContentSectionHeader from '@modules/ContentSectionHeader';

class ConditionalStickyHeader extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
        style: PropTypes.object,
        sticky: PropTypes.bool,
    };

    static defaultProps = {
        repository: null,
        style: {},
        sticky: true,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ConditionalStickyHeader'
        );
    }

    render() {
        const { repository, style, sticky } = this.props;

        if (!repository) return <div />;

        const renderItem = item => {
            switch (true) {
                case ope.isUser(item):
                    return (
                        <UserHeader
                            sticky={sticky}
                            repository={repository}
                            style={style}
                        />
                    );
                case ope.isContent(item):
                    return (
                        <ContentSectionHeader
                            sticky={sticky}
                            repository={repository}
                            style={style}
                        />
                    );
                case ope.isLabel(item):
                default:
                    return (
                        <TaskHeader
                            sticky={sticky}
                            repository={repository}
                            style={style}
                        />
                    );
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
)(ConditionalStickyHeader);
