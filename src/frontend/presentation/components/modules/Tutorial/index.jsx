import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class Tutorial extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Tutorial');
    }

    render() {
        return <div className="tutorial" />;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(Tutorial);
