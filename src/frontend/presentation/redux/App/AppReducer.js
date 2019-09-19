import { Map, OrderedMap, List, fromJS } from 'immutable';
import tt from 'counterpart';
import {
    SideBarEntity,
    SideBarEntities,
    FeedsSideBarEntity,
    FeedsSideBarEntities,
} from '@entity';
import { browserHistory } from 'react-router';
import {
    contentShowRoute,
    labelShowRoute,
    feedsRoute,
    homeIndexRoute,
    recommendRoute,
    userShowRoute,
    searchRoute,
    requestShowRoute,
    trendRoute,
} from '@infrastructure/RouteInitialize';
import safe2json from '@extension/safe2json';
import { ClientError } from '@extension/Error';
import * as detection from '@network/detection';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';

export const FETCH_DATA_BEGIN = 'app/FETCH_DATA_BEGIN';
export const FETCH_DATA_END = 'app/FETCH_DATA_END';
export const FETCH_MORE_DATA_BEGIN = 'app/FETCH_MORE_DATA_BEGIN';
export const FETCH_MORE_DATA_END = 'app/FETCH_MORE_DATA_END';
export const DISPATCH_DATA_BEGIN = 'app/DISPATCH_DATA_BEGIN';
export const DISPATCH_DATA_END = 'app/DISPATCH_DATA_END';
export const SCREEN_LOADING_BEGIN = 'app/SCREEN_LOADING_BEGIN';
export const SCREEN_LOADING_END = 'app/SCREEN_LOADING_END';
export const ADD_ERROR = 'app/ADD_ERROR';
export const REMOVE_ERROR = 'app/REMOVE_ERROR';
export const CLEAR_ERROR = 'app/CLEAR_ERROR';
export const ADD_SUCCESS = 'app/ADD_SUCCESS';
export const REMOVE_SUCCESS = 'app/REMOVE_SUCCESS';
export const CLEAR_SUCCESS = 'app/CLEAR_SUCCESS';
export const ADD_NOTIFICATION = 'app/ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'app/REMOVE_NOTIFICATION';
export const SET_USER_PREFERENCES = 'app/SET_USER_PREFERENCES';
export const TOGGLE_NIGHTMODE = 'app/TOGGLE_NIGHTMODE';
export const TOGGLE_BLOGMODE = 'app/TOGGLE_BLOGMODE';
export const RECEIVE_FEATURE_FLAGS = 'app/RECEIVE_FEATURE_FLAGS';
export const SHOW_HEADER = 'app/SHOW_HEADER';
export const HIDE_HEADER = 'app/HIDE_HEADER';
export const SHOW_SIDE_BAR = 'app/SHOW_SIDE_BAR';
export const HIDE_SIDE_BAR = 'app/HIDE_SIDE_BAR';
export const SHOW_SIDE_BAR_MODAL = 'app/SHOW_SIDE_BAR_MODAL';
export const HIDE_SIDE_BAR_MODAL = 'app/HIDE_SIDE_BAR_MODAL';
export const SET_SUBSCRIPTION = 'app/SET_SUBSCRIPTION';
export const SET_LABEL_STOCK = 'app/SET_LABEL_STOCK';
export const SET_HOME_SIDE_BAR_MENU = 'app/SET_HOME_SIDE_BAR_MENU';
export const SET_USERS_RECOMMEND_SIDE_BAR_MENU =
    'app/SET_USERS_RECOMMEND_SIDE_BAR_MENU';
export const SET_FEED_SIDE_BAR_MENU = 'app/SET_FEED_SIDE_BAR_MENU';
export const SET_RECOMMEND_SIDE_BAR_MENU = 'app/SET_RECOMMEND_SIDE_BAR_MENU';
export const SET_LABEL_DETAIL_SIDE_BAR_MENU =
    'app/SET_LABEL_DETAIL_SIDE_BAR_MENU';
export const HIDE_ALL_MODAL = 'app/HIDE_ALL_MODAL';

export const defaultState = Map({
    loading: false,
    sending: false,
    more_loading: false,
    screen_loading: false,
    errors: List([]),
    successes: List([]),
    location: {},
    notifications: null,
    show_header: true,
    show_side_bar: true,
    show_side_bar_modal: false,
    user_preferences: Map({
        locale: DEFAULT_LANGUAGE,
        country_code: null,
        nightmode: false,
        notification_id: null,
        timezone: null,
    }),
    subscription: List([]),
    label_stock: List([]),
    featureFlags: Map({}),
    home_side_bar_menu: List([]),
    users_recommend_side_bar_menu: List([]),
    feed_side_bar_menu: List([]),
    recommend_side_bar_menu: List([]),
    label_detail_side_bar_menu: List([]),
});

