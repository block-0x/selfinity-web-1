import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class ReplyAxis extends React.Component {
    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ReplyAxis');
    }

    render() {
        return (
            <div className="reply-axis">
                <div className="reply-axis__border" />
            </div>
        );
    }
}

ReplyAxis.propTypes = {
    // show: PropTypes.bool.isRequired,
    // onHide: PropTypes.func.isRequired,
};

export default ReplyAxis;
