import UseCaseImpl from '@usecase/UseCaseImpl';
import { ContentRepository } from '@repository';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Set, Map, fromJS, List } from 'immutable';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import AppUseCase from '@usecase/AppUseCase';
import {
    contentShowRoute,
    feedsRoute,
    homeIndexRoute,
    homeNewRoute,
    pickupModalRoute,
    pickupOpinionModalRoute,
} from '@infrastructure/RouteInitialize';
import { browserHistory } from 'react-router';
import models from '@network/client_models';
import Notification from '@network/notification';
import tt from 'counterpart';
import data_config from '@constants/data_config';

const contentRepository = new ContentRepository();
const appUsecase = new AppUseCase();
const notification = new Notification();

export default class ContentUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *initIndex({ payload: { pathname } }) {
        if (
            !homeIndexRoute.isValidPath(pathname) &&
            !homeNewRoute.isValidPath(pathname)
        )
            return;
        const stateIndex = yield select(state =>
            state.content.get('home_content')
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
                ? yield contentRepository.getIndex({
                      user: current_user,
                  })
                : yield contentRepository.getStatic({
                      user: current_user,
                  });
            if (data.length == 0) return;
            yield put(contentActions.setHome({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *initHomeHottest({ payload: { pathname } }) {
        if (!homeIndexRoute.isValidPath(pathname)) return;
        const stateIndex = yield select(state =>
            state.content.get('home_hottest_content')
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
            const data = yield contentRepository.getStaticHottest({
                user: current_user,
            });
            // const data = !!current_user
            //     ? yield contentRepository.getHottest({
            //           user: current_user,
            //       })
            //     : yield contentRepository.getStaticHottest({
            //           user: current_user,
            //       });
            if (data.length == 0) return;
            yield put(contentActions.setHomeHottest({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *initFeed({ payload: { pathname } }) {
        const stateIndex = yield select(state =>
            state.content.get('feed_content')
        );
        const indexContents = stateIndex.toJS();
        if (indexContents.length > 0) return;
        if (feedsRoute.isValidPath(pathname)) {
            const section = feedsRoute.params_value('section', pathname);
            if (!(!section || section == '' || section == 'disscussions'))
                return;
            try {
                yield put(authActions.syncCurrentUser());

                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                yield put(appActions.fetchDataBegin());
                const data =
                    !!current_user || current_user != null
                        ? yield contentRepository.getFeed({
                              user: current_user,
                          })
                        : yield contentRepository.getStaticFeed({
                              limit: data_config.fetch_data_limit('S'),
                          });
                yield put(
                    contentActions.setFeed({ contents: data.homeModels })
                );
                if (!!current_user || current_user != null)
                    yield put(
                        appActions.setSubscription({
                            subscription: data.follows,
                        })
                    );
                if (!!current_user || current_user != null)
                    yield put(
                        appActions.setLabelStock({
                            labels: data.labelStocks.map(val => val.Label),
                        })
                    );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
            yield put(appActions.fetchDataEnd());
        }
    }

    *getMoreFeed({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        const indexContentsLength = yield select(state =>
            contentActions.getFeedContentLength(state)
        );
        if (feedsRoute.isValidPath(pathname)) {
            const section = feedsRoute.params_value('section', pathname);
            if (!(!section || section == '' || section == 'disscussions'))
                return;
            try {
                yield put(authActions.syncCurrentUser());

                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                const loading = yield select(state =>
                    state.app.get('more_loading')
                );
                if (loading || indexContentsLength == 0) return;
                yield put(appActions.fetchMoreDataBegin());
                const data = !!current_user
                    ? yield contentRepository.getFeed({
                          user: current_user,
                          offset: indexContentsLength,
                      })
                    : yield contentRepository.getStaticFeed({
                          offset: indexContentsLength,
                          limit: data_config.fetch_data_limit('S'),
                      });
                yield put(
                    contentActions.addFeed({ contents: data.homeModels })
                );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initNewest({ payload: { pathname } }) {
        const stateIndex = yield select(state =>
            state.content.get('newest_content')
        );
        const indexContents = stateIndex.toJS();
        if (indexContents.length > 0) return;
        if (feedsRoute.isValidPath(pathname)) {
            const section = feedsRoute.params_value('section', pathname);
            if (section !== 'newests') return;
            try {
                yield put(authActions.syncCurrentUser());

                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                yield put(appActions.fetchDataBegin());
                const data = yield contentRepository.getStaticFeed({
                    isCommunicates: false,
                    limit: data_config.fetch_data_limit('M'),
                });
                yield put(
                    contentActions.setNewest({ contents: data.homeModels })
                );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
            yield put(appActions.fetchDataEnd());
        }
    }

    *getMoreNewest({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        const indexContentsLength = yield select(state =>
            contentActions.getNewestContentLength(state)
        );
        if (feedsRoute.isValidPath(pathname)) {
            const section = feedsRoute.params_value('section', pathname);
            if (section !== 'newests') return;
            try {
                yield put(authActions.syncCurrentUser());
                const loading = yield select(state =>
                    state.app.get('more_loading')
                );
                if (loading || indexContentsLength == 0) return;
                yield put(appActions.fetchMoreDataBegin());
                const data = yield contentRepository.getStaticFeed({
                    isCommunicates: false,
                    limit: data_config.fetch_data_limit('M'),
                    offset: indexContentsLength,
                });
                yield put(
                    contentActions.addNewest({ contents: data.homeModels })
                );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initShow({ payload: { pathname } }) {
        if (!contentShowRoute.isValidPath(pathname)) return;
        yield put(appActions.fetchDataBegin());
        const id = contentShowRoute.params_value('id', pathname);
        const result = yield contentRepository
            .initShow({
                id,
            })
            .catch(async e => {
                await put(appActions.addError({ error: e }));
            });

        yield put(appActions.fetchDataEnd());

        if (!result) return;

        yield put(contentActions.setShow({ content: result.content }));

        yield put(
            contentActions.setShowRelate({ contents: result.relate_contents })
        );
    }

    *syncContent({ payload: { id } }) {
        const content = yield contentRepository
            .getContent({
                id,
            })
            .catch(async e => {
                await put(appActions.addError({ error: e }));
            });

        yield put(
            !!content
                ? contentActions.setCaches({ contents: [content] })
                : contentActions.setDeletes({
                      contents: [models.Content.build({ id })],
                  })
        );
    }

    *getMoreHome({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (homeIndexRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const indexContentsLength = yield select(state =>
                    contentActions.getHomeContentLength(state)
                );
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
                    ? yield contentRepository.getIndex({
                          user: current_user,
                          offset: indexContentsLength,
                      })
                    : yield contentRepository.getStatic({
                          user: current_user,
                          offset: indexContentsLength,
                      });
                if (data.length == 0) return;
                yield put(contentActions.addHome({ contents: data }));
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *getMoreComment({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (contentShowRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const commentsLength = yield select(state =>
                    contentActions.getShowContentCommentsLength(state)
                );
                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                const current_content = yield select(state =>
                    contentActions.getShowContent(state)
                );
                const loading = yield select(state =>
                    state.app.get('more_loading')
                );
                if (loading || commentsLength == 0) return;
                yield put(appActions.fetchMoreDataBegin());
                const data = yield contentRepository.getComments({
                    content: current_content.content,
                    offset: commentsLength,
                });
                if (!data) return;
                if (data.contents.length == 0) return;
                yield put(
                    contentActions.addShowComment({
                        contents: data.contents,
                    })
                );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *getMoreRecommend({ payload }) {}

    *createContent({ payload: { content } }) {
        if (!content) return;
        yield put(appActions.screenLoadingBegin());
        try {
            const data = yield contentRepository.createContent(content);
            yield put(contentActions.hideNew());
            yield put(contentActions.resetNew());
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *updateContent({ payload: { content } }) {
        if (!content) return;
        yield put(appActions.screenLoadingBegin());
        try {
            const data = yield contentRepository.updateContent(content);
            yield put(contentActions.hideNew());
            yield put(contentActions.resetNew());
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *deleteContent({ payload: { content } }) {
        if (!content) return;
        try {
            const data = yield contentRepository.deleteContent(content);
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *uploadImage(payload) {
        super.uploadImage(payload);
    }

    *createViewHistory({ payload: { content } }) {
        if (!content) return;

        yield put(authActions.syncCurrentUser());

        const stateUser = yield select(state => state.auth.get('current_user'));
        if (!stateUser) return;
        const user = stateUser.toJS();
        try {
            const data = yield contentRepository.createViewHistory(
                content,
                user
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *initPickup({ payload: { pathname, query } }) {
        const stateIndex = yield select(state =>
            state.content.get('pickup_content')
        );
        const indexContents = stateIndex.toJS();
        if (indexContents.length > 0) return;
        if (pickupModalRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const date =
                    query.yy && query.mm && query.dd
                        ? new Date(
                              Number(query.yy),
                              Number(query.mm),
                              Number(query.dd)
                          )
                        : new Date();

                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                yield put(appActions.fetchDataBegin());
                const contents = yield contentRepository.getStaticSummary({
                    limit: data_config.fetch_data_limit('S'),
                    offset: 0,
                    date,
                });
                // const data =
                //     !!current_user || current_user != null
                //         ? yield contentRepository.getStaticSummary({
                //               user: current_user,
                //           })
                //         : yield contentRepository.getStaticSummary({
                //               limit: data_config.fetch_data_limit('S'),
                //           });
                yield put(contentActions.setPickup({ contents }));
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
            yield put(appActions.fetchDataEnd());
        }
    }

    *initPickupOpinion({ payload: { pathname, query } }) {
        const stateIndex = yield select(state =>
            state.content.get('pickup_opinion')
        );
        const indexContents = stateIndex.toJS();
        if (indexContents.length > 0) return;
        if (pickupOpinionModalRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const date =
                    query.yy && query.mm && query.dd
                        ? new Date(
                              Number(query.yy),
                              Number(query.mm),
                              Number(query.dd)
                          )
                        : new Date();

                const current_user = yield select(state =>
                    authActions.getCurrentUser(state)
                );
                yield put(appActions.fetchDataBegin());
                const contents = yield contentRepository.getStaticSummaryOpinion(
                    {
                        limit: data_config.fetch_data_limit('S'),
                        offset: 0,
                        date,
                    }
                );
                // const data =
                //     !!current_user || current_user != null
                //         ? yield contentRepository.getStaticSummary({
                //               user: current_user,
                //           })
                //         : yield contentRepository.getStaticSummary({
                //               limit: data_config.fetch_data_limit('S'),
                //           });
                yield put(contentActions.setPickupOpinion({ contents }));
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
            yield put(appActions.fetchDataEnd());
        }
    }
}
