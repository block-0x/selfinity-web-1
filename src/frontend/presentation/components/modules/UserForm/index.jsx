import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import UserInput from '@elements/UserInput';
import UserTagWithClose from '@elements/UserTagWithClose';
import Gallery from '@modules/Gallery';

class UserForm extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(AppPropTypes.User),
    };

    static defaultProps = {
        repositories: [],
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserForm');
    }

    render() {
        const { repositories } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="user-form__item" key={key}>
                    <UserTagWithClose key={key} repository={item} />
                </div>
            ));
        return (
            <div className="user-form">
                <Gallery>
                    {repositories.length > 0 && renderItem(repositories)}
                    <div className="user-form__input">
                        <UserInput />
                    </div>
                </Gallery>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(UserForm);
