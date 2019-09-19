import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import { HomeModel, HomeModels, DetailModel, DetailModels } from '@entity';
import tt from 'counterpart';
import { SideBarEntity, SideBarEntities } from '@entity/SideBarEntity';
import {
    userShowRoute,
    contentShowRoute,
} from '@infrastructure/RouteInitialize';
import Notification, { getOneSignalWindow } from '@network/notification';
import { UserRepository } from '@repository';

const userRepository = new UserRepository();
const notification = new Notification();

export default class AppUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *detectNotificationId({ payload: { pathname } }) {
        try {
            let id,
                OneSignal = getOneSignalWindow();
            if (process.env.BROWSER) {
                id = yield OneSignal.getUserId();
            }
            if (!id) return;
            const state = yield select(state =>
                state.app.get('user_preferences')
            );
            let preferences = state.toJS();
            preferences.notification_id = id;
            yield put(appActions.setUserPreferences(preferences));
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user) return;
            if (current_user.notification_id == id) return;
            yield userRepository.syncNotificationId({
                notification_id: id,
                current_user,
            });
            /*.catch(async e => {
                await put(appActions.addError({ error: e }));
            });*/
        } catch (e) {}
    }

    *hideAllModal({ payload }) {
        const state = yield select(state => state);
    }

    *setHomeSideBarMenu({ payload: { contents } }) {
        if (!contents) return;
        yield put(
            appActions.setHomeSideBarMenu({
                side_bar_menu: [
                    new SideBarEntities({
                        items: contents.map(
                            (home_models, index) =>
                                new SideBarEntity({
                                    menu: home_models.content.title,
                                    toAnchor: contentShowRoute.getPath({
                                        params: { id: home_models.content.id },
                                    }),
                                    // image: home_models.content.picture_small,
                                })
                        ),
                        title: tt('g.index'),
                    }),
                ],
            })
        );
    }

    *setUsersRecommendSideBarMenu({ payload: { contents } }) {
        if (!contents) return;
        yield put(
            appActions.setUsersRecommendSideBarMenu({
                side_bar_menu: [
                    new SideBarEntities({
                        items: contents.map(
                            (home_models, index) =>
                                new SideBarEntity({
                                    menu: home_models.content.nickname,
                                    toAnchor: userShowRoute.getPath({
                                        params: { id: home_models.content.id },
                                    }),
                                    image: home_models.content.picture_small,
                                })
                        ),
                        title: tt('g.index'),
                    }),
                ],
            })
        );
    }

    *setFeedSideBarMenu({ payload: { contents } }) {
        if (!contents) return;
        // const vals = contents.map(home_model => {
        //     home_model.items = home_model.items
        //         .filter(item => !!item)
        //         .map(item => {
        //             return new HomeModel(item);
        //         });
        //     return new HomeModels(home_model);
        // });

        yield put(
            appActions.setFeedSideBarMenu({
                side_bar_menu: contents.map(val => {
                    return val.section_entities;
                }),
            })
        );

        yield put(
            appActions.setSubscrition({
                subscription: contents.map(val => {
                    return val.section_entities;
                }),
            })
        );
    }

    *setRecommendSideBarMenu({ payload: { contents } }) {
        if (!contents) return;
        const vals = contents.map(home_model => {
            home_model.items = home_model.items
                .filter(item => !!item)
                .map(item => {
                    return new HomeModel(item);
                });
            return new HomeModels(home_model);
        });

        yield put(
            appActions.setRecommendSideBarMenu({
                side_bar_menu: vals.map(val => {
                    return val.section_entities;
                }),
            })
        );
    }

    *setLabelDetailSideBarMenu({ payload: { detailModels } }) {
        if (!detailModels) return;
        let val = detailModels;
        val.items = detailModels.items.filter(item => !!item).map(item => {
            return new DetailModel(item);
        });

        yield put(
            appActions.setLabelDetailSideBarMenu({
                side_bar_menu: [new DetailModels(val).section_entities],
            })
        );
    }
}
