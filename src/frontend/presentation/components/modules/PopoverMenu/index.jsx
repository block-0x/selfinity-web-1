import React from 'react';
import PropTypes from 'prop-types';
import PopoverMenuItem from '@elements/PopoverMenuItem';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class PopoverMenu extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'PopoverMenu');
    }

    render() {
        const { children, onSelect, bold } = this.props;

        return (
            <div className="popover-menu">
                {React.Children.map(children, child => {
                    const {
                        children: itemChildren,
                        ...otherProps
                    } = child.props;
                    return (
                        <PopoverMenuItem
                            key={child.key}
                            {...otherProps}
                            itemKey={child.key}
                            bold={bold}
                            onClick={child.props.onClick}
                        >
                            {child.props.children}
                        </PopoverMenuItem>
                    );
                })}
            </div>
        );
    }
}

PopoverMenu.propTypes = {
    children: PropTypes.node,
    onSelect: PropTypes.func,
    bold: PropTypes.bool,
};

PopoverMenu.defaultProps = {
    children: null,
    onSelect: () => {},
    bold: true,
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(PopoverMenu);
