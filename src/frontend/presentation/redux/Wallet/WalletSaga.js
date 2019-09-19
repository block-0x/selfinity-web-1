import { fromJS, Set, List } from 'immutable';
import {
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { translate } from '@infrastructure/Translator';
import * as walletActions from './WalletReducer';
import WalletUseCase from '@usecase/WalletUseCase';

const walletUseCase = new WalletUseCase();

export const walletWatches = [
    takeEvery(LOCATION_CHANGE, walletUseCase.syncReward),
    takeLatest(walletActions.CLAIM_REWARD, walletUseCase.claimReward),
    takeLatest(walletActions.SEND, walletUseCase.send),
    takeLatest(walletActions.TRANSFER, walletUseCase.transfer),
    takeLatest(walletActions.BRIDGE_TOKEN, walletUseCase.bridgeToken),
    takeLatest(walletActions.SHOW_PRIVATE_KEY, walletUseCase.showPrivateKey),
];