export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            //FIXME: default state of show_side_bar cant set.
            if (!('show_side_bar' in state)) {
                state = state.merge({
                    show_side_bar: true,
                });
            }
            return state.set('location', { pathname: action.payload.pathname });

        case ADD_ERROR: {
            if (action.payload.error) {
                let { error } = action.payload;
                // console.log(error);
                error = safe2json(error);
                let errors = state.get('errors');
                if (!errors) {
                    errors = List([]);
                }
                return state.merge({
                    errors: List(errors.push(error)),
                });
            }
            return state;
        }

        case REMOVE_ERROR: {
            if (action.payload.error) {
                const vals = state.get('errors');
                const pre_errors = vals.toJS();
                const errors = pre_errors.filter(
                    e =>
                        e.key != action.payload.error.key &&
                        e.tt_key != action.payload.error.tt_key &&
                        e.message != action.payload.error.message
                );
                return state.set('errors', List(errors));
            }
            return state;
        }

        case CLEAR_ERROR: {
            return state.set('errors', List([]));
        }

        case ADD_SUCCESS: {
            if (action.payload.success) {
                let { success } = action.payload;
                let successes = state.get('successes');
                if (!successes) {
                    successes = List([]);
                }
                return state.merge({
                    successes: List(successes.push(success)),
                });
            }
            return state;
        }

        case REMOVE_SUCCESS: {
            if (action.payload.success) {
                const { success } = action.payload;
                const vals = state.get('successes');
                const successes = vals.toJS();
                return state.set(
                    'successes',
                    List(successes.filter(val => val != success))
                );
            }
            return state;
        }

        case CLEAR_SUCCESS: {
            return state.set('successes', List([]));
        }

        case SHOW_HEADER: {
            return state.merge({
                show_header: true,
            });
        }

        case SHOW_SIDE_BAR: {
            return state.merge({
                show_side_bar: true,
            });
        }

        case HIDE_SIDE_BAR:
            return state.merge({
                show_side_bar: false,
            });

        case SHOW_SIDE_BAR_MODAL: {
            return state.merge({
                show_side_bar_modal: true,
            });
        }

        case HIDE_SIDE_BAR_MODAL:
            return state.merge({
                show_side_bar_modal: false,
            });

        case SET_SUBSCRIPTION: {
            return state.set(
                'subscription',
                List(
                    action.payload.subscription.map(val => {
                        return Map(safe2json(val));
                    })
                )
            );
        }

        case SET_LABEL_STOCK: {
            return state.set(
                'label_stock',
                List(
                    action.payload.labels.map(val => {
                        return Map(safe2json(val));
                    })
                )
            );
        }

        case SET_HOME_SIDE_BAR_MENU:
            return state.set(
                'home_side_bar_menu',
                List(
                    action.payload.side_bar_menu.map(val => {
                        return Map(val.toJSON());
                    })
                )
            );

        case SET_USERS_RECOMMEND_SIDE_BAR_MENU:
            return state.set(
                'users_recommend_side_bar_menu',
                List(
                    action.payload.side_bar_menu.map(val => {
                        return Map(val.toJSON());
                    })
                )
            );

        case SET_FEED_SIDE_BAR_MENU:
            return state.set(
                'feed_side_bar_menu',
                List(
                    action.payload.side_bar_menu.map(val => {
                        return Map(val.toJSON());
                    })
                )
            );

        case SET_RECOMMEND_SIDE_BAR_MENU:
            return state.set(
                'recommend_side_bar_menu',
                List(
                    action.payload.side_bar_menu.map(val => {
                        return Map(val.toJSON());
                    })
                )
            );

        case SET_LABEL_DETAIL_SIDE_BAR_MENU:
            return state.set(
                'label_detail_side_bar_menu',
                List(
                    action.payload.side_bar_menu.map(val => {
                        return Map(val.toJSON());
                    })
                )
            );

        case HIDE_HEADER:
            return state.merge({
                show_header: false,
            });
        case FETCH_DATA_BEGIN:
            return state.set('loading', true);
        case FETCH_DATA_END:
            return state.set('loading', false);
        case FETCH_MORE_DATA_BEGIN:
            return state.set('more_loading', true);
        case FETCH_MORE_DATA_END:
            return state.set('more_loading', false);
        case DISPATCH_DATA_BEGIN:
            return state.set('sending', true);
        case DISPATCH_DATA_END:
            return state.set('sending', false);
        case SCREEN_LOADING_BEGIN:
            return state.set('screen_loading', true);
        case SCREEN_LOADING_END:
            return state.set('screen_loading', false);
        case ADD_NOTIFICATION: {
            const n = {
                action: tt('g.dismiss'),
                dismissAfter: 10000,
                ...action.payload,
            };
            return state.update('notifications', s => {
                return s ? s.set(n.key, n) : OrderedMap({ [n.key]: n });
            });
        }
        case REMOVE_NOTIFICATION:
            return state.update('notifications', s =>
                s.delete(action.payload.key)
            );
        case SET_USER_PREFERENCES:
            return state.set('user_preferences', Map(action.payload));
        case TOGGLE_NIGHTMODE:
            return state.setIn(
                ['user_preferences', 'nightmode'],
                !state.getIn(['user_preferences', 'nightmode'])
            );
        case TOGGLE_BLOGMODE:
            return state.setIn(
                ['user_preferences', 'blogmode'],
                !state.getIn(['user_preferences', 'blogmode'])
            );
        case RECEIVE_FEATURE_FLAGS:
            const newFlags = state.get('featureFlags')
                ? state.get('featureFlags').merge(action.flags)
                : Map(action.flags);
            return state.set('featureFlags', newFlags);
        default:
            return state;
    }
}

