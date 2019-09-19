import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import { HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';

// Action constants
export const SEARCH_CONTENT = 'search/SEARCH_CONTENT';
export const SET_RESULT = 'search/SET_RESULT';
export const GET_MORE_SEARCH_CONTENT = 'search/GET_MORE_SEARCH_CONTENT';
export const ADD_RESULT = 'search/ADD_RESULT';
export const SEARCH_USER = 'search/SEARCH_USER';
export const SEARCH_LABEL = 'search/SEARCH_LABEL';
export const SET_USER_RESULT = 'search/SET_USER_RESULT';
export const SET_LABEL_RESULT = 'search/SET_LABEL_RESULT';
export const GET_MORE_SEARCH_USER = 'search/GET_MORE_SEARCH_USER';
export const GET_MORE_SEARCH_LABEL = 'search/GET_MORE_SEARCH_LABEL';
export const ADD_USER_RESULT = 'search/ADD_USER_RESULT';
export const ADD_LABEL_RESULT = 'search/ADD_LABEL_RESULT';
export const SET_KEYWORD = 'search/SET_KEYWORD';
export const SET_USER_KEYWORD = 'search/SET_USER_KEYWORD';
export const SET_LABEL_KEYWORD = 'search/SET_LABEL_KEYWORD';

const defaultState = fromJS({
    keyword: '',
    user_keyword: '',
    search_content: List(),
    search_user: List(),
    search_label: List(),
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;

    switch (action.type) {
        case SET_KEYWORD: {
            let keyword;
            if (payload) {
                keyword = fromJS(payload.keyword);
            }
            return state.merge({
                keyword: keyword,
            });
        }

        case SET_USER_KEYWORD: {
            let keyword;
            if (payload) {
                keyword = fromJS(payload.keyword);
            }
            return state.merge({
                user_keyword: keyword,
            });
        }

        case SET_LABEL_KEYWORD: {
            let keyword;
            if (payload) {
                keyword = fromJS(payload.keyword);
            }
            return state.merge({
                label_keyword: keyword,
            });
        }

        case SEARCH_CONTENT: {
            return state;
        }

        case SET_RESULT: {
            return state.set(
                'search_content',
                List(action.payload.contents.map(val => Map(val)))
            );
        }

        case ADD_RESULT: {
            let before = state.get('search_content');
            before = before.toJS();
            before[0].items[0].contents = before[0].items[0].contents.concat(
                payload.contents[0].items[0].contents
            );
            return state.set('search_content', List(before));
        }

        case SET_USER_RESULT: {
            return state.set(
                'search_user',
                List(action.payload.contents.map(val => Map(val)))
            );
        }

        case SET_LABEL_RESULT: {
            return state.set(
                'search_label',
                List(action.payload.contents.map(val => Map(val)))
            );
        }

        case ADD_USER_RESULT: {
            let before = state.get('search_user');
            before = before.toJS();
            before[0].items[0].contents = before[0].items[0].contents.concat(
                payload.contents[0].items[0].contents
            );
            return state.set('search_user', List(before));
        }

        case ADD_LABEL_RESULT: {
            let before = state.get('search_label');
            before = before.toJS();
            before[0].items[0].contents = before[0].items[0].contents.concat(
                payload.contents[0].items[0].contents
            );
            return state.set('search_label', List(before));
        }

        default:
            return state;
    }
}

// Action creators

export const searchContent = payload => ({
    type: SEARCH_CONTENT,
    payload,
});

export const getMoreSearchContent = payload => ({
    type: GET_MORE_SEARCH_CONTENT,
    payload,
});

export const setResult = payload => ({
    type: SET_RESULT,
    payload,
});

export const addResult = payload => ({
    type: ADD_RESULT,
    payload,
});

export const searchUser = payload => ({
    type: SEARCH_USER,
    payload,
});

export const getMoreSearchUser = payload => ({
    type: GET_MORE_SEARCH_USER,
    payload,
});

export const setUserResult = payload => ({
    type: SET_USER_RESULT,
    payload,
});

export const addUserResult = payload => ({
    type: ADD_USER_RESULT,
    payload,
});

export const searchLabel = payload => ({
    type: SEARCH_LABEL,
    payload,
});

export const getMoreSearchLabel = payload => ({
    type: GET_MORE_SEARCH_LABEL,
    payload,
});

export const setLabelResult = payload => ({
    type: SET_LABEL_RESULT,
    payload,
});

export const addLabelResult = payload => ({
    type: ADD_LABEL_RESULT,
    payload,
});

export const setKeyword = payload => ({
    type: SET_KEYWORD,
    payload,
});

export const setUserKeyword = payload => ({
    type: SET_USER_KEYWORD,
    payload,
});

export const setLabelKeyword = payload => ({
    type: SET_LABEL_KEYWORD,
    payload,
});

export const getSearchContent = state => {
    const val = state.search.get('search_content');
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

export const getSearchUser = state => {
    const val = state.search.get('search_user');
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

export const getSearchLabel = state => {
    const val = state.search.get('search_label');
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
