import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class BorderInputItem extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        ref: PropTypes.string,
        placeholder: PropTypes.string,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'BorderInputItem'
        );
    }

    render() {
        const { value, onChange, ref, placeholder } = this.props;

        return (
            <div className="border-input-item">
                <input
                    className="border-input-item__input"
                    type={'text'}
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
)(BorderInputItem);