export const hideAllModal = payload => ({
    type: HIDE_ALL_MODAL,
    payload,
});

export const setHomeSideBarMenu = payload => ({
    type: SET_HOME_SIDE_BAR_MENU,
    payload,
});

export const setUsersRecommendSideBarMenu = payload => ({
    type: SET_USERS_RECOMMEND_SIDE_BAR_MENU,
    payload,
});

export const setSubscription = payload => ({
    type: SET_SUBSCRIPTION,
    payload,
});

export const setLabelStock = payload => ({
    type: SET_LABEL_STOCK,
    payload,
});

export const setFeedSideBarMenu = payload => ({
    type: SET_FEED_SIDE_BAR_MENU,
    payload,
});

export const setRecommendSideBarMenu = payload => ({
    type: SET_RECOMMEND_SIDE_BAR_MENU,
    payload,
});

export const setLabelDetailSideBarMenu = payload => ({
    type: SET_LABEL_DETAIL_SIDE_BAR_MENU,
    payload,
});

export const showSideBar = payload => ({
    type: SHOW_SIDE_BAR,
    payload,
});

export const hideSideBar = payload => ({
    type: HIDE_SIDE_BAR,
    payload,
});

export const showSideBarModal = payload => ({
    type: SHOW_SIDE_BAR_MODAL,
    payload,
});

export const hideSideBarModal = payload => ({
    type: HIDE_SIDE_BAR_MODAL,
    payload,
});

export const showHeader = payload => ({
    type: SHOW_HEADER,
    payload,
});

export const hideHeader = payload => ({
    type: HIDE_HEADER,
    payload,
});

export const addError = payload => ({
    type: ADD_ERROR,
    payload,
});

export const removeError = payload => ({
    type: REMOVE_ERROR,
    payload,
});

export const clearError = payload => ({
    type: CLEAR_ERROR,
    payload,
});

export const addSuccess = payload => ({
    type: ADD_SUCCESS,
    payload,
});

export const removeSuccess = payload => ({
    type: REMOVE_SUCCESS,
    payload,
});

export const clearSuccess = payload => ({
    type: CLEAR_SUCCESS,
    payload,
});

export const screenLoadingBegin = () => ({
    type: SCREEN_LOADING_BEGIN,
});

export const screenLoadingEnd = () => ({
    type: SCREEN_LOADING_END,
});

export const fetchDataBegin = () => ({
    type: FETCH_DATA_BEGIN,
});

export const fetchDataEnd = () => ({
    type: FETCH_DATA_END,
});

export const fetchMoreDataBegin = () => ({
    type: FETCH_MORE_DATA_BEGIN,
});

export const fetchMoreDataEnd = () => ({
    type: FETCH_MORE_DATA_END,
});

export const dispatchDataBegin = () => ({
    type: DISPATCH_DATA_BEGIN,
});

export const dispatchDataEnd = () => ({
    type: DISPATCH_DATA_END,
});

export const addNotification = payload => ({
    type: ADD_NOTIFICATION,
    payload,
});

