import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Tooltip from '@elements/Tooltip';

class PopoverContainer extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'PopoverContainer'
        );
    }

    render() {
        const {
            content,
            onVisibleChange,
            children,
            xOffset,
            yOffset,
            type,
        } = this.props;

        return (
            <div className="popover-container">
                <Tooltip
                    type={type}
                    trigger="onClick"
                    content={this.props.content}
                    xOffset={xOffset}
                    yOffset={yOffset}
                    onClick={() => this.props.onVisibleChange(false)}
                >
                    {children}
                </Tooltip>
            </div>
        );
    }
}

PopoverContainer.propTypes = {
    onVisibleChange: PropTypes.func,
    content: PropTypes.node,
    children: PropTypes.node,
    overlayStyle: PropTypes.object,
    visible: PropTypes.bool,
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
    type: PropTypes.string,
};

PopoverContainer.defaultProps = {
    content: null,
    onVisibleChange: () => {},
    overlayStyle: {},
    visible: false,
    xOffset: 0,
    yOffset: 0,
    type: 'bottom',
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(PopoverContainer);
