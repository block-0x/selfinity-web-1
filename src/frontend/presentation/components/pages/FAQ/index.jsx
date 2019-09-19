import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import IndexComponentImpl from '@pages/IndexComponent';

class FAQ extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'FAQ');
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <IndexComponentImpl>
                <div className="faq" />
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/FAQ',
    component: connect(
        (state, props) => {
            return {};
        },
        dispatch => ({})
    )(FAQ),
};
