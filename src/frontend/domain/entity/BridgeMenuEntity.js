import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';
import config from '@constants/config';
import bridge_config from '@constants/bridge_config';

export const BRIDGE_MENU = defineEnum({
    Head: {
        rawValue: 0,
        value: 'head',
        title: () => tt('g.withdraw_token'),
    },
    Form: {
        rawValue: 1,
        value: 'form',
        rows: defineEnum({
            Address: {
                rawValue: 0,
                value: 'address',
                ref: 'address',
                title: () => tt('g.eth_send_address'),
                placeholder: () =>
                    tt('g.please_enter', {
                        data: tt('g.eth_send_address'),
                    }),
            },
            Amount: {
                rawValue: 1,
                value: 'amount',
                ref: 'amount',
                title: () => tt('g.send_amount'),
                placeholder: () =>
                    tt('g.please_enter', {
                        data: tt('g.send_amount'),
                    }),
            },
            Fee: {
                rawValue: 2,
                value: 'fee',
                title: () => tt('g.fee'),
                price: `${bridge_config.gasTokenPrice}Self`,
            },
            Button: {
                rawValue: 3,
                value: 'button',
                title: () => tt('g.confirm_bridge'),
            },
        }),
    },
});

export default BRIDGE_MENU;
