import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import RenderImpl from '@modules/Render';
import models from '@network/client_models';
import ConditionalShowItem from '@modules/ConditionalShowItem';
import ReplyAxis from '@elements/ReplyAxis';

class RenderShow extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
        relate_repositories: PropTypes.object,
    };

    static defaultProps = {
        repository: models.Content.build(),
        relate_repositories: PropTypes.object,
    };

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    renderRelate() {
        const { relate_repositories } = this.props;

        return (
            <div key={0}>
                {relate_repositories && (
                    <div className="render-show__relates">
                        <RenderImpl
                            key={0}
                            repository={relate_repositories}
                            keyIndex={0}
                        />
                    </div>
                )}
            </div>
        );
    }

    render() {
        const { repository, relate_repositories } = this.props;

        const contentRow = (content, key) => {
            return (
                <div className="render-show__content" key={key}>
                    <ConditionalShowItem repository={content} />
                </div>
            );
        };

        const concatReplyFirst = (item, key) => {
            if (!item) return <div />;
            return (
                <div>
                    <div className="render-show__reply">
                        <ReplyAxis />
                    </div>
                    <div className="render-show__item" key={key}>
                        <ConditionalShowItem repository={item} />
                    </div>
                    {item.children_contents &&
                        concatReplyFirst(item.children_contents[0])}
                </div>
            );
        };

        const childrenRow = (children, index) =>
            children.map((item, key) => (
                <div className="render-show__item" key={key}>
                    {concatReplyFirst(item, key)}
                    <div className="render-show__border" />
                </div>
            ));

        const headerRow = (content, key) => {};

        const renderItem = item =>
            item.section._enums.map((row, index) => {
                switch (row.value) {
                    case 'content':
                        return content ? (
                            contentRow(repository.content, index)
                        ) : (
                            <div />
                        );
                        break;
                    case 'children':
                        return childrenRow(repository.children, index);
                        break;
                    case 'header':
                        return headerRow(repository.storyContent, index);
                        break;
                    default:
                        return <div key={index} />;
                        break;
                }
            });

        return (
            <div className="render-show">
                <div className="render-show__left">
                    {repository && renderItem(repository)}
                </div>
                <div className="render-show__right">{this.renderRelate()}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(RenderShow);
