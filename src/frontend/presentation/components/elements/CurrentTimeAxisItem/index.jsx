import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import tt from 'counterpart';

class CurrentTimeAxisItem extends React.Component {
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
            <a className="currenttimeaxis-item__link">
                <div className="currenttimeaxis-item">
                    <div className="currenttimeaxis-item__title">{value}</div>
                    <div className="currenttimeaxis-item__border" />
                </div>
            </a>
        );
    }
}

CurrentTimeAxisItem.defaultProps = {
    className: '',
    placeholder: '',
    style: null,
    value: '',
};

CurrentTimeAxisItem.propTypes = {
    /** Override or extend the styles applied to the component. */
    classes: PropTypes.string,
    /** Custom top-level class */
    className: PropTypes.string,
    /** Override the close icon. */
    placeholder: PropTypes.string,
    /** Override the inline-styles of the root element. */
    style: PropTypes.object,
    /** The value of the text field. */
    value: PropTypes.string,
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(CurrentTimeAxisItem);
