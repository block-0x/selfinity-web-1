import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import UsersRecommendList from '@cards/UsersRecommendList';
import IndexComponentImpl from '@pages/IndexComponent';
import LoadingIndicator from '@elements/LoadingIndicator';

class UsersRecommend extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UsersRecommend'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        return (
            <IndexComponentImpl>
                <div className="users-recommend">
                    <UsersRecommendList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/users/recommend',
    component: connect(
        (state, ownProps) => {
            const show_side_bar = state.app.get('show_side_bar');
            return {
                show_side_bar,
            };
        },
        dispatch => {
            return {};
        }
    )(UsersRecommend),
};
