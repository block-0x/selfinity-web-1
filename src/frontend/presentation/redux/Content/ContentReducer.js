import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import {
    HomeModel,
    HomeModels,
    ShowModel,
    RelateModel,
    ContentShowModel,
    NewestModels,
} from '@entity';
import models from '@network/client_models';
import { Enum, defineEnum } from '@extension/Enum';
import {
    homeNewRoute,
    contentShowRoute,
    pickupModalRoute,
    pickupOpinionModalRoute,
} from '@infrastructure/RouteInitialize';
import safe2json from '@extension/safe2json';
import { browserHistory } from 'react-router';

// Action constants
export const GET_MORE_HOME = 'content/GET_MORE_HOME';
export const GET_MORE_FEED = 'content/GET_MORE_FEED';
export const GET_MORE_NEWEST = 'content/GET_MORE_NEWEST';
export const GET_MORE_COMMENT = 'content/GET_MORE_COMMENT';
export const SET_HOME = 'content/SET_HOME';
export const SET_HOME_HOTTEST = 'content/SET_HOME_HOTTEST';
export const SET_FEED = 'content/SET_FEED';
export const SET_NEWEST = 'content/SET_NEWEST';
export const SET_CACHES = 'content/SET_CACHES';
export const RESET_CACHES = 'content/SET_CACHES';
export const SET_DELETES = 'content/SET_DELETES';
export const RESET_DELETES = 'content/SET_DELETES';
export const ADD_HOME = 'content/ADD_HOME';
export const ADD_FEED = 'content/ADD_FEED';
export const ADD_NEWEST = 'content/ADD_NEWEST';
export const SET_NEW = 'content/SET_NEW';
export const RESET_NEW = 'content/RESET_NEW';
export const SET_RECOMMEND = 'content/SET_RECOMMEND';
export const ADD_RECOMMEND = 'content/ADD_RECOMMEND';
export const SET_SHOW = 'content/SET_SHOW';
export const SET_SHOW_RELATE = 'content/SET_SHOW_RELATE';
export const ADD_SHOW_COMMENT = 'content/ADD_SHOW_COMMENT';
export const SHOW_READ = 'constontent/SHOW_READ';
export const HIDE_READ = 'content/HIDE_READ';
export const SHOW_NEW = 'content/SHOW_NEW';
export const SHOW_NEW_FOR_EDIT = 'content/SHOW_NEW_FOR_EDIT';
export const SHOW_NEW_FOR_REQUEST = 'content/SHOW_NEW_FOR_REQUEST';
export const SHOW_NEW_CHEERING = 'content/SHOW_NEW_CHEERING';
export const SHOW_NEW_FOR_WANTED = 'content/SHOW_NEW_FOR_WANTED';
export const SHOW_NEW_REQUEST = 'content/SHOW_NEW_REQUEST';
export const SHOW_NEW_COMMENT = 'content/SHOW_NEW_COMMENT';
export const HIDE_NEW = 'content/HIDE_NEW';
export const SHOW_PICKUP = 'content/SHOW_PICKUP';
export const SHOW_PICKUP_OPINION = 'content/SHOW_PICKUP_OPINION';
export const HIDE_PICKUP = 'content/HIDE_PICKUP';
export const HIDE_PICKUP_OPINION = 'content/HIDE_PICKUP_OPINION';
export const SET_PICKUP = 'content/SET_PICKUP';
export const SET_PICKUP_OPINION = 'content/SET_PICKUP_OPINION';
export const UPLOAD_IMAGE = 'content/UPLOAD_IMAGE';
export const CREATE_CONTENT = 'content/CREATE_CONTENT';
export const BUILD_CONTENT_LABEL = 'content/BUILD_CONTENT_LABEL';
export const REMOVE_CONTENT_LABEL = 'content/REMOVE_CONTENT_LABEL';
export const BUILD_CONTENT_ASSIGN = 'content/BUILD_CONTENT_ASSIGN';
export const REMOVE_CONTENT_ASSIGN = 'content/REMOVE_CONTENT_ASSIGN';
export const UPDATE_CONTENT = 'content/UPDATE_CONTENT';
export const DELETE_CONTENT = 'content/DELETE_CONTENT';
export const SYNC_CONTENT = 'content/SYNC_CONTENT';

