import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

export const balloon_position = ['none', 'top', 'right', 'left', 'bottom'];

class Balloon extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        content: PropTypes.node,
        onClick: PropTypes.func,
        type: PropTypes.oneOf(tooltip_position),
        x: PropTypes.number,
        y: PropTypes.number,
        visible: PropTypes.bool,
    };

    static defaultProps = {
        onClick: () => {},
        type: tooltip_position[0],
        x: 0,
        y: 0,
        visible: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Balloon');
        this.state = {
            visible: props.visible,
            x: props.x,
            y: props.y,
        };
    }

    toggleShow() {
        this.setState({
            visible: !this.state.visible,
        });
    }

    render() {
        const style = {
            left: state.x + 'px',
            top: state.y + 'px',
        };

        let arrow_style = {};
        switch (this.props.type) {
            case tooltip_position[0]:
            case tooltip_position[1]:
                arrow_style.top = 'calc(100% + 3px)';
                arrow_style.left = '50%';
                break;
            case tooltip_position[2]:
                arrow_style.top = '50%';
                arrow_style.left = 'calc(100% + 3px)';
                break;
            case tooltip_position[3]:
                arrow_style.top = '50%';
                arrow_style.left = '-3px';
                break;
            case tooltip_position[4]:
                arrow_style.top = '-3px';
                arrow_style.left = '50%';
                break;
        }

        const body = (
            <div
                className={classNames(
                    'balloon__wrap-body',
                    'zoomIn',
                    'animated',
                    'faster'
                )}
                ref="balloon"
                style={style}
            >
                {this.props.content}
                <div className="balloon__wrap-arrow" style={arrow_style} />
            </div>
        );

        return (
            <div className="balloon">
                {this.props.children}
                <div className="balloon__wrap">{state.visible && body}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(Balloon);
