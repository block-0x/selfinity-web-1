import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import OpinionViewer from '@modules/OpinionViewer';
import RequestViewer from '@modules/RequestViewer';
import ope from '@extension/operator';

class ConditionalViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.array,
        repository: PropTypes.object,
        readOnly: PropTypes.bool,
        isAds: PropTypes.bool,
    };

    static defaultProps = {
        repository: null,
        repositories: null,
        readOnly: false,
        isAds: false,
    };

    render() {
        const { repositories, readOnly, repository, isAds } = this.props;

        const renderItem = items => {
            if (!items) return <div />;
            switch (true) {
                case ope.isContent(items[0]):
                    return (
                        <OpinionViewer
                            repository={repository}
                            repositories={repositories}
                            isAds={isAds}
                        />
                    );
                case ope.isRequest(items[0]):
                    return (
                        <RequestViewer
                            repository={repository}
                            repositories={repositories}
                            isAds={isAds}
                        />
                    );
                default:
                    return <div />;
            }
        };

        return (
            <div className="conditional-viewer">{renderItem(repositories)}</div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalViewer);
