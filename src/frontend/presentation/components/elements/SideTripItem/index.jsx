import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'react-router';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import { COLOR } from '@entity/Color';
import PictureItem from '@elements/PictureItem';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class SideTripItem extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'SideTripItem'
        );
        this.handleRequest = this.handleRequest.bind(this);
    }

    handleRequest = () => {
        if (this.props.onRequest) {
            this.props.onRequest(this.state.value);
        }
    };

    render() {
        const {
            className,
            classes,
            disabled,
            selected,
            style,
            value,
            image,
            link,
            ...inputProps
        } = this.props;

        return (
            <Link
                to={link}
                className="side-trip-item__link"
                onClick={this.handleRequest}
            >
                <div className="side-trip-item">
                    <div className="side-trip-item__image">
                        {image && (
                            <PictureItem
                                url={image}
                                width={18}
                                radius={9}
                                alt={value}
                            />
                        )}
                    </div>
                    <div className="side-trip-item__value">{value}</div>
                </div>
            </Link>
        );
    }
}

SideTripItem.defaultProps = {
    className: '',
    disabled: false,
    selected: false,
    style: null,
    value: '',
    link: '',
};

SideTripItem.propTypes = {
    /** Fired when the button is tapped. */
    onRequest: PropTypes.func,
    /** Override or extend the styles applied to the component. */
    classes: PropTypes.string,
    /** Custom top-level class */
    className: PropTypes.string,
    /** Disables text field. */
    disabled: PropTypes.bool,
    /** Selected this cell . */
    selected: PropTypes.bool,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    /** The value of the text field. */
    value: PropTypes.string,
    /** The link of the text field. */
    link: PropTypes.string,
    /** The url of the image. */
    image: PropTypes.string,
};

export default SideTripItem;
