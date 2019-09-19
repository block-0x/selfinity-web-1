import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import BorderInputItem from '@elements/BorderInputItem';

class BorderInputRow extends React.Component {
    static propTypes = {
        title: PropTypes.string,
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
            'BorderInputRow'
        );
    }

    render() {
        const { value, onChange, ref, title, placeholder } = this.props;

        return (
            <div className="border-input-row">
                <div className="border-input-row__title">{title}</div>
                <div className="border-input-row__value">
                    <BorderInputItem
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
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
)(BorderInputRow);