export const removeNotification = payload => ({
    type: REMOVE_NOTIFICATION,
    payload,
});

export const setUserPreferences = payload => ({
    type: SET_USER_PREFERENCES,
    payload,
});

export const toggleNightmode = () => ({
    type: TOGGLE_NIGHTMODE,
});

export const toggleBlogmode = () => ({
    type: TOGGLE_BLOGMODE,
});

export const receiveFeatureFlags = flags => ({
    type: RECEIVE_FEATURE_FLAGS,
    flags,
});

export const selectors = {
    getFeatureFlag: (state, flagName) =>
        state.getIn(['featureFlags', flagName], false),
};

export const getErrorsFromKey = (state, key) => {
    const vals = state.app.get('errors');
    if (!vals) return [];
    const errors = vals.toJS();
    return errors.filter(e => e.key == key).map(e => {
        e.error = new Error(e.message);
        return new ClientError(e);
    });
};

export const getSuccess = state => {
    const vals = state.app.get('successes');
    if (!vals) return [];
    const successes = vals.toJS();
    return successes || [];
};

export const removeErrorsFromKey = (state, key) => {
    const vals = state.app.get('errors');
    if (!vals) return [];
    const errors = vals.toJS();
    return errors.filter(e => e.key != key);
};

export const removeErrorsFromError = (state, error) => {
    const vals = state.app.get('errors');
    if (!vals) return [];
    const errors = vals.toJS();
    return errors.filter(
        e =>
            e.key != key &&
            e.tt_key != error.tt_key &&
            e.message != error.message
    );
};

export const getHomeSideBarMenu = state => {
    const vals_list = state.app.get('home_side_bar_menu');
    if (!vals_list) return [];
    const vals = vals_list.toJS();
    return vals.map(val => {
        val.items = val.items.map(item => {
            return new SideBarEntity(item);
        });
        return new SideBarEntities(val);
    });
};

export const getUsersRecommendSideBarMenu = state => {
    const vals_list = state.app.get('users_recommend_side_bar_menu');
    if (!vals_list) return [];
    const vals = vals_list.toJS();
    return vals.map(val => {
        val.items = val.items.map(item => {
            return new SideBarEntity(item);
        });
        return new SideBarEntities(val);
    });
};

export const getFeedSideBarMenu = state => {
    // const vals_list = state.app.get('feed_side_bar_menu');
    // if (!vals_list) return [];
    // const vals = vals_list.toJS();
    // return vals.map(val => {
    //     val.items = val.items.map(item => {
    //         return new SideBarEntity(item);
    //     });
    //     return new SideBarEntities(val);
    // });
    const vals_list1 = state.app.get('subscription');
    let vals1;
    if (!vals_list1) vals1 = [];
    if (!!vals_list1) vals1 = vals_list1.toJS();
    const vals_list2 = state.app.get('label_stock');
    let vals2;
    if (!vals_list2) vals2 = [];
    if (!!vals_list2) vals2 = vals_list2.toJS();
    return [vals1, vals2].map((vals, index) => {
        vals = vals.map(val => {
            return (
                val &&
                new FeedsSideBarEntity({
                    repository: val,
                })
            );
        });
        return new FeedsSideBarEntities({
            title: [tt('g.subscribed_user'), tt('g.subscribed_label')][index],
            items: vals,
        });
    });
};

export const getRecommendSideBarMenu = state => {
    const vals_list = state.app.get('recommend_side_bar_menu');
    if (!vals_list) return [];
    const vals = vals_list.toJS();
    return vals.map(val => {
        val.items = val.items.map(item => {
            return new SideBarEntity(item);
        });
        return new SideBarEntities(val);
    });
};

export const getLabelDetailSideBarMenu = state => {
    const vals_list = state.app.get('label_detail_side_bar_menu');
    if (!vals_list) return [];
    const vals = vals_list.toJS();
    return vals.map(val => {
        val.items = val.items.map(item => {
            return new SideBarEntity(item);
        });
        return new SideBarEntities(val);
    });
};

