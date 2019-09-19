import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';

class DropDownItem extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        children: PropTypes.node,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'DropDownItem'
        );
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const { onClick } = this.props;
        if (e) e.preventDefault();
        if (onClick) onClick(e);
    }

    render() {
        const { children } = this.props;

        const { onClick } = this;

        return (
            <div className="drop-down-item" onClick={onClick}>
                {children}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(DropDownItem);
