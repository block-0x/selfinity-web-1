import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseButton from '@elements/CloseButton';
import HomeShow from '@pages/HomeShow';
import HomeNew from '@pages/HomeNew';
import Reveal from '@elements/Reveal';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import tt from 'counterpart';
import * as contentActions from '@redux/Content/ContentReducer';
import * as appActions from '@redux/App/AppReducer';
import * as sessionActions from '@redux/Session/SessionReducer';
import * as labelActions from '@redux/Label/LabelReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as walletActions from '@redux/Wallet/WalletReducer';
import { OPERATION_TYPE, SUBMIT_TYPE, CONTENT_TYPE } from '@entity';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import HomeLabelEdit from '@pages/HomeLabelEdit';
import SideBarModal from '@pages/SideBarModal';
import LoginModal from '@pages/LoginModal';
import PrivateKeyShow from '@pages/PrivateKeyShow';
import LoginModalForPrivateKey from '@pages/LoginModalForPrivateKey';
import ResendConfirmationMailModal from '@pages/ResendConfirmationMailModal';
import ResendConfirmationCodeModal from '@pages/ResendConfirmationCodeModal';
import LoginModalForDelete from '@pages/LoginModalForDelete';
import BridgeNew from '@pages/BridgeNew';
import SendDeletePasswordConfirmationMailModal from '@pages/SendDeletePasswordConfirmationMailModal';
import PickupModal from '@pages/PickupModal';
import PickupOpinionModal from '@pages/PickupOpinionModal';

class Modals extends React.Component {
    static defaultProps = {
        notifications: undefined,
        removeNotification: () => {},
        show_terms_modal: false,
        show_promote_post_modal: false,
        show_signup_modal: false,
        show_bandwidth_error_modal: false,
        show_powerdown_modal: false,
        show_transfer_modal: false,
        show_confirm_modal: false,
        show_login_modal: false,
        show_read_modal: false,
        show_new_modal: false,
        show_new_bridge: false,
        show_private_key: false,
        show_post_advanced_settings_modal: '',
        show_customize_edit_modal: false,
        show_side_bar_modal: false,
        show_confirm_login_for_private_key_modal: false,
        show_confirm_login_for_delete_modal: false,
        show_resend_confirmation_mail_modal: false,
        show_resend_confirmation_code_modal: false,
        show_send_delete_password_confirmation_mail_modal: false,
        show_pickup_modal: false,
        show_pickup_opinion_modal: false,
    };
    static propTypes = {
        show_customize_edit_modal: PropTypes.bool,
        show_login_modal: PropTypes.bool,
        show_confirm_modal: PropTypes.bool,
        show_transfer_modal: PropTypes.bool,
        show_powerdown_modal: PropTypes.bool,
        show_bandwidth_error_modal: PropTypes.bool,
        show_signup_modal: PropTypes.bool,
        show_promote_post_modal: PropTypes.bool,
        show_post_advanced_settings_modal: PropTypes.string,
        show_read_modal: PropTypes.bool,
        show_new_modal: PropTypes.bool,
        show_new_bridge: PropTypes.bool,
        show_private_key: PropTypes.bool,
        show_confirm_login_for_private_key_modal: PropTypes.bool,
        show_confirm_login_for_delete_modal: PropTypes.bool,
        show_resend_confirmation_code_modal: PropTypes.bool,
        show_resend_confirmation_mail_modal: PropTypes.bool,
        show_send_delete_password_confirmation_mail_modal: PropTypes.bool,
        show_pickup_modal: PropTypes.bool,
        show_pickup_opinion_modal: PropTypes.bool,
        hideCustomizeEdit: PropTypes.func.isRequired,
        hideLogin: PropTypes.func.isRequired,
        hideConfirm: PropTypes.func.isRequired,
        hideSignUp: PropTypes.func.isRequired,
        hideTransfer: PropTypes.func.isRequired,
        hidePowerdown: PropTypes.func.isRequired,
        hidePromotePost: PropTypes.func.isRequired,
        hideBandwidthError: PropTypes.func.isRequired,
        hidePostAdvancedSettings: PropTypes.func.isRequired,
        hideRead: PropTypes.func.isRequired,
        hideNew: PropTypes.func.isRequired,
        hidePrivateKey: PropTypes.func.isRequired,
        notifications: PropTypes.object,
        show_terms_modal: PropTypes.bool,
        removeNotification: PropTypes.func,
        show_side_bar_modal: PropTypes.bool,
        hideSideBarModal: PropTypes.func.isRequired,
        hideConfirmLoginForPrivateKeyModal: PropTypes.func.isRequired,
        hideConfirmLoginForDeleteModal: PropTypes.func.isRequired,
        hideResendConfirmationCodeModal: PropTypes.func.isRequired,
        hideResendConfirmationMailModal: PropTypes.func.isRequired,
        hideNewBridge: PropTypes.func.isRequired,
        hideSendDeletePasswordConfirmationMailModal: PropTypes.func.isRequired,
        hidePickupModal: PropTypes.func.isRequired,
        hidePickupOpinionModal: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Modals');
    }

