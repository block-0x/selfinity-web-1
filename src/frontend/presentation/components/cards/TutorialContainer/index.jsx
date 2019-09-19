import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Tooltip from '@elements/Tooltip';
import Balloon from '@elements/Balloon';

class TutorialContainer extends React.Component {
    static propTypes = {
        onVisibleChange: PropTypes.func,
        content: PropTypes.node,
        children: PropTypes.node,
        overlayStyle: PropTypes.object,
        visible: PropTypes.bool,
        xOffset: PropTypes.number,
        yOffset: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        absolute: PropTypes.bool,
    };

    static defaultProps = {
        content: null,
        onVisibleChange: () => {},
        overlayStyle: {},
        visible: false,
        xOffset: 0,
        yOffset: 0,
        x: 0,
        y: 0,
        absolute: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TutorialContainer'
        );
    }

    render() {
        const {
            content,
            onVisibleChange,
            children,
            xOffset,
            yOffset,
            x,
            y,
            absolute,
        } = this.props;

        return absolute ? (
            <div className="tutorial-container">
                <Balloon
                    type="bottom"
                    trigger="onMouseOver"
                    content={content}
                    xOffset={xOffset}
                    yOffset={yOffset}
                    onClick={() => this.props.onVisibleChange(false)}
                >
                    {children}
                </Balloon>
            </div>
        ) : (
            <div className="tutorial-container">
                <Tooltip
                    type="bottom"
                    trigger="onMouseOver"
                    content={content}
                    x={x}
                    y={y}
                    onClick={() => this.props.onVisibleChange(false)}
                >
                    {children}
                </Tooltip>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TutorialContainer);
