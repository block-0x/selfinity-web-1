import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as appActions from '@redux/App/AppReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class TextValueInput extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        ref: PropTypes.string,
        type: PropTypes.string,
    };

    static defaultProps = {
        type: 'text',
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TextValueInput'
        );
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const { onChange } = this.props;

        if (!!e && !!onChange) {
            onChange(e.target.value);
        }
    }

    render() {
        const { onChange } = this;

        const { title, value, ref, type, placeholder } = this.props;

        return (
            <div className="text-value-input">
                <div className="text-value-input__title">{title}</div>
                <input
                    className="text-value-input__value"
                    type={type}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TextValueInput);
