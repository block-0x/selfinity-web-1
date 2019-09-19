import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '@elements/Icon';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Ripple from '@elements/Ripple';
import { browserHistory } from 'react-router';

class TextValueItem extends React.Component {
    static propTypes = {
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    static defaultProps = {
        title: '',
        value: '',
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TextValueItem'
        );
    }

    render() {
        const { title, value } = this.props;

        return (
            <div className="text-value-item__link">
                <div className="text-value-item">
                    <div className="text-value-item__title">{title}</div>
                    <div className="text-value-item__value">{value}</div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TextValueItem);