    render() {
        const {
            show_read_modal,
            show_new_modal,
            show_new_bridge,
            show_customize_edit_modal,
            hideRead,
            hideNew,
            show_login_modal,
            show_confirm_modal,
            show_transfer_modal,
            show_powerdown_modal,
            show_signup_modal,
            show_bandwidth_error_modal,
            show_post_advanced_settings_modal,
            show_side_bar_modal,
            show_pickup_modal,
            show_pickup_opinion_modal,
            hideSideBarModal,
            show_private_key,
            hidePrivateKey,
            hideLogin,
            hideTransfer,
            hidePowerdown,
            hideConfirm,
            hideSignUp,
            hideCustomizeEdit,
            show_terms_modal,
            notifications,
            removeNotification,
            hidePromotePost,
            show_promote_post_modal,
            hideBandwidthError,
            hidePostAdvancedSettings,
            username,
            nightmodeEnabled,
            show_confirm_login_for_private_key_modal,
            hideConfirmLoginForPrivateKeyModal,
            show_confirm_login_for_delete_modal,
            hideConfirmLoginForDeleteModal,
            hideNewBridge,
            show_resend_confirmation_code_modal,
            show_resend_confirmation_mail_modal,
            hideResendConfirmationCodeModal,
            hideResendConfirmationMailModal,
            show_send_delete_password_confirmation_mail_modal,
            hideSendDeletePasswordConfirmationMailModal,
            hidePickupModal,
            hidePickupOpinionModal,
        } = this.props;

        const themeClass = nightmodeEnabled ? ' theme-dark' : ' theme-original';

        return (
            <div>
                {show_read_modal && (
                    <Reveal onHide={hideRead} show={show_read_modal}>
                        <HomeShow onCancel={hideRead} />
                    </Reveal>
                )}
                {show_new_modal && (
                    <Reveal onHide={hideNew} show={show_new_modal}>
                        <HomeNew
                            onCancel={hideNew}
                            mode={CONTENT_TYPE.Content}
                        />
                    </Reveal>
                )}
                {show_customize_edit_modal && (
                    <Reveal
                        onHide={hideCustomizeEdit}
                        show={show_customize_edit_modal}
                    >
                        <HomeLabelEdit onCancel={hideCustomizeEdit} />
                    </Reveal>
                )}
                {show_side_bar_modal && (
                    <Reveal
                        onHide={hideSideBarModal}
                        show={show_side_bar_modal}
                    >
                        <SideBarModal onCancel={hideSideBarModal} />
                    </Reveal>
                )}
                {show_login_modal && (
                    <Reveal onHide={hideLogin} show={show_login_modal}>
                        <LoginModal onCancel={hideLogin} />
                    </Reveal>
                )}
                {show_confirm_login_for_private_key_modal && (
                    <Reveal
                        onHide={hideConfirmLoginForPrivateKeyModal}
                        show={show_confirm_login_for_private_key_modal}
                    >
                        <LoginModalForPrivateKey
                            onCancel={hideConfirmLoginForPrivateKeyModal}
                        />
                    </Reveal>
                )}
                {show_confirm_login_for_delete_modal && (
                    <Reveal
                        onHide={hideConfirmLoginForDeleteModal}
                        show={show_confirm_login_for_delete_modal}
                    >
                        <LoginModalForDelete
                            onCancel={hideConfirmLoginForDeleteModal}
                        />
                    </Reveal>
                )}
                {show_resend_confirmation_mail_modal && (
                    <Reveal
                        onHide={hideResendConfirmationMailModal}
                        show={show_resend_confirmation_mail_modal}
                    >
                        <ResendConfirmationMailModal
                            onCancel={hideResendConfirmationMailModal}
                        />
                    </Reveal>
                )}
                {show_resend_confirmation_code_modal && (
                    <Reveal
                        onHide={hideResendConfirmationCodeModal}
                        show={show_resend_confirmation_code_modal}
                    >
                        <ResendConfirmationCodeModal
                            onCancel={hideResendConfirmationCodeModal}
                        />
                    </Reveal>
                )}
                {show_private_key && (
                    <Reveal onHide={hidePrivateKey} show={show_private_key}>
                        <PrivateKeyShow onCancel={hidePrivateKey} />
                    </Reveal>
                )}
                {show_new_bridge && (
                    <Reveal onHide={hideNewBridge} show={show_new_bridge}>
                        <BridgeNew onCancel={hideNewBridge} />
                    </Reveal>
                )}
                {show_send_delete_password_confirmation_mail_modal && (
                    <Reveal
                        onHide={hideSendDeletePasswordConfirmationMailModal}
                        show={show_send_delete_password_confirmation_mail_modal}
                    >
                        <SendDeletePasswordConfirmationMailModal
                            onCancel={
                                hideSendDeletePasswordConfirmationMailModal
                            }
                        />
                    </Reveal>
                )}
                {show_pickup_modal && (
                    <Reveal onHide={hidePickupModal} show={show_pickup_modal}>
                        <PickupModal onCancel={hidePickupModal} />
                    </Reveal>
                )}
                {show_pickup_opinion_modal && (
                    <Reveal
                        onHide={hidePickupOpinionModal}
                        show={show_pickup_opinion_modal}
                    >
                        <PickupOpinionModal onCancel={hidePickupOpinionModal} />
                    </Reveal>
                )}
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            nightmodeEnabled: state.app.getIn([
                'user_preferences',
                'nightmode',
            ]),
            show_read_modal: state.content.get('show_read_modal'),
            show_new_modal: state.content.get('show_new_modal'),
            show_login_modal: state.auth.get('show_login_modal'),
            show_customize_edit_modal: state.label.get(
                'show_customize_edit_modal'
            ),
            show_signup_modal: state.auth.get('show_signup_modal'),
            notifications: state.app.get('notifications'),
            show_side_bar_modal: state.app.get('show_side_bar_modal'),
            show_private_key: state.wallet.get('show_private_key'),
            show_confirm_login_for_private_key_modal: state.auth.get(
                'show_confirm_login_for_private_key_modal'
            ),
            show_confirm_login_for_delete_modal: state.auth.get(
                'show_confirm_login_for_delete_modal'
            ),
            show_new_bridge: state.wallet.get('show_new_bridge'),
            show_resend_confirmation_mail_modal: state.session.get(
                'show_resend_confirmation_mail_modal'
            ),
            show_resend_confirmation_code_modal: state.session.get(
                'show_resend_confirmation_code_modal'
            ),
            show_send_delete_password_confirmation_mail_modal: state.session.get(
                'show_send_delete_password_confirmation_mail_modal'
            ),
            show_pickup_modal: state.content.get('show_pickup_modal'),
            show_pickup_opinion_modal: state.content.get(
                'show_pickup_opinion_modal'
            ),
        };
    },
    dispatch => ({
        hideRead: e => {
            if (e) e.preventDefault();
            dispatch(contentActions.hideRead());
        },
        hideNew: e => {
            if (e) e.preventDefault();
            dispatch(contentActions.hideNew());
        },
        hideLogin: e => {
            if (e) e.preventDefault();
            dispatch(authActions.hideLogin());
        },
        hideCustomizeEdit: e => {
            if (e) e.preventDefault();
            dispatch(labelActions.hideCustomizeEdit());
        },
        hideSideBarModal: e => {
            if (e) e.preventDefault();
            dispatch(appActions.hideSideBarModal());
        },
        hidePrivateKey: e => {
            if (e) e.preventDefault();
            dispatch(walletActions.hidePrivateKey());
        },
        hideConfirmLoginForPrivateKeyModal: e => {
            if (e) e.preventDefault();
            dispatch(authActions.hideConfirmLoginForPrivateKeyModal());
        },
        hideConfirmLoginForDeleteModal: e => {
            if (e) e.preventDefault();
            dispatch(authActions.hideConfirmLoginForDeleteModal());
        },
        hideNewBridge: e => {
            if (e) e.preventDefault();
            dispatch(walletActions.hideNewBridge());
        },
        hideResendConfirmationCodeModal: e => {
            if (e) e.preventDefault();
            dispatch(sessionActions.hideResendConfirmationCodeModal());
        },
        hideResendConfirmationMailModal: e => {
            if (e) e.preventDefault();
            dispatch(sessionActions.hideResendConfirmationMailModal());
        },
        hideSendDeletePasswordConfirmationMailModal: e => {
            if (e) e.preventDefault();
            dispatch(
                sessionActions.hideSendDeletePasswordConfirmationMailModal()
            );
        },
        hidePickupModal: e => {
            if (e) e.preventDefault();
            dispatch(contentActions.hidePickupModal());
        },
        hidePickupOpinionModal: e => {
            if (e) e.preventDefault();
            dispatch(contentActions.hidePickupOpinionModal());
        },
        hideConfirm: e => {
            // if (e) e.preventDefault();
            // dispatch(transactionActions.hideConfirm());
        },
        hideTransfer: e => {
            // if (e) e.preventDefault();
            // dispatch(userActions.hideTransfer());
        },
        hidePowerdown: e => {
            // if (e) e.preventDefault();
            // dispatch(userActions.hidePowerdown());
        },
        hidePromotePost: e => {
            // if (e) e.preventDefault();
            // dispatch(userActions.hidePromotePost());
        },
        hideSignUp: e => {
            if (e) e.preventDefault();
            //dispatch(authActions.hideSignUp());
        },
        hideBandwidthError: e => {
            // if (e) e.preventDefault();
            // dispatch(
            //     transactionActions.dismissError({ key: 'bandwidthError' })
            // );
        },
        hidePostAdvancedSettings: e => {
            // if (e) e.preventDefault();
            // dispatch(userActions.hidePostAdvancedSettings());
        },
        // example: addNotification: ({key, message}) => dispatch({type: 'ADD_NOTIFICATION', payload: {key, message}}),
        removeNotification: key =>
            dispatch(appActions.removeNotification({ key })),
    })
)(Modals);
