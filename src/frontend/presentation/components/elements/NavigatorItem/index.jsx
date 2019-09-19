import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import autobind from 'class-autobind';
import Tooltip from '@elements/Tooltip';

class NavigatorItem extends React.Component {
    static propTypes = {
        template: PropTypes.string,
        content: PropTypes.node,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigatorItem'
        );
        autobind(this);
    }

    render() {
        const {
            template,
            content,
            xOffset,
            yOffset,
            ...inputProps
        } = this.props;

        const { onClick } = this;

        return (
            <Ripple>
                <div className="navigator-item">
                    <Tooltip
                        type={'center'}
                        trigger="onClick"
                        onClick={onClick}
                        content={content}
                        xOffset={xOffset}
                        yOffset={yOffset}
                    >
                        <div className="navigator-item__text">?</div>
                    </Tooltip>
                </div>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigatorItem);

// <Icon {...inputProps} src={'question'} size={'1x'} />
