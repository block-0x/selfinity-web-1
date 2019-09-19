import { Map, fromJS } from 'immutable';
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// import { contentStats } from '@utils/StateFunctions';
import { appReducer } from '@redux/App';
import { authReducer } from '@redux/Auth';
import { contentReducer } from '@redux/Content';
import { requestReducer } from '@redux/Request';
import { sessionReducer } from '@redux/Session';
import { searchReducer } from '@redux/Search';
import { labelReducer } from '@redux/Label';
import { transactionReducer } from '@redux/Transaction';
import { userReducer } from '@redux/User';
import { walletReducer } from '@redux/Wallet';

function initReducer(reducer, type) {
    return (state, action) => {
        if (!state) return reducer(state, action);

        // @@redux/INIT server and client init
        if (action.type === '@@redux/INIT' || action.type === '@@INIT') {
            if (!(state instanceof Map)) {
                state = fromJS(state);
            }
            // if (type === 'global') {
            //     const content = state.get('content').withMutations(c => {
            //         c.forEach((cc, key) => {
            //             if (!c.getIn([key, 'stats'])) {
            //                 // This may have already been set in UniversalRender; if so, then
            //                 //   active_votes were cleared from server response. In this case it
            //                 //   is important to not try to recalculate the stats. (#1040)
            //                 c.setIn([key, 'stats'], fromJS(contentStats(cc)));
            //             }
            //         });
            //     });
            //     state = state.set('content', content);
            // }
            return state;
        }

        if (action.type === '@@router/LOCATION_CHANGE' && type === 'global') {
            state = state.set('pathname', action.payload.pathname);
            // console.log(action.type, type, action, state.toJS())
        }

        return reducer(state, action);
    };
}

export default combineReducers({
    app: initReducer(appReducer),
    routing: initReducer(routerReducer),
    auth: initReducer(authReducer),
    content: initReducer(contentReducer),
    session: initReducer(sessionReducer),
    search: initReducer(searchReducer),
    label: initReducer(labelReducer),
    transaction: initReducer(transactionReducer),
    user: initReducer(userReducer),
    wallet: initReducer(walletReducer),
    request: initReducer(requestReducer),
    form: formReducer,
});
