import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as walletActions from '@redux/Wallet/WalletReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import BorderInputRow from '@modules/BorderInputRow';
import BRIDGE_MENU from '@entity/BridgeMenuEntity';
import GradationButton from '@elements/GradationButton';
import DropDownContainer from '@cards/DropDownContainer';
import DropDownMenu from '@modules/DropDownMenu';
import DropDownItem from '@elements/DropDownItem';
import * as authActions from '@redux/Auth/AuthReducer';
import tt from 'counterpart';
import Ripple from '@elements/Ripple';

class BridgeForm extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'BridgeForm');
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeToAddress = this.onChangeToAddress.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onClickToAddress = this.onClickToAddress.bind(this);
        this.onClickAmount = this.onClickAmount.bind(this);
    }

    componentWillMount() {
        const { current_user } = this.props;
        this.setState({
            amount: null,
            toAddress: current_user.eth_address,
        });
    }

    handleSubmit(e) {
        if (e) e.preventDefault();
        const { toAddress, amount } = this.state;

        const { bridgeToken } = this.props;

        if (!!amount && !!toAddress) bridgeToken(amount, toAddress);
    }

    onChangeToAddress(e) {
        if (e) e.preventDefault();
        this.setState({
            toAddress: e.target.value,
        });
    }

    onChangeAmount(e) {
        if (e) e.preventDefault();
        this.setState({
            amount: e.target.value,
        });
    }

    onClickToAddress(e) {
        const { current_user } = this.props;
        if (!e.target.innerText) return;
        this.setState({
            toAddress: e.target.innerText.replace(
                current_user.nickname + ':',
                ''
            ),
        });
    }

    onClickAmount(e) {
        if (!e.target.innerText) return;
        this.setState({
            amount: e.target.innerText.replace(tt('g.max') + ':', ''),
        });
    }

    render() {
        const { toAddress, amount } = this.state;

        const { current_user } = this.props;

        const {
            onChangeToAddress,
            onChangeAmount,
            handleSubmit,
            onClickToAddress,
            onClickAmount,
        } = this;

        const addressMenu = {
            [current_user.nickname]: current_user.eth_address,
        };

        const amountMenu = {
            [tt('g.max')]: current_user.token_balance,
        };

        const addressDropDownItem = Object.keys(addressMenu).map(
            (key, index) => (
                <DropDownItem key={index} onClick={onClickToAddress} query={''}>
                    <Ripple>
                        <div className="bridge-form__item__drop-down">
                            <div className="bridge-form__drop-down-item">
                                {`${key}:${addressMenu[key]}`}
                            </div>
                        </div>
                    </Ripple>
                </DropDownItem>
            )
        );

        const amountDropDownItem = Object.keys(amountMenu).map((key, index) => (
            <DropDownItem key={index} onClick={onClickAmount} query={''}>
                <Ripple>
                    <div className="bridge-form__item__drop-down">
                        <div className="bridge-form__drop-down-item">
                            {`${key}:${amountMenu[key]}`}
                        </div>
                    </div>
                </Ripple>
            </DropDownItem>
        ));

        const renderForm = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case BRIDGE_MENU.Form.rows.Address.value:
                        return (
                            <div className="bridge-form__item" key={index}>
                                <DropDownContainer
                                    content={
                                        <div
                                            className="bridge-form__item"
                                            key={index}
                                        >
                                            <BorderInputRow
                                                value={toAddress}
                                                onChange={onChangeToAddress}
                                                title={item.title()}
                                                ref={item.ref}
                                                placeholder={item.placeholder()}
                                            />
                                        </div>
                                    }
                                >
                                    <DropDownMenu query={toAddress}>
                                        {addressDropDownItem}
                                    </DropDownMenu>
                                </DropDownContainer>
                            </div>
                        );
                    case BRIDGE_MENU.Form.rows.Amount.value:
                        return (
                            <div className="bridge-form__item" key={index}>
                                <DropDownContainer
                                    content={
                                        <div
                                            className="bridge-form__item"
                                            key={index}
                                        >
                                            <BorderInputRow
                                                value={amount}
                                                onChange={onChangeAmount}
                                                title={item.title()}
                                                ref={item.ref}
                                                placeholder={item.placeholder()}
                                            />
                                        </div>
                                    }
                                >
                                    <DropDownMenu query={amount}>
                                        {amountDropDownItem}
                                    </DropDownMenu>
                                </DropDownContainer>
                            </div>
                        );
                    case BRIDGE_MENU.Form.rows.Button.value:
                        return (
                            <div className="bridge-form__button" key={index}>
                                <GradationButton
                                    submit={true}
                                    value={item.title()}
                                    color={'blue'}
                                />
                            </div>
                        );
                    case BRIDGE_MENU.Form.rows.Fee.value:
                        return (
                            <div className="bridge-form__fee" key={index}>
                                <div className="bridge-form__fee-title">
                                    {item.title()}
                                </div>
                                <div className="bridge-form__fee-value">
                                    {item.price}
                                </div>
                            </div>
                        );
                    default:
                        return <div key={index} />;
                }
            });

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    /*case BRIDGE_MENU.Border.value:
                        return <div className="bridge-form__border" key={index} />;*/
                    case BRIDGE_MENU.Head.value:
                        return (
                            <div key={index} className="bridge-form__header">
                                {item.title()}
                            </div>
                        );
                    case BRIDGE_MENU.Form.value:
                        return (
                            <form onSubmit={handleSubmit} key={index}>
                                <div className={'bridge-form__items'}>
                                    {renderForm(item.rows)}
                                </div>
                            </form>
                        );
                    default:
                        return <div key={index} />;
                }
            });

        return <div className="bridge-form">{renderItem(BRIDGE_MENU)}</div>;
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
)(BridgeForm);
