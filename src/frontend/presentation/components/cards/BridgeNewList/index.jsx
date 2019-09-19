import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as walletActions from '@redux/Wallet/WalletReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import BorderInputRow from '@modules/BorderInputRow';
import BRIDGE_MENU from '@entity/BridgeMenuEntity';
import GradationButton from '@elements/GradationButton';
import DropDownContainer from '@cards/DropDownContainer';
import DropDownMenu from '@modules/DropDownMenu';
import DropDownItem from '@elements/DropDownItem';
import BridgeForm from '@modules/BridgeForm';

class BridgeNewList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'BridgeNewList'
        );
    }

    render() {
        return (
            <div className="bridge-new-list">
                <BridgeForm />
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        bridgeToken: (amount, toAddress) => {
            dispatch(walletActions.bridgeToken({ amount, toAddress }));
        },
    })
)(BridgeNewList);
