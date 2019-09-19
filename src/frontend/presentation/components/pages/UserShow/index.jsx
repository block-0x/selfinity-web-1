/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import classnames from 'classnames';
import UserShowList from '@cards/UserShowList';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import IndexComponentImpl from '@pages/IndexComponent';

class UserShow extends React.Component {
    static propTypes = {
        discussions: PropTypes.object,
        accounts: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        categories: PropTypes.object,
    };

    static defaultProps = {
        showSpam: false,
    };

    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserShow');
    }

    componentDidUpdate(prevProps) {}

    render() {
        var { section, id } = this.props.routeParams;

        if (!section) section = 'blog';

        return (
            <IndexComponentImpl>
                <div className="user-show">
                    <UserShowList user_id={id} section={section} />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: 'user/:id(/:section)',
    component: connect(
        (state, ownProps) => {
            return {};
        },
        dispatch => {
            return {};
        }
    )(UserShow),
};
