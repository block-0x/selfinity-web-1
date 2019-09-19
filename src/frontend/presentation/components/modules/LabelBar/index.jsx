import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import LabelTag from '@elements/LabelTag';
import LabelWhiteTag from '@elements/LabelWhiteTag';

class LabelBar extends React.Component {
    static propTypes = {
        repositories: PropTypes.array,
        isWhite: PropTypes.bool,
    };

    static defaultProps = {
        repositories: [],
        isWhite: false,
    };

    render() {
        const { repositories, isWhite } = this.props;

        const renderItem = items =>
            items.map(
                (item, key) =>
                    isWhite ? (
                        <div
                            className="label-bar__item"
                            style={{ marginBottom: '12px' }}
                            key={key}
                        >
                            <LabelWhiteTag repository={item} />
                        </div>
                    ) : (
                        <div className="label-bar__item" key={key}>
                            <LabelTag repository={item} />
                        </div>
                    )
            );
        return (
            <div className="label-bar">
                {repositories.length > 0 && renderItem(repositories)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(LabelBar);
