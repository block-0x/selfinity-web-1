import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import { DetailModel, DetailModels, HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';
import { Enum, defineEnum } from '@extension/Enum';

// Action constants
export const SET_DETAIL = 'label/SET_DETAIL';
export const ADD_DETAIL = 'label/ADD_DETAIL';
export const GET_MORE_DETAIL = 'label/GET_MORE_DETAIL';
export const SET_HOME_LABEL = 'label/SET_HOME_LABEL';
export const SET_HOME_LABEL_HISTORY = 'label/SET_HOME_LABEL_HISTORY';
export const SET_HOME_LABEL_RELATE = 'label/SET_HOME_LABEL_RELATE';
export const SHOW_CUSTOMIZE_EDIT = 'label/SHOW_CUSTOMIZE_EDIT';
export const HIDE_CUSTOMIZE_EDIT = 'label/HIDE_CUSTOMIZE_EDIT';
export const STOCK = 'label/STOCK';
export const UNSTOCK = 'label/UNSTOCK';
export const SET_TREND = 'label/SET_TREND';
export const ADD_TREND = 'label/ADD_TREND';
export const GET_MORE_TREND = 'label/GET_MORE_TREND';
export const SET_TREND_CONTENT = 'label/SET_TREND_CONTENT';
export const CLEAN_TREND_CONTENT = 'label/CLEAN_TREND_CONTENT';
export const ADD_TREND_CONTENT = 'label/ADD_TREND_CONTENT';
export const FETCH_TREND_CONTENT = 'label/FETCH_TREND_CONTENT';
export const GET_MORE_TREND_CONTENT = 'label/GET_MORE_TREND_CONTENT';
export const SET_SHOW_RELATE = 'content/SET_SHOW_RELATE';
export const FETCH_SHOW_RELATE = 'content/FETCH_SHOW_RELATE';

const defaultState = fromJS({
    detail_content: Map({}),
    home_label: List([]),
    home_label_history: List([]),
    home_label_relate: List([]),
    show_customize_edit_modal: false,
    trend_label: List([]),
    show_relate_label: List([]),
    trend_content: List([]),
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;
    switch (action.type) {
        case SET_DETAIL: {
            if (!action.payload.detailModels) return state;
            return state.set(
                'detail_content',
                Map({
                    key: action.payload.detailModels.key,
                    content: action.payload.detailModels.content,
                    items: List(
                        action.payload.detailModels.items.map(item => {
                            return Map(item);
                        })
                    ),
                })
            );
        }
        case ADD_DETAIL: {
            if (!action.payload.detailModels) return state;
            let before = state.get('detail_content');
            before = before.toJS();
            before.items[0] = before.items[0].contents.concat(
                action.payload.detailModels.items[0].contents
            );
            return state.set('detail_content', Map(before));
        }
        case SET_HOME_LABEL: {
            if (!action.payload.homeLabels) return state;
            return state.set(
                'home_label',
                List(
                    action.payload.homeLabels.map(val => {
                        return Map(val);
                    })
                )
            );
        }
        case SET_HOME_LABEL_HISTORY: {
            if (!action.payload.homeLabels) return state;
            return state;
        }
        case SET_HOME_LABEL_RELATE: {
            if (!action.payload.homeLabels) return state;
            return state;
        }

        case SHOW_CUSTOMIZE_EDIT: {
            return state.merge({
                show_customize_edit_modal: true,
            });
        }

        case HIDE_CUSTOMIZE_EDIT:
            return state.merge({
                show_customize_edit_modal: false,
            });

        case SET_TREND: {
            const { labels } = action.payload;
            if (!labels) return state;
            if (labels.length == 0) return state;
            return state.set('trend_label', List(labels));
        }

        case SET_TREND_CONTENT: {
            const { contents } = action.payload;
            if (!contents) return state;
            if (contents.length == 0) return state;
            return state.set(
                'trend_content',
                List(
                    contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case CLEAN_TREND_CONTENT: {
            return state.set('trend_content', List());
        }

        case ADD_TREND_CONTENT: {
            const { contents } = action.payload;
            if (!contents) return state;
            if (contents.length == 0) return state;
            let before = state.get('trend_content');
            return state.set(
                'trend_content',
                before.concat(
                    List(
                        contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case SET_SHOW_RELATE: {
            if (!payload.labels) return state;
            return state.set('show_relate_label', List(action.payload.labels));
        }

        default:
            return state;
    }
}

// Action creators

export const stock = payload => ({
    type: STOCK,
    payload,
});

export const unstock = payload => ({
    type: UNSTOCK,
    payload,
});

export const showCustomizeEdit = payload => ({
    type: SHOW_CUSTOMIZE_EDIT,
    payload,
});

export const hideCustomizeEdit = payload => ({
    type: HIDE_CUSTOMIZE_EDIT,
    payload,
});

export const setDetail = payload => ({
    type: SET_DETAIL,
    payload,
});

export const addDetail = payload => ({
    type: ADD_DETAIL,
    payload,
});

export const getMoreDetail = payload => ({
    type: GET_MORE_DETAIL,
    payload,
});

export const setHomeLabel = payload => ({
    type: SET_HOME_LABEL,
    payload,
});

export const setHomeLabelHistory = payload => ({
    type: SET_HOME_LABEL_HISTORY,
    payload,
});

export const setHomeLabelRelate = payload => ({
    type: SET_HOME_LABEL_RELATE,
    payload,
});

export const setTrend = payload => ({
    type: SET_TREND,
    payload,
});

export const addTrend = payload => ({
    type: ADD_TREND,
    payload,
});

export const getMoreTrend = payload => ({
    type: GET_MORE_TREND,
    payload,
});

export const setTrendContent = payload => ({
    type: SET_TREND_CONTENT,
    payload,
});

export const cleanTrendContent = payload => ({
    type: CLEAN_TREND_CONTENT,
    payload,
});

export const fetchTrendContent = payload => ({
    type: FETCH_TREND_CONTENT,
    payload,
});

export const addTrendContent = payload => ({
    type: ADD_TREND_CONTENT,
    payload,
});

export const getMoreTrendContent = payload => ({
    type: GET_MORE_TREND_CONTENT,
    payload,
});

export const setShowRelate = payload => ({
    type: SET_SHOW_RELATE,
    payload,
});

export const fetchShowRelate = payload => ({
    type: FETCH_SHOW_RELATE,
    payload,
});

export const getDetail = state => {
    const val_map = state.label.get('detail_content');
    const val = val_map.toJS();
    if (!Object.keys(val).length) return;
    return new DetailModels({
        key: val.key,
        content: val.content,
        items: val.items.map(item => {
            return new DetailModel(item);
        }),
    });
};

export const getDetailLength = state => {
    const val_map = state.label.get('detail_content');
    const val = val_map.toJS();
    if (!Object.keys(val).length) return 0;
    if (!(val.items instanceof Array)) return 0;
    return val.items.length;
};

export const getTrendContent = state => {
    const val = state.label.get('trend_content');
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.filter(item => !!item).map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getTrendContentLength = state => {
    const val = state.label.get('trend_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    return home_models.length;
};

export const getShowRelateLabel = state => {
    const val_map = state.label.get('show_relate_label');
    const val = val_map.toJS();
    return val;
};

export const getHomeLabel = state => {
    const val_map = state.label.get('home_label');
    const val = val_map.toJS();
    return val;
};

export const isStocked = (state, label) => {
    let val = state.auth.get('current_user');
    if (!val) return false;
    val = val.toJS();
    if (!label) return false;
    if (!label.LabelStocks) return false;
    if (!(label.LabelStocks instanceof Array)) return false;
    return label.LabelStocks.filter(item => item.UserId == val.id).length > 0;
};
