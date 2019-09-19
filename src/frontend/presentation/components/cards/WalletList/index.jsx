import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as walletActions from '@redux/Wallet/WalletReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import { WALLET_MENU } from '@entity';
import GradationButton from '@elements/GradationButton';
import SimpleButton from '@elements/SimpleButton';
import Icon from '@elements/Icon';
import Responsible from '@modules/Responsible';
import reward_config from '@constants/reward_config';
import tt from 'counterpart';
import Img from 'react-image';
import CollectionItem from '@elements/CollectionItem';

class WalletList extends React.Component {
    static propTypes = {
        current_user: AppPropTypes.User,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'WalletList');
        this.onClickClaimReward = this.onClickClaimReward.bind(this);
    }

    onClickClaimReward(e) {
        const {
            current_user,
            claimReward,
            showLogin,
            showPhoneConfirm,
        } = this.props;
        if (!current_user) {
            showLogin();
            return;
        }

        if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        claimReward(current_user);
    }

    render() {
        const {
            current_user,
            showConfirmLoginForPrivateKeyModal,
            showNewBridge,
        } = this.props;

        const wrapSection = ({ left, right, key }) => (
            <div className="wallet-list__section" key={key}>
                <div className="wallet-list__section-left">{left}</div>
                <div className="wallet-list__section-right">{right}</div>
            </div>
        );

        const aboutRow = (text, key) => (
            <div className="wallet-list__about" key={key}>
                {text}
            </div>
        );

        const creditAboutRow = key => (
            <div className="wallet-list__credit-about" key={key}>
                <div className="wallet-list__credit-about-title">
                    {tt('g.credit_title')}
                </div>
                <div className="wallet-list__credit-about-border" />
                <div className="wallet-list__credit-about-body">
                    <Img
                        className="wallet-list__credit-about-body__image"
                        src="/images/point-color.png"
                        alt={tt('alts.default')}
                    />
                    <div className="wallet-list__credit-about-body__text">
                        <div
                            className="wallet-list__credit-about-body__text-body"
                            style={{ marginTop: '22px' }}
                        >
                            {tt('g.credit_about')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const tokenAboutRow = key => (
            <div className="wallet-list__token-about" key={key}>
                <div className="wallet-list__token-about-title">
                    {tt('g.merit_point_short')}
                </div>
                <div className="wallet-list__token-about-border" />
                <div className="wallet-list__token-about-body">
                    <Img
                        className="wallet-list__token-about-body__image"
                        src="/images/selftoken-mini-logo.png"
                        alt={tt('alts.default')}
                    />
                    <div className="wallet-list__token-about-body__text">
                        <div
                            className="wallet-list__token-about-body__text-body"
                            style={{ marginTop: '22px' }}
                        >
                            {tt('g.merit_desc')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const waysRow = (title, lists, key) => (
            <div className="wallet-list__ways" key={key}>
                <div className="wallet-list__ways-title">{title}</div>
                <div className="wallet-list__ways-border" />
                <div className="wallet-list__ways-lists">
                    <div className="wallet-list__ways-list">
                        <Responsible
                            className={'wallet-list__ways-list-icon'}
                            defaultContent={
                                <Icon src={'color-upvote-img'} size={'4x'} />
                            }
                            breakingContent={
                                <Icon src={'color-upvote-img'} size={'3x'} />
                            }
                            breakMd={true}
                        />
                        <div className="wallet-list__ways-list-title">
                            {tt('g.credit_way1')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const meritsRow = key => (
            <div className="wallet-list__merits" key={key}>
                <div className="wallet-list__merits-title">
                    {tt('g.credit_merits')}
                </div>
                <div className="wallet-list__merits-border" />
                <div className="wallet-list__merits-lists">
                    <div className="wallet-list__merits-list">
                        <div className="wallet-list__merits-list-title">
                            {'・' + tt('g.credit_merit1')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const tokenMeritsRow = key => (
            <div className="wallet-list__token-merits" key={key}>
                <div className="wallet-list__token-merits-title">
                    {tt('g.token_merits')}
                </div>
                <div className="wallet-list__token-merits-border" />
                <div className="wallet-list__token-merits-lists">
                    <div className="wallet-list__token-merits-list">
                        <div
                            className="wallet-list__merits-list-title"
                            style={{ textAlign: 'center', display: 'block' }}
                        >
                            {tt('g.token_merit1')}
                        </div>
                    </div>
                    <div className="wallet-list__token-merits-list">
                        <div
                            className="wallet-list__merits-list-title"
                            style={{ textAlign: 'center', display: 'block' }}
                        >
                            {tt('g.token_merit2')}
                        </div>
                    </div>
                </div>
            </div>
        );

        const claimRow = (title, button_title, key) => (
            <div className="wallet-list__claim" key={key}>
                <div className="wallet-list__claim-title">{title}</div>
                <div className="wallet-list__claim-button">
                    <GradationButton
                        value={button_title}
                        color={'blue'}
                        onClick={this.onClickClaimReward}
                    />
                </div>
            </div>
        );

        const bridgeRow = (title, button_title, key) => (
            <div className="wallet-list__claim" key={key}>
                <div className="wallet-list__claim-title">{title}</div>
                <div className="wallet-list__claim-button">
                    <GradationButton
                        value={button_title}
                        color={'blue'}
                        onClick={showNewBridge}
                    />
                </div>
            </div>
        );

        const addressRow = (title, key) => (
            <div className="wallet-list__address" key={key}>
                <div className="wallet-list__address-title">{title}</div>
                <div className="wallet-list__address-value">
                    {current_user.eth_address}
                </div>
            </div>
        );

        const privateKeyRow = (title, key) => (
            <div className="wallet-list__private-key" key={key}>
                <GradationButton
                    value={title}
                    onClick={showConfirmLoginForPrivateKeyModal}
                />
            </div>
        );

        const renderCreditRow = (items, index) =>
            items._enums.map((item, key) => {
                switch (item.value) {
                    case WALLET_MENU.Credit.rows.About.value:
                        return creditAboutRow(key);
                    case WALLET_MENU.Credit.rows.Way.value:
                        return waysRow(item.title(), item.ways, key);
                    case WALLET_MENU.Credit.rows.Merit.value:
                        return meritsRow(key);
                    default:
                        return <div key={index} />;
                        break;
                }
            });

        const creditSection = (item, key) => (
            <div className="wallet-list__credit" key={key}>
                {wrapSection({
                    left: (
                        <div>
                            <div className="wallet-list__credit-image">
                                <Responsible
                                    breakFm={true}
                                    defaultContent={
                                        <Icon src="point" size="3x" />
                                    }
                                    breakingContent={
                                        <Icon src="point" size="2_4x" />
                                    }
                                />
                            </div>
                            <div className="wallet-list__credit-title">
                                {item.title()}
                            </div>
                        </div>
                    ),
                    right: (
                        <div className="wallet-list__credit-value">
                            {reward_config.getScore(current_user)}
                        </div>
                    ),
                    key,
                })}
                <div className="wallet-list__credit-items">
                    {renderCreditRow(item.rows, key)}
                </div>
            </div>
        );

        const renderTokenRow = (items, index) =>
            items._enums.map((item, key) => {
                switch (item.value) {
                    case WALLET_MENU.Token.rows.About.value:
                        return tokenAboutRow(key);
                    case WALLET_MENU.Token.rows.Way.value:
                        return waysRow(item.title(), item.ways, key);
                    case WALLET_MENU.Token.rows.Merit.value:
                        return tokenMeritsRow(key);
                    case WALLET_MENU.Token.rows.Bridge.value:
                        return bridgeRow(
                            item.title(),
                            item.button_title(),
                            key
                        );
                    default:
                        return <div key={index} />;
                        break;
                }
            });

        const tokenSection = (item, key) => (
            <div className="wallet-list__token" key={key}>
                {wrapSection({
                    left: (
                        <div>
                            <div className="wallet-list__token-image">
                                <Responsible
                                    breakFm={true}
                                    defaultContent={
                                        <Icon
                                            src="selftoken-mini-logo"
                                            size="3x"
                                        />
                                    }
                                    breakingContent={
                                        <Icon
                                            src="selftoken-mini-logo"
                                            size="2_4x"
                                        />
                                    }
                                />
                            </div>
                            <div className="wallet-list__token-title">
                                {item.title()}
                            </div>
                        </div>
                    ),
                    right: (
                        <div className="wallet-list__token-value">
                            {current_user.token_balance}
                        </div>
                    ),
                    key,
                })}
                <div className="wallet-list__token-items">
                    {renderTokenRow(item.rows, key)}
                </div>
            </div>
        );

        const renderEthWalletRow = (items, index) =>
            items._enums.map((item, key) => {
                switch (item.value) {
                    case WALLET_MENU.EthWallet.rows.About.value:
                        return aboutRow(item.title(), key);
                    case WALLET_MENU.EthWallet.rows.Address.value:
                        return addressRow(item.title(), key);
                    case WALLET_MENU.EthWallet.rows.PrivateKey.value:
                        return privateKeyRow(item.title(), key);
                    default:
                        return <div key={index} />;
                        break;
                }
            });

        const ethWalletSection = (item, key) => (
            <div className="wallet-list__eth-wallet" key={key}>
                {wrapSection({
                    left: (
                        <div>
                            <div className="wallet-list__eth-wallet-image">
                                <Responsible
                                    breakFm={true}
                                    defaultContent={
                                        <Icon src="ether" size="3x" />
                                    }
                                    breakingContent={
                                        <Icon src="ether" size="2_4x" />
                                    }
                                />
                            </div>
                            <div className="wallet-list__eth-wallet-title">
                                {item.title()}
                            </div>
                        </div>
                    ),
                    right: <div className="wallet-list__eth-wallet-value" />,
                    key,
                })}
                <div className="wallet-list__eth-wallet-items">
                    {renderEthWalletRow(item.rows, key)}
                </div>
            </div>
        );

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    // case WALLET_MENU.Credit.value:
                    //     return creditSection(item, index);
                    case WALLET_MENU.Token.value:
                        return tokenSection(item, index);
                    case WALLET_MENU.EthWallet.value:
                        return ethWalletSection(item, index);
                    // case WALLET_MENU.Send.value:
                    default:
                        return <div key={index} />;
                        break;
                }
            });
        return <div className="wallet-list">{renderItem(WALLET_MENU)}</div>;
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        showConfirmLoginForPrivateKeyModal: () => {
            dispatch(authActions.showConfirmLoginForPrivateKeyModal());
        },
        claimReward: user => {
            dispatch(walletActions.claimReward({ user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
        showNewBridge: () => {
            dispatch(walletActions.showNewBridge());
        },
    })
)(WalletList);

/*
<div className="wallet-list__ways-list">
                        <Responsible
                            className={'wallet-list__ways-list-icon'}
                            defaultContent={
                                <Icon src={'color-cheering'} size={'4x'} />
                            }
                            breakingContent={
                                <Icon src={'color-cheering'} size={'3x'} />
                            }
                            breakMd={true}
                        />
                        <div className="wallet-list__ways-list-title">
                            {tt('g.credit_way2')}
                        </div>
                    </div>
                    <div className="wallet-list__ways-list">
                        <Responsible
                            className={'wallet-list__ways-list-icon'}
                            defaultContent={
                                <Icon src={'color-debate'} size={'4x'} />
                            }
                            breakingContent={
                                <Icon src={'color-debate'} size={'3x'} />
                            }
                            breakMd={true}
                        />
                        <div className="wallet-list__ways-list-title">
                            {tt('g.credit_way3')}
                        </div>
                    </div>
                    <div className="wallet-list__ways-list">
                        <Responsible
                            className={'wallet-list__ways-list-icon'}
                            defaultContent={
                                <Icon src={'color-request'} size={'3_4x'} />
                            }
                            breakingContent={
                                <Icon src={'color-request'} size={'3x'} />
                            }
                            breakMd={true}
                        />
                        <div className="wallet-list__ways-list-title">
                            {tt('g.credit_way4')}
                        </div>
                    </div>
*/

/*
*/
