import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import IndexComponentImpl from '@pages/IndexComponent';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import config from '@constants/config';
import TermItem from '@elements/TermItem';

class Term extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Term');
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <IndexComponentImpl>
                <div className="term">
                    <TermItem />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/term',
    component: connect(
        (state, props) => {
            return {};
        },
        dispatch => ({})
    )(Term),
};
