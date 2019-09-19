import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as userActions from '@redux/User/UserReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import UserTag from '@elements/UserTag';
import Icon from '@elements/Icon';
import models from '@network/client_models';
import UserInput from '@elements/UserInput';

class UserTagWithClose extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
    };

    static defaultProps = {
        repository: models.User.build(),
    };

    state = {
        removed: false,
        edit: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UserTagWithClose'
        );
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
    }

    onClickClose(e) {
        const { remove, repository } = this.props;
        const { removed } = this.state;

        // if (e) e.preventDefault();
        if (remove && repository) remove(repository);

        this.setState({
            removed: !removed,
        });
    }

    onClickItem(e) {
        const { remove, repository } = this.props;

        const { edit } = this.state;

        // if (e) e.stopPropagation();

        //TODO: cant fix gallery layout in the time of editing. and should delete user input of empty.
        // this.setState({
        //     edit: !edit,
        // });
    }

    render() {
        const { repository } = this.props;

        const { onClickClose, onClickItem } = this;

        const { removed, edit } = this.state;

        if (removed) return <div />;

        return edit ? (
            <div className="user-tag-with-close__edit">
                <UserInput repository={repository} />
            </div>
        ) : (
            <div className="user-tag-with-close">
                <div
                    className="user-tag-with-close__item"
                    onClick={onClickItem}
                >
                    <UserTag
                        repository={repository}
                        disable={true}
                        onClick={onClickItem}
                    />
                </div>
                <div
                    className="user-tag-with-close__icon"
                    onClick={onClickClose}
                >
                    <Icon src={'circle-close'} size={'2x'} />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({
        remove: user => {
            dispatch(contentActions.removeContentAssign({ user }));
        },
    })
)(UserTagWithClose);
