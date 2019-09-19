import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as labelActions from '@redux/Label/LabelReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SimpleButton from '@elements/SimpleButton';
import models from '@network/client_models';
import tt from 'counterpart';

class LabelStockButton extends React.Component {
    static propTypes = {
        current_user: AppPropTypes.User,
        repository: AppPropTypes.Label,
        isStocked: PropTypes.bool,
    };

    static defaultProps = {
        current_user: null,
        repository: models.Label.build(),
        isStocked: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'LabelStockButton'
        );
    }

    componentWillMount() {
        this.setState({
            isStocked: this.props.isStocked,
        });
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         isStocked: nextProps.isStocked,
    //     });
    // }

    onClick(e) {
        const {
            stock,
            unstock,
            current_user,
            repository,
            showLogin,
        } = this.props;

        const { isStocked } = this.state;

        if (!current_user) {
            showLogin();
            return;
        }

        if (isStocked) {
            unstock(current_user, repository);
        } else {
            stock(current_user, repository);
        }

        this.setState({
            isStocked: !isStocked,
        });
    }

    render() {
        const { current_user, repository } = this.props;
        const { isStocked } = this.state;
        const { onClick } = this;

        return (
            <SimpleButton
                active={isStocked}
                value={isStocked ? tt('g.unsubscribe') : tt('g.subscribe')}
                onClick={e => onClick(e)}
            />
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        const isStocked = labelActions.isStocked(state, props.repository);
        return {
            current_user,
            isStocked,
        };
    },

    dispatch => ({
        stock: (user, label) => {
            dispatch(labelActions.stock({ user, label }));
        },
        unstock: (user, label) => {
            dispatch(labelActions.unstock({ user, label }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
    })
)(LabelStockButton);
