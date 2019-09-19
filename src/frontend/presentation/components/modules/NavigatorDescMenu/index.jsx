import React from 'react';
import PropTypes from 'prop-types';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class NavigatorDescMenu extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigatorDescMenu'
        );
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
                        <NavigatorDescItem
                            key={child.key}
                            {...otherProps}
                            itemKey={child.key}
                            onClick={child.props.onClick}
                        >
                            {child.props.children}
                        </NavigatorDescItem>
                    );
                })}
            </div>
        );
    }
}

NavigatorDescMenu.propTypes = {
    children: PropTypes.node,
    onSelect: PropTypes.func,
    bold: PropTypes.bool,
};

NavigatorDescMenu.defaultProps = {
    children: null,
    onSelect: () => {},
    bold: true,
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigatorDescMenu);
