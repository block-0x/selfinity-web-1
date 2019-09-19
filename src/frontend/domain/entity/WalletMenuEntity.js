import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';
import config from '@constants/config';

export const WALLET_MENU = defineEnum({
    // Credit: {
    //     rawValue: 0,
    //     value: 'credit',
    //     title: () => tt('g.credit'),
    //     rows: defineEnum({
    //         About: {
    //             rawValue: 0,
    //             value: 'about',
    //             title: () => tt('g.credit_about'),
    //         },
    //         Way: {
    //             rawValue: 1,
    //             value: 'way',
    //             title: () => tt('g.way_to_get'),
    //             ways: [
    //                 () => tt('g.way_to_get_credit1'),
    //                 () => tt('g.way_to_get_credit2'),
    //                 () => tt('g.way_to_get_credit3'),
    //             ],
    //         },
    //         Merit: {
    //             rawValue: 1,
    //             value: 'merit',
    //         },
    //     }),
    // },
    Token: {
        rawValue: 1,
        value: 'token',
        title: () => config.TOKEN_NAME,
        rows: defineEnum({
            About: {
                rawValue: 0,
                value: 'about',
                title: () => tt('g.token_about'),
            },
            Way: {
                rawValue: 1,
                value: 'way',
                title: () => tt('g.way_to_get'),
                ways: [
                    () => tt('g.way_to_get_credit1'),
                    () => tt('g.way_to_get_credit2'),
                    () => tt('g.way_to_get_credit3'),
                ],
            },
            Merit: {
                rawValue: 1,
                value: 'merit',
            },
            /*Bridge: {
                rawValue: 1,
                value: 'bridge',
                title: () => tt('g.withdraw_token_title'),
                button_title: () => tt('g.withdraw_token'),
            },*/
            // Claim: {
            //     rawValue: 1,
            //     value: 'claim',
            //     title: amount => tt('g.token_not_payment', { amount }),
            //     button_title: () => tt('g.token_get'),
            // },
        }),
    },
    /*EthWallet: {
        rawValue: 3,
        value: 'ethwallet',
        title: () => tt('g.eth_wallet'),
        rows: defineEnum({
            About: {
                rawValue: 0,
                value: 'about',
                title: () => tt('g.eth_wallet_about'),
            },
            Address: {
                rawValue: 0,
                value: 'address',
                title: () => tt('g.address'),
            },
            PrivateKey: {
                rawValue: 0,
                value: 'privatekey',
                title: () => tt('g.show_private_key'),
            },
        }),
    },*/
    // Send: {
    //     rawValue: 4,
    //     value: () => tt('g.what_selfinity'),
    //     url: '/welcome',
    // },
});

export default WALLET_MENU;
