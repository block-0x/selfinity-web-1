import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';

class PopoverMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'PopoverMenuItem'
        );
    }

    render() {
        const {
            children,
            itemKey,
            onClick,
            bold,
            disabled,
            fullScreenHidden,
            src,
            value,
        } = this.props;

        return (
            <div
                className={classNames('popover-menu-item', {
                    'popover-menu-item--bold': bold,
                    'popover-menu-item__full-screen-hidden': fullScreenHidden,
                })}
            >
                <div
                    className="popover-menu-item__link"
                    role="presentation"
                    disabled={disabled}
                >
                    <div
                        className="popover-menu-item__body"
                        onClick={e => {
                            if (e) e.preventDefault();
                            onClick(e);
                        }}
                    >
                        <div className="popover-menu-item__body-image">
                            <Icon src={src} size={'1_5x'} />
                        </div>
                        <div className="popover-menu-item__body-value">
                            {value}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PopoverMenuItem.propTypes = {
    children: PropTypes.node,
    itemKey: PropTypes.string,
    onClick: PropTypes.func,
    bold: PropTypes.bool,
    disabled: PropTypes.bool,
    fullScreenHidden: PropTypes.bool,
    src: PropTypes.string,
    value: PropTypes.string,
};

PopoverMenuItem.defaultProps = {
    children: null,
    itemKey: '',
    onClick: () => {},
    bold: true,
    disabled: false,
    fullScreenHidden: false,
    src: 'chevron-next',
    value: '',
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(PopoverMenuItem);
