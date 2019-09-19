import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'react-router';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import { COLOR } from '@entity/Color';
import classNames from 'classnames';

class SideItem extends Component {
    constructor() {
        super();
    }

    handleRequest = e => {
        if (this.props.onClick) this.props.onClick(e);
    };

    render() {
        // const { state } = this.state;
        const {
            className,
            classes,
            disabled,
            active,
            style,
            value,
            image,
            link,
            ...inputProps
        } = this.props;

        return (
            <Ripple>
                <Link
                    to={link}
                    className={classNames('side-item__link', { active })}
                    onClick={this.handleRequest}
                >
                    <div className="side-item">
                        <Icon
                            src={image}
                            className="side-item__image"
                            size={'2_4x'}
                        />
                        <div className="side-item__value">{value}</div>
                    </div>
                </Link>
            </Ripple>
        );
    }
}

SideItem.defaultProps = {
    className: '',
    disabled: false,
    active: false,
    style: null,
    value: '',
    image: '',
    link: '',
};

SideItem.propTypes = {
    /** Fired when the button is tapped. */
    onRequest: PropTypes.func,
    /** Override or extend the styles applied to the component. */
    classes: PropTypes.string,
    /** Custom top-level class */
    className: PropTypes.string,
    /** Disables text field. */
    disabled: PropTypes.bool,
    /** Selected this cell . */
    active: PropTypes.bool,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    /** The value of the text field. */
    value: PropTypes.string,
    /** The value of the text field. */
    image: PropTypes.string,
    /** The link of the text field. */
    link: PropTypes.string,
    /** The func of the onClick. */
    onClick: PropTypes.func,
};

export default SideItem;
