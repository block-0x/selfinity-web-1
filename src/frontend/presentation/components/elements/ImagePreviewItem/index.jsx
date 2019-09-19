import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import classNames from 'classnames';
import Img from 'react-image';
import tt from 'counterpart';

class ImagePreviewItem extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        progress: PropTypes.number,
        pending: PropTypes.bool,
    };

    static defaultProps = {
        src: '',
        progress: 0,
        pending: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ImagePreviewItem'
        );
    }

    render() {
        const { src, progress, pending } = this.props;

        const renderPendingProgress = (
            <div
                className="image-preview-item__progress"
                style={{ width: `${100 - progress}%` }}
            />
        );

        return (
            <div className="image-preview-item">
                <Img
                    className="image-preview-item__image"
                    src={src}
                    alt={tt('alts.default')}
                />
                {pending && renderPendingProgress}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ImagePreviewItem);
