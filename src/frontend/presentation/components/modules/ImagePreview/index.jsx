import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ImagePreviewItem from '@elements/ImagePreviewItem';
import AppPropTypes from '@extension/AppPropTypes';

class ImagePreview extends React.Component {
    static propTypes = {
        children: AppPropTypes.Children,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ImagePreview'
        );
    }

    render() {
        const { children } = this.props;

        const renderItem = vals =>
            React.Children.map(vals, (child, key) => {
                const { children: itemChildren, ...otherProps } = child.props;

                return (
                    <div className="image-preview__item" key={key}>
                        <ImagePreviewItem key={key} {...otherProps} />
                    </div>
                );
            });

        return (
            <div className="image-preview">
                {children && renderItem(children)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ImagePreview);
