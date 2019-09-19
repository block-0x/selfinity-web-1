import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import tt from 'counterpart';

class TimeAxisItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const { value } = this.state;
        const {
            className,
            classes,
            closeIcon,
            placeholder,
            style,
            value,
            ...inputProps
        } = this.props;

        return (
            <a className="timeaxis-item__link">
                <div className="timeaxis-item">
                    <div className="timeaxis-item__title">
                        {String(this.props.value) + ':00'}
                    </div>
                    <div className="timeaxis-item__border" />
                </div>
            </a>
        );
    }
}

TimeAxisItem.defaultProps = {
    className: '',
    placeholder: '',
    style: null,
    value: '',
};

TimeAxisItem.propTypes = {
    /** Override or extend the styles applied to the component. */
    classes: PropTypes.string,
    /** Custom top-level class */
    className: PropTypes.string,
    /** Override the close icon. */
    placeholder: PropTypes.string,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    /** The value of the text field. */
    value: PropTypes.number,
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TimeAxisItem);
