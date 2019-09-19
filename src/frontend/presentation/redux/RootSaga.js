import { all } from 'redux-saga/effects';
import { contentWatches } from '@redux/Content';
import { authWatches } from '@redux/Auth';
import { appWatches } from '@redux/App';
import { requestWatches } from '@redux/Request';
import { sessionWatches } from '@redux/Session';
import { searchWatches } from '@redux/Search';
import { labelWatches } from '@redux/Label';
import { transactionWatches } from '@redux/Transaction';
import { userWatches } from '@redux/User';
import { walletWatches } from '@redux/Wallet';

export default function* rootSaga() {
    yield all([
        ...appWatches, // keep first to remove keys early when a page change happens
        ...contentWatches,
        ...requestWatches,
        ...authWatches,
        ...sessionWatches,
        ...searchWatches,
        ...labelWatches,
        ...transactionWatches,
        ...userWatches,
        ...walletWatches,
    ]);
}
