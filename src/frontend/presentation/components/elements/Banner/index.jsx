import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class Banner extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Banner');
    }

    render() {
        return <div className="banner" />;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(Banner);
