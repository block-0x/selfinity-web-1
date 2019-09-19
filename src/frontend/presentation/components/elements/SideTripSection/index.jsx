import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'react-router';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import { COLOR } from '@entity/Color';
import classNames from 'classnames';

class SideTripSection extends Component {
    constructor() {
        super();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({ ...this.state, value: nextProps.value });
        }
    }

    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    };

    render() {
        const {
            className,
            classes,
            disabled,
            isFold,
            style,
            value,
            image,
            link,
            ...inputProps
        } = this.props;

        return (
            <Link
                to={link}
                className="side-trip-section__link"
                onClick={this.handleClick}
            >
                <div
                    className={classNames('side-trip-section', {
                        isFold: isFold,
                    })}
                >
                    <div className="side-trip-section__value">{value}</div>
                    <Icon
                        src={image}
                        className={'side-trip-section__image'}
                        size={'2x'}
                    />
                </div>
            </Link>
        );
    }
}

SideTripSection.defaultProps = {
    className: '',
    disabled: false,
    isFold: false,
    style: null,
    value: '',
    image: 'chevron-next',
    link: '',
};

SideTripSection.propTypes = {
    /** Fired when the button is tapped. */
    onClick: PropTypes.func,
    /** Override or extend the styles applied to the component. */
    classes: PropTypes.string,
    /** Custom top-level class */
    className: PropTypes.string,
    /** Disables text field. */
    disabled: PropTypes.bool,
    /** Selected this cell . */
    isFold: PropTypes.bool,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    /** The value of the text field. */
    value: PropTypes.string,
    /** The value of the text field. */
    image: PropTypes.string,
    /** The link of the text field. */
    link: PropTypes.string,
};

export default SideTripSection;
