import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import {
    HomeModel,
    HomeModels,
    ShowModel,
    RelateModel,
    ContentShowModel,
} from '@entity';
import { bridgeNewRoute } from '@infrastructure/RouteInitialize';

// Action constants
export const SEND = 'wallet/SEND';
export const TRANSFER = 'wallet/TRANSFER';
export const BURN = 'wallet/BURN';
export const MINT = 'wallet/MINT';
export const SHOW_PRIVATE_KEY = 'wallet/SHOW_PRIVATE_KEY';
export const SET_PRIVATE_KEY = 'wallet/SET_PRIVATE_KEY';
export const HIDE_PRIVATE_KEY = 'wallet/HIDE_PRIVATE_KEY';
export const CLAIM_REWARD = 'wallet/CLAIM_REWARD';
export const BRIDGE_TOKEN = 'wallet/BRIDGE_TOKEN';
export const SHOW_NEW_BRIDGE = 'wallet/SHOW_NEW_BRIDGE';
export const HIDE_NEW_BRIDGE = 'wallet/HIDE_NEW_BRIDGE';

const defaultState = fromJS({
    privateKey: '',
    show_private_key: false,
    show_new_bridge: false,
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;

    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            //NOTE: private key is high security value! So, make sure remove!
            return state.merge({
                // show_new_bridge: bridgeNewRoute.isValidPath(
                //     action.payload.pathname
                // ),
                privateKey: '',
            });

        case SHOW_PRIVATE_KEY:
            return state.merge({
                show_private_key: true,
            });

        case SET_PRIVATE_KEY:
            return state.merge({
                privateKey: payload.privateKey,
            });
        case HIDE_PRIVATE_KEY:
            return state.merge({
                show_private_key: false,
                privateKey: '',
            });

        case SHOW_NEW_BRIDGE:
            return state.merge({
                show_new_bridge: true,
            });
        case HIDE_NEW_BRIDGE:
            return state.merge({
                show_new_bridge: false,
            });

        default:
            return state;
    }
}

export const send = payload => ({
    type: SEND,
    payload,
});

export const transfer = payload => ({
    type: TRANSFER,
    payload,
});

export const showPrivateKey = payload => ({
    type: SHOW_PRIVATE_KEY,
    payload,
});

export const setPrivateKey = payload => ({
    type: SET_PRIVATE_KEY,
    payload,
});

export const hidePrivateKey = payload => ({
    type: HIDE_PRIVATE_KEY,
    payload,
});

export const showNewBridge = payload => ({
    type: SHOW_NEW_BRIDGE,
    payload,
});

export const hideNewBridge = payload => ({
    type: HIDE_NEW_BRIDGE,
    payload,
});

export const burn = payload => ({
    type: BURN,
    payload,
});

export const mint = payload => ({
    type: MINT,
    payload,
});

export const claimReward = payload => ({
    type: CLAIM_REWARD,
    payload,
});

export const bridgeToken = payload => ({
    type: BRIDGE_TOKEN,
    payload,
});