const defaultState = fromJS({
    home_content: List(),
    home_hottest_content: List(),
    feed_content: List(),
    newest_content: List(),
    new_content: Map(models.Content.build()),
    new_content_label: List(),
    new_content_assign: List(),
    recommend_content: List(),
    detail_content: Map(),
    show_content: Map(),
    show_content_relate: List(),
    pickup_content: List(),
    pickup_opinion: List(),
    show_read_modal: false,
    show_new_modal: false,
    show_pickup_modal: false,
    show_pickup_opinion_modal: false,
    caches: List([]),
    deletes: List([]),
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.merge({
                show_new_modal: homeNewRoute.isValidPath(
                    action.payload.pathname
                ),
                show_pickup_modal: pickupModalRoute.isValidPath(
                    action.payload.pathname
                ),
                show_pickup_opinion_modal: pickupOpinionModalRoute.isValidPath(
                    action.payload.pathname
                ),
                caches: List([]),
                deletes: List([]),
            });

        case SET_CACHES: {
            const contents = action.payload.contents;
            if (!(contents instanceof Array)) return state;
            if (contents.length == 0) return state;
            let before = state.get('caches') || List([]);
            before = before.filter(val => !contents.find(x => x.id == val.id));
            return state.set('caches', List(contents.map(val => Map(val))));
        }

        case RESET_CACHES: {
            return state.set('caches', List([]));
        }

        case SET_DELETES: {
            const contents = action.payload.contents;
            if (!(contents instanceof Array)) return state;
            if (contents.length == 0) return state;
            let before = state.get('deletes') || List([]);
            before = before.filter(val => !contents.find(x => x.id == val.id));
            return state.set('deletes', List(contents.map(val => Map(val))));
        }

        case RESET_DELETES: {
            return state.set('deletes', List([]));
        }

        case SET_HOME: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'home_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_PICKUP: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'pickup_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_PICKUP_OPINION: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'pickup_opinion',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_HOME_HOTTEST: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'home_hottest_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }
        case SET_FEED: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'feed_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }
        case SET_NEWEST: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            return state.set(
                'newest_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }
        case ADD_HOME: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            let before = state.get('home_content');
            return state.set(
                'home_content',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_SHOW_COMMENT: {
            if (!payload.contents) return state;
            if (payload.contents.length == 0) return state;
            let before = state.get('show_content');
            if (!before) return state;
            before = before.toJS();
            if (!!before.children_contents) {
                before.children_contents = before.children_contents.concat(
                    payload.contents
                );
            } else {
                before.children_contents = action.payload.contents;
            }
            return state.set('show_content', Map(before));
        }

        case ADD_FEED: {
            if (!action.payload.contents) return state;
            if (action.payload.contents.length == 0) return state;
            let before = state.get('feed_content');
            return state.set(
                'feed_content',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }
        case ADD_NEWEST: {
            let before = state.get('newest_content');
            before = before.toJS();
            before[0].items[0].contents = before[0].items[0].contents.concat(
                payload.contents[0].items[0].contents
            );
            return state.set('newest_content', List(before));
        }
        case SET_NEW: {
            if (!payload.contents) return state;
            return state.set('new_content', Map(action.payload.contents));
        }
        case SET_RECOMMEND: {
            if (!payload.contents) return state;
            return state.set(
                'recommend_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case ADD_RECOMMEND: {
            if (!payload.contents) return state;
            let before = state.get('recommend_content');
            return state.set(
                'recommend_content',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }
        case SET_SHOW: {
            if (!payload.content) return state;
            return state.set('show_content', Map(action.payload.content));
        }
        case SET_SHOW_RELATE: {
            if (!payload.contents) return state;
            return state.set(
                'show_content_relate',
                List(action.payload.contents)
            );
        }
        case GET_MORE_HOME: {
            return state;
        }

        case RESET_NEW: {
            return state.merge({
                new_content: Map(models.Content.build()),
                new_content_label: List(),
                new_content_assign: List(),
            });
        }

        case BUILD_CONTENT_LABEL: {
            if (!payload.label) return state;
            const labels = state.get('new_content_label');
            if (
                labels.toArray().filter(val => val.title == payload.label.title)
                    .length > 0
            )
                return state;
            try {
                return state.set(
                    'new_content_label',
                    labels.push(Map(safe2json(payload.label) || payload.label))
                );
            } catch (e) {
                return state.set(
                    'new_content_label',
                    labels.push(Map(payload.label))
                );
            }
        }

        case REMOVE_CONTENT_LABEL: {
            if (!payload.label) return state;
            const labels = state.get('new_content_label');
            const results = labels.map(val => {
                if (val.title != payload.label.title) return val;
            });
            return state.set('new_content_label', results);
        }

        case BUILD_CONTENT_ASSIGN: {
            if (!payload.user) return state;
            const users = state.get('new_content_assign');
            if (
                users
                    .toArray()
                    .filter(val => val.username == payload.user.username)
                    .length > 0
            )
                return state;
            try {
                return state.set(
                    'new_content_assign',
                    users.push(Map(safe2json(payload.user) || payload.user))
                );
            } catch (e) {
                return state.set(
                    'new_content_assign',
                    users.push(Map(payload.user))
                );
            }
        }

        case REMOVE_CONTENT_ASSIGN: {
            if (!payload.user) return state;
            const users = state.get('new_content_assign');
            const results = users.map(val => {
                if (val.username != payload.user.username) return val;
            });
            return state.set('new_content_assign', results);
        }

        case UPLOAD_IMAGE: {
            return state;
        }

        case CREATE_CONTENT: {
            return state;
        }

        case UPDATE_CONTENT: {
            return state;
        }

        case DELETE_CONTENT: {
            return state;
        }

        case SHOW_READ: {
            return state.merge({
                show_read_modal: true,
            });
        }

        case HIDE_READ:
            return state.merge({
                show_read_modal: false,
            });

        case SHOW_NEW_FOR_EDIT:
            if (!payload.content) return state;
            return state.merge({
                new_content: payload.content,
                show_new_modal: true,
            });

        case SHOW_NEW_FOR_REQUEST:
            if (payload.requests) {
                state = state.setIn(
                    ['new_content', 'Requests'],
                    payload.requests
                );
            }
            return state.merge({
                show_new_modal: true,
            });

        case SHOW_NEW: {
            return state.merge({
                show_new_modal: true,
            });
        }

        case SHOW_NEW_FOR_WANTED:
            state = state
                .setIn(['new_content', 'isOpinionWanted'], true)
                .setIn(['new_content', 'isRequestWanted'], false);

            return state.merge({
                show_new_modal: true,
            });

        case SHOW_NEW_COMMENT: {
            if (!payload.content || !payload.user) return state;
            let req = models.Content.build({
                UserId: payload.user.id,
                ParentId: payload.content.id,
                Labels: payload.content.Labels,
                Labelings: payload.content.Labelings,
            });
            req.User = payload.user;
            req.ParentContent = payload.content;
            state = state.set('new_content', Map(safe2json(req)));
            return state.merge({
                show_new_modal: true,
            });
        }

        case SHOW_NEW_CHEERING: {
            if (!payload.content || !payload.user) return state;
            let req = models.Content.build({
                UserId: payload.user.id,
                ParentId: payload.content.id,
                Labels: payload.content.Labels,
                Labelings: payload.content.Labelings,
                isCheering: true,
            });
            req.User = payload.user;
            req.ParentContent = payload.content;
            state = state.set('new_content', Map(safe2json(req)));
            return state.merge({
                show_new_modal: true,
            });
        }

        case SHOW_NEW_REQUEST: {
            if (!payload.user || !payload.target_user) return state;
            let req = models.Request.build({
                VoterId: payload.user.id,
                VoteredId: payload.target_user.id,
                TargetUser: payload.target_user,
                Voter: payload.user,
            });
            req.TargetUser = payload.target_user;
            req.Voter = payload.user;
            state = state.set('new_content', Map(safe2json(req)));
            return state.merge({
                show_new_modal: true,
            });
        }

        case HIDE_NEW:
            return state.merge({
                new_content: Map(models.Content.build()),
                new_content_label: List(),
                new_content_assign: List(),
                show_new_modal: false,
            });

        case SHOW_PICKUP: {
            return state.merge({
                show_pickup_modal: true,
            });
        }

        case HIDE_PICKUP:
            return state.merge({
                show_pickup_modal: false,
            });

        case SHOW_PICKUP_OPINION: {
            return state.merge({
                show_pickup_opinion_modal: true,
            });
        }

        case HIDE_PICKUP_OPINION:
            return state.merge({
                show_pickup_opinion_modal: false,
            });

        default:
            return state;
    }
}

// Action creators

export const setCaches = payload => ({
    type: SET_CACHES,
    payload,
});

export const resetCaches = payload => ({
    type: RESET_DELETES,
    payload,
});

export const setDeletes = payload => ({
    type: SET_CACHES,
    payload,
});

export const resetDeletes = payload => ({
    type: RESET_DELETES,
    payload,
});

export const setHome = payload => ({
    type: SET_HOME,
    payload,
});

export const setHomeHottest = payload => ({
    type: SET_HOME_HOTTEST,
    payload,
});

export const setNew = payload => ({
    type: SET_NEW,
    payload,
});

export const resetNew = payload => ({
    type: RESET_NEW,
    payload,
});

export const setFeed = payload => ({
    type: SET_FEED,
    payload,
});

export const getMoreFeed = payload => ({
    type: GET_MORE_FEED,
    payload,
});

export const setNewest = payload => ({
    type: SET_NEWEST,
    payload,
});

export const getMoreNewest = payload => ({
    type: GET_MORE_NEWEST,
    payload,
});

export const setShow = payload => ({
    type: SET_SHOW,
    payload,
});

export const addShowComment = payload => ({
    type: ADD_SHOW_COMMENT,
    payload,
});

export const buildContentLabel = payload => ({
    type: BUILD_CONTENT_LABEL,
    payload,
});

export const removeContentLabel = payload => ({
    type: REMOVE_CONTENT_LABEL,
    payload,
});

export const buildContentAssign = payload => ({
    type: BUILD_CONTENT_ASSIGN,
    payload,
});

export const removeContentAssign = payload => ({
    type: REMOVE_CONTENT_ASSIGN,
    payload,
});

export const setShowRelate = payload => ({
    type: SET_SHOW_RELATE,
    payload,
});

export const setRecommend = payload => ({
    type: SET_RECOMMEND,
    payload,
});

export const addHome = payload => ({
    type: ADD_HOME,
    payload,
});

export const addFeed = payload => ({
    type: ADD_FEED,
    payload,
});

export const addNewest = payload => ({
    type: ADD_NEWEST,
    payload,
});

export const addRecommend = payload => ({
    type: ADD_RECOMMEND,
    payload,
});

export const getMoreHome = payload => ({
    type: GET_MORE_HOME,
    payload,
});

export const getMoreComment = payload => ({
    type: GET_MORE_COMMENT,
    payload,
});

export const uploadImage = payload => ({
    type: UPLOAD_IMAGE,
    payload,
});

export const createContent = payload => ({
    type: CREATE_CONTENT,
    payload,
});

export const syncContent = payload => ({
    type: SYNC_CONTENT,
    payload,
});

export const updateContent = payload => ({
    type: UPDATE_CONTENT,
    payload,
});

export const deleteContent = payload => ({
    type: DELETE_CONTENT,
    payload,
});

export const showRead = payload => ({
    type: SHOW_READ,
    payload,
});

export const hideRead = payload => ({
    type: HIDE_READ,
    payload,
});

export const showNewRequest = payload => ({
    type: SHOW_NEW_REQUEST,
    payload,
});

export const showNewForWanted = payload => ({
    type: SHOW_NEW_FOR_WANTED,
    payload,
});

export const showNewForRequest = payload => ({
    type: SHOW_NEW_FOR_REQUEST,
    payload,
});

export const showNewComment = payload => ({
    type: SHOW_NEW_COMMENT,
    payload,
});

export const showNewCheering = payload => ({
    type: SHOW_NEW_CHEERING,
    payload,
});

export const showNewForEdit = payload => ({
    type: SHOW_NEW_FOR_EDIT,
    payload,
});

export const setPickup = payload => ({
    type: SET_PICKUP,
    payload,
});

export const setPickupOpinion = payload => ({
    type: SET_PICKUP_OPINION,
    payload,
});

export const showPickupModal = payload => ({
    type: SHOW_PICKUP,
    payload,
});

export const hidePickupModal = payload => ({
    type: HIDE_PICKUP,
    payload,
});

export const showPickupOpinionModal = payload => ({
    type: SHOW_PICKUP_OPINION,
    payload,
});

export const hidePickupOpinionModal = payload => ({
    type: HIDE_PICKUP_OPINION,
    payload,
});

export const showNew = payload => ({
    type: SHOW_NEW,
    payload,
});

export const hideNew = payload => ({
    type: HIDE_NEW,
    payload,
});

export const getHomeContent = state => {
    const val = state.content.get('home_content');
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.filter(item => !!item).map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getHomeHottestContent = state => {
    const val = state.content.get('home_hottest_content');
    return val.toJS();
};

export const getHomeContentLength = state => {
    const val = state.content.get('home_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    return home_models.length;
};

export const getShowContentCommentsLength = state => {
    const val = state.content.get('show_content');
    if (!val) return 0;
    let model = val.toJS();
    if (!model) return 0;
    if (!model.children_contents || !(model.children_contents instanceof Array))
        return 0;
    return model.children_contents.length;
};

export const getFeedContent = state => {
    const val = state.content.get('feed_content');
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.filter(item => !!item).map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getFeedContentLength = state => {
    const val = state.content.get('feed_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    return home_models.length;
};

export const getNewestContent = state => {
    const val = state.content.get('newest_content');
    if (!val)
        return [
            new HomeModels({
                items: [],
            }),
        ];
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getNewestContentLength = state => {
    const val = state.content.get('newest_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    if (!home_models[0]) return 0;
    if (!home_models[0].items) return 0;
    if (!home_models[0].items[0]) return 0;
    return home_models[0].items[0].contents.length;
};

export const getRecommendContent = state => {
    const val = state.content.get('recommend_content');
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.filter(item => !!item).map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getModalShowContent = state => {
    let val = state.content.get('show_content');
    return new ShowModel({
        content: val.toJS(),
    });
};

export const getShowContent = state => {
    let val = state.content.get('show_content');
    if (!val) return;
    const content = val.toJS();
    return new ContentShowModel({
        content: content,
        requests: content.Requests,
    });
};

export const getShowPrunedContent = state => {
    let val = state.content.get('show_content');
    if (!val) return;
    const content = val.toJS();
    return content;
};

export const getNewContent = state => {
    let val = state.content.get('new_content');
    return val.toJS();
};

export const getShowRelateContent = state => {
    let val = state.content.get('show_content_relate');
    return new RelateModel({
        contents: val.toJS(),
    });
};

export const getNewContentLabel = state => {
    const val = state.content.get('new_content_label');
    const labels = val.toJS();
    return labels;
};

export const getNewContentAssign = state => {
    const val = state.content.get('new_content_assign');
    const users = val.toJS();
    return users;
};

export const isShowAcceptButton = (repository, state) => {
    if (!repository) return false;
    const map = state.auth.get('current_user');
    if (!map) return false;
    const current_user = map.toJS();
    if (!current_user) return false;
    if (
        !repository.ParentContent ||
        // repository.isCheering ||
        repository.UserId == current_user.id
    )
        return false;
    return (
        repository.ParentContent.UserId == current_user.id ||
        repository.ParentContent.user_id == current_user.id
    );
};

export const isShowOpinionButton = (repository, state) => {
    if (!repository) return false;
    // const map = state.auth.get('current_user');
    // if (!map) return false;
    // const current_user = map.toJS();
    // if (!current_user) return false;
    return /*!!current_user.id &&*/ !state.app.get('show_new_modal');
};

export const getCache = (id, state) => {
    if (!id) return;
    const val = state.content.get('caches');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const getDelete = (id, state) => {
    if (!id) return;
    const val = state.content.get('deletes');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const bind = (content, state) => {
    if (!content) return;
    if (!content.id) return content;
    if (getDelete(content.id, state)) return null;
    return getCache(content.id, state) || content;
};
