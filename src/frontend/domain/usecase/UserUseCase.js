import UseCaseImpl from '@usecase/UseCaseImpl';
import { UserRepository } from '@repository';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import * as appActions from '@redux/App/AppReducer';
import * as userActions from '@redux/User/UserReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import AppUseCase from '@usecase/AppUseCase';
import {
    userShowRoute,
    feedsRoute,
    homeIndexRoute,
    usersRecommendRoute,
} from '@infrastructure/RouteInitialize';
import { browserHistory } from 'react-router';
import { FileEntity, FileEntities } from '@entity';
import data_config from '@constants/data_config';

const userRepository = new UserRepository();
const appUsecase = new AppUseCase();

export default class UserUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *initIndex({ payload: { pathname } }) {
        if (!usersRecommendRoute.isValidPath(pathname)) return;
        const stateIndex = yield select(state =>
            state.user.get('home_content')
        );
        if (!stateIndex) return;
        const indexContents = stateIndex.toJS();
        if (indexContents.length > 0) return;
        try {
            yield put(authActions.syncCurrentUser());

            const stateUser = yield select(state =>
                state.auth.get('current_user')
            );
            const current_user = !!stateUser && stateUser.toJS();
            yield put(appActions.fetchDataBegin());
            const data = !!current_user
                ? yield userRepository.getIndex({
                      user: current_user,
                  })
                : yield userRepository.getStatic({
                      user: current_user,
                  });
            if (data.length == 0) return;
            yield put(userActions.setHome({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreHome({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (usersRecommendRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const indexContentsLength = yield select(state =>
                    userActions.getHomeContentLength(state)
                );
                if (indexContentsLength == 0) return;
                const stateUser = yield select(state =>
                    state.auth.get('current_user')
                );
                const current_user = !!stateUser && stateUser.toJS();
                const loading = yield select(state =>
                    state.app.get('more_loading')
                );
                if (loading || indexContentsLength == 0) return;
                yield put(appActions.fetchMoreDataBegin());
                const data = !!current_user
                    ? yield userRepository.getIndex({
                          user: current_user,
                          offset: indexContentsLength,
                      })
                    : yield userRepository.getStatic({
                          user: current_user,
                          offset: indexContentsLength,
                      });
                if (data.length == 0) return;
                yield put(userActions.addHome({ contents: data }));
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initShow({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        try {
            const id = userShowRoute.params_value('id', pathname);
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .initShow({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(userActions.setShow({ user: result.user }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *initWanteds({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        try {
            const id = userShowRoute.params_value('id', pathname);
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getWanteds({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(userActions.setUserWanted({ contents: result.contents }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreWanteds({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        try {
            if (!userShowRoute.isValidPath(pathname)) return;
            const id = userShowRoute.params_value('id', pathname);
            const current_contents = yield select(state =>
                userActions.getUserWanted(state)
            );
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.indexContentsLength == 0)
                return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getWanteds({
                    id,
                    offset: current_contents.contents.length || 0,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(userActions.addUserWanted({ contents: result.contents }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *syncUser({ payload: { id } }) {
        const user = yield userRepository
            .getUser({
                id,
            })
            .catch(async e => {
                await put(appActions.addError({ error: e }));
            });
        yield put(
            !!user
                ? userActions.setCaches({ users: [user] })
                : userActions.setDeletes({
                      users: [models.User.build({ id })],
                  })
        );
    }

    *initContents({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        try {
            const id = userShowRoute.params_value('id', pathname);
            // const seciton = userShowRoute.params_value('section', pathname);
            // if (!!section && section != '' && section != '/' && section != 'contents') return;
            yield put(appActions.fetchDataBegin());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const result = yield userRepository
                .getContents({
                    id,
                    isMyAccount: !!current_user ? current_user.id == id : false,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.setUserContent({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreContents({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        try {
            if (!userShowRoute.isValidPath(pathname)) return;
            const id = userShowRoute.params_value('id', pathname);
            const current_contents = yield select(state =>
                userActions.getUserContent(state)
            );
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const result = yield userRepository
                .getContents({
                    id,
                    offset: current_contents.contents.length,
                    isMyAccount: !!current_user ? current_user.id == id : false,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserContent({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initComments({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        try {
            const id = userShowRoute.params_value('id', pathname);
            const section = userShowRoute.params_value('section', pathname);
            if (section !== 'comments') return;
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getComments({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.setUserComment({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreComments({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        try {
            const id = userShowRoute.params_value('id', pathname);
            const current_contents = yield select(state =>
                userActions.getUserComment(state)
            );
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getComments({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserComment({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initRequests({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const section = userShowRoute.params_value('section', pathname);
        if (section !== 'requests') return;
        try {
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getRequests({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(appActions.fetchDataEnd());
            yield put(
                userActions.setUserRequest({ requests: result.requests })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *getMoreRequests({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const current_contents = yield select(state =>
            userActions.getUserRequest(state)
        );
        try {
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getRequests({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserRequest({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initSendRequests({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const section = userShowRoute.params_value('section', pathname);
        if (section !== 'sent') return;
        try {
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getSendRequests({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(appActions.fetchDataEnd());
            yield put(
                userActions.setUserSendRequest({ requests: result.requests })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *getMoreSendRequests({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const current_contents = yield select(state =>
            userActions.getUserSendRequest(state)
        );
        try {
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getSendRequests({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserSendRequest({ contents: result.contents })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initAcceptedRequests({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const section = userShowRoute.params_value('section', pathname);
        if (section !== 'solved') return;
        try {
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getAcceptedRequests({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.setUserAcceptedRequest({
                    requests: result.requests,
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreAcceptedRequests({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const current_contents = yield select(state =>
            userActions.getUserAcceptedRequest(state)
        );
        try {
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getAcceptedRequests({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserAcceptedRequest({
                    contents: result.contents,
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initUnAcceptedRequests({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const section = userShowRoute.params_value('section', pathname);
        if (section !== 'unsolved') return;
        try {
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getUnAcceptedRequests({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.setUserUnAcceptedRequest({
                    requests: result.requests,
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreUnAcceptedRequests({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const current_contents = yield select(state =>
            userActions.getUserUnAcceptedRequest(state)
        );
        try {
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getUnAcceptedRequests({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            yield put(
                userActions.addUserUnAcceptedRequest({
                    contents: result.contents,
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initHistories({ payload: { pathname } }) {
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const section = userShowRoute.params_value('section', pathname);
        if (section !== 'histories') return;
        try {
            yield put(appActions.fetchDataBegin());
            const result = yield userRepository
                .getHistories({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
        // yield put(userActions.setUserHistory({ contents: result.contents }));
    }

    *getMoreHistories({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!userShowRoute.isValidPath(pathname)) return;
        const id = userShowRoute.params_value('id', pathname);
        const current_contents = yield select(state =>
            userActions.getUserHistory(state)
        );
        try {
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || current_contents.contents.length == 0) return;
            yield put(appActions.fetchMoreDataBegin());
            const result = yield userRepository
                .getHistories({
                    id,
                    offset: current_contents.contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            // yield put(userActions.addUserHistory({ contents: result.contents }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *updateUser({ payload: { user } }) {
        yield put(appActions.screenLoadingBegin());
        const current_user = yield select(state =>
            authActions.getCurrentUser(state)
        );
        try {
            if (current_user.id != user.id) return;
            if (user.picture_small instanceof Map) {
                let model = FileEntities.build(user.picture_small.toJS());
                user.picture_small = yield model.upload({
                    xsize: data_config.small_picture_size,
                    ysize: data_config.small_picture_size,
                });
                user.picture_small = model.items[0].url;
            }
            const data = yield userRepository.updateUser(user);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(authActions.syncCurrentUserForce());
        yield put(userActions.syncUser({ id: current_user.id }));
        yield put(appActions.screenLoadingEnd());
    }

    *deleteUser({ payload }) {
        yield put(appActions.screenLoadingBegin());
        try {
            const user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const data = yield userRepository.deleteUser(user);
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(authActions.syncCurrentUser());
        yield put(appActions.screenLoadingEnd());
    }

    *invite({ payload: { invite_code } }) {
        yield put(appActions.screenLoadingBegin());
        try {
            const user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const data = yield userRepository.invite(user, invite_code);
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(authActions.syncCurrentUser());
        yield put(appActions.screenLoadingEnd());
    }
}