export const homeIndexPageLoading = state => {
    if (!browserHistory) return true;
    if (browserHistory.getCurrentLocation().pathname !== '/') return false;
    const loading = state.app.get('loading');
    const list_model = state.content.get('home_content');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const trendIndexPageLoading = state => {
    if (!browserHistory) return true;
    if (trendRoute.isValidPath(browserHistory.getCurrentLocation().pathname))
        return false;
    const loading = state.app.get('loading');
    const list_model = state.label.get('trend_content');
    const list_model2 = state.label.get('trend_label');
    if (!list_model || list_model2) return true;
    const model = list_model.toJS();
    const model2 = list_model2.toJS();
    if (!model || model2) return true;
    return loading && model.length && model2.length == 0;
};

export const usersRecommendPageLoading = state => {
    if (!browserHistory) return true;
    if (browserHistory.getCurrentLocation().pathname !== '/users/recommend')
        return false;
    const loading = state.app.get('loading');
    const list_model = state.user.get('home_content');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const feedIndexPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!feedsRoute.isValidPath(pathname)) return false;
    const section = feedsRoute.params_value('section', pathname);
    if (!(section == '' || !section || section == 'disscussions')) return false;
    const loading = state.app.get('loading');
    const list_model = state.content.get('feed_content');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const feedIndexNewestPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!feedsRoute.isValidPath(pathname)) return false;
    const section = feedsRoute.params_value('section', pathname);
    if (section == 'newests') return false;
    const loading = state.app.get('loading');
    const list_model = state.content.get('feed_content');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const searchPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!searchRoute.isValidPath(pathname)) return false;
    const section = searchRoute.params_value('section', pathname);
    if (section != '' && section != 'contents') return false;
    const loading = state.app.get('loading');
    const list_model = state.search.get('search_content');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const searchUserPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!searchRoute.isValidPath(pathname)) return false;
    const section = searchRoute.params_value('section', pathname);
    if (section != 'users') return false;
    const loading = state.app.get('loading');
    const list_model = state.search.get('search_user');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const searchLabelPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!searchRoute.isValidPath(pathname)) return false;
    const section = searchRoute.params_value('section', pathname);
    if (section != 'labels') return false;
    const loading = state.app.get('loading');
    const list_model = state.search.get('search_label');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const contentShowPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!contentShowRoute.isValidPath(pathname)) return false;
    const id = contentShowRoute.params_value('id', pathname);
    const loading = state.app.get('loading');
    const list_model = state.content.get('show_content');
    const model = list_model.toJS();
    if (!model || Object.keys(model).length == 0) return true;
    return loading && model.id != id;
};

export const contentShowRelateLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!contentShowRoute.isValidPath(pathname)) return false;
    const id = contentShowRoute.params_value('id', pathname);
    const loading = state.app.get('loading');
    const list_model = state.content.get('show_content_relate');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.length == 0;
};

export const userShowPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const loading = state.app.get('loading');
    const list_model = state.user.get('show_user');
    const model = list_model.toJS();
    if (!model) return true;
    return loading && model.id != id;
};

export const userShowContentsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (!(section == 'blog' || section == '')) return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.user.get('user_content');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].UserId != id;
};

export const userShowCommentsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (section != 'comments' && section != '') return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.user.get('user_comment');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].UserId != id;
};

export const userShowRequestsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (section != 'requests' && section != '') return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.request.get('user_request');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].VoteredId != id;
};

export const labelShowPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!labelShowRoute.isValidPath(pathname)) return false;
    const id = labelShowRoute.params_value('id', pathname);
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.label.get('detail_content');
    const model = list_model.toJS();
    if (!model) return true;
    return !model.content && loading;
};

export const requestShowPageLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!requestShowRoute.isValidPath(pathname)) return false;
    const id = requestShowRoute.params_value('id', pathname);
    const loading = state.app.get('loading');
    const list_model = state.request.get('detail_content');
    const model = list_model.toJS();
    if (!model) return true;
    return !model.content && loading;
};

export const userShowSendRequestsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (section != 'sent' && section != '') return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.user.get('user_send_request');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].VoteredId != id;
};

export const userShowAcceptedRequestsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (section != 'solved' && section != '') return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.user.get('user_accepted_request');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].VoteredId != id;
};

export const userShowUnAcceptedRequestsLoading = state => {
    if (!browserHistory) return true;
    const pathname = browserHistory.getCurrentLocation().pathname;
    if (!userShowRoute.isValidPath(pathname)) return false;
    const id = userShowRoute.params_value('id', pathname);
    const section = userShowRoute.params_value('section', pathname);
    if (section != 'unsolved' && section != '') return false;
    const loading = state.app.get('loading');
    if (!loading) return false;
    const list_model = state.user.get('user_unaccepted_request');
    const model = list_model.toJS();
    if (!model) return true;
    if (model.length == 0 && loading) return true;
    return loading && model[0].VoteredId != id;
};
