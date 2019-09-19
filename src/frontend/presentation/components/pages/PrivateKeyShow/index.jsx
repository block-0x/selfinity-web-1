import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as walletActions from '@redux/Wallet/WalletReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import CloseButton from '@elements/CloseButton';
import tt from 'counterpart';
import TextValueItem from '@elements/TextValueItem';
import Responsible from '@modules/Responsible';
import IconButton from '@elements/IconButton';

class PrivateKeyShow extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func,
        privateKey: PropTypes.string,
    };

    static defaultProps = {
        privateKey: '',
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'PrivateKeyShow'
        );
    }

    render() {
        const { privateKey, onCancel, current_user } = this.props;

        return (
            <div className="private-key-show">
                <Responsible
                    defaultContent={
                        <CloseButton
                            onClick={onCancel}
                            className="private-key-show__button"
                        />
                    }
                    breakingContent={
                        <IconButton
                            onClick={onCancel}
                            src="close"
                            size={'2x'}
                        />
                    }
                    breakMd={true}
                    className="private-key-show__button"
                />
                <div className="private-key-show__body">
                    <div className="private-key-show__body-title">
                        {tt('g.eth_wallet_info_title')}
                    </div>
                    <div className="private-key-show__body-text">
                        {tt('g.eth_wallet_info_warning')}
                    </div>
                    <div className="private-key-show__body-values">
                        <div className="private-key-show__body-value">
                            <TextValueItem
                                title={tt('g.address')}
                                value={current_user.eth_address}
                            />
                        </div>
                        <div className="private-key-show__body-value">
                            <TextValueItem
                                title={tt('g.private_key')}
                                value={privateKey}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
            privateKey: state.wallet.get('privateKey'),
        };
    },

    dispatch => ({})
)(PrivateKeyShow);
