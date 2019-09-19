import koa_router from 'koa-router';
import koa_body from 'koa-body';
import crypto from 'crypto';
import models from '@models';
import { esc, escAttrs } from '@models';
import coBody from 'co-body';
import {
    SessionHandler,
    IdentityHandler,
    AuthHandler,
    ContentHandler,
    LabelHandler,
    SearchHandler,
    HomeLabelHandler,
    TransactionHandler,
    RecommendHandler,
    RequestHandler,
    UserHandler,
    WalletHandler,
    BatchHandler,
    NotificationHandler,
} from '@handlers';
import { handleApiError } from '@extension/Error';
import Gateway from '@network/gateway';
// import log from '@extension/log';

const gateway = new Gateway();

const labelHandler = new LabelHandler();
const sessionHandler = new SessionHandler();
const identityHandler = new IdentityHandler();
const authHandler = new AuthHandler();
const contentHandler = new ContentHandler();
const searchHandler = new SearchHandler();
const homeLabelHandler = new HomeLabelHandler();
const transactionHandler = new TransactionHandler();
const recommendHandler = new RecommendHandler();
const requestHandler = new RequestHandler();
const userHandler = new UserHandler();
const walletHandler = new WalletHandler();
const notificationHandler = new NotificationHandler();
const batchHandler = new BatchHandler();

export default function ApiMiddleware(app) {
    const router = koa_router({ prefix: '/api/v1' });
    app.use(router.routes());
    const koaBody = koa_body();

    router.get('/confirm_email', koaBody, function*(ctx, next) {
        yield sessionHandler
            .handleConfirmEmail(this, ctx, next)
            .catch(async e => {
                await handleApiError(this, ctx, next, e);
                this.redirect('/notfound');
            });
    });

    router.get('/notification/email/stop', koaBody, function*(ctx, next) {
        yield sessionHandler
            .handleStopMailNotificationRequest(this, ctx, next)
            .catch(async e => {
                await handleApiError(this, ctx, next, e);
                this.redirect('/notfound');
            });
    });

    router.get('/delete_password_email', koaBody, function*(ctx, next) {
        yield sessionHandler
            .handleDeletePasswordConfirmEmail(this, ctx, next)
            .catch(async e => {
                await handleApiError(this, ctx, next, e);
                this.redirect('/notfound');
            });
    });

    router.post(
        '/session/confirmation/send/password/delete',
        koaBody,
        function*(ctx, next) {
            const results = yield gateway.run(this, ctx, next);
            if (!!results.error) {
                yield handleApiError(
                    results.router,
                    results.ctx,
                    results.next,
                    results.error
                );
                return;
            }
            yield sessionHandler
                .handleSendDeletePasswordEmail(
                    results.router,
                    results.ctx,
                    results.next
                )
                .catch(
                    async e =>
                        await handleApiError(
                            results.router,
                            results.ctx,
                            results.next,
                            e
                        )
                );
        }
    );

    // router.post('/notification/campaign/open', koaBody, function*(ctx, next) {
    //     const results = yield gateway.run(this, ctx, next);
    //     if (!!results.error) {
    //         yield handleApiError(
    //             results.router,
    //             results.ctx,
    //             results.next,
    //             results.error
    //         );
    //         return;
    //     }
    //     yield notificationHandler
    //         .handleOpenCampaignRequest(
    //             results.router,
    //             results.ctx,
    //             results.next
    //         )
    //         .catch(
    //             async e =>
    //                 await handleApiError(
    //                     results.router,
    //                     results.ctx,
    //                     results.next,
    //                     e
    //                 )
    //         );
    // });

    // router.post('/notification/campaign/open/call', koaBody, function*(
    //     ctx,
    //     next
    // ) {
    //     const results = yield gateway.run(this, ctx, next);
    //     if (!!results.error) {
    //         yield handleApiError(
    //             results.router,
    //             results.ctx,
    //             results.next,
    //             results.error
    //         );
    //         return;
    //     }
    //     yield notificationHandler
    //         .handleOpenCallRequest(results.router, results.ctx, results.next)
    //         .catch(
    //             async e =>
    //                 await handleApiError(
    //                     results.router,
    //                     results.ctx,
    //                     results.next,
    //                     e
    //                 )
    //         );
    // });

    router.post('/notification/campaign/fix_for_talk', koaBody, function*(
        ctx,
        next
    ) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield notificationHandler
            .handleFixForTalkRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/batch', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield batchHandler
            .handleBatchRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/batch/manual/daily/summary', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield batchHandler
            .handleDailySummaryRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/batch/manual/daily/opinion', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield batchHandler
            .handleDailyOpinionRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    // router.post('/session/mail/notification/token/init', koaBody, function*(
    //     ctx,
    //     next
    // ) {
    //     const results = yield gateway.run(this, ctx, next);
    //     if (!!results.error) {
    //         yield handleApiError(
    //             results.router,
    //             results.ctx,
    //             results.next,
    //             results.error
    //         );
    //         return;
    //     }
    //     yield sessionHandler
    //         .handleSetMailNotificationTokenRequest(
    //             results.router,
    //             results.ctx,
    //             results.next
    //         )
    //         .catch(
    //             async e =>
    //                 await handleApiError(
    //                     results.router,
    //                     results.ctx,
    //                     results.next,
    //                     e
    //                 )
    //         );
    // });

    router.post('/session/confirmation/send/email', koaBody, function*(
        ctx,
        next
    ) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleSendConfirmEmail(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/session/confirmation/resend/email', koaBody, function*(
        ctx,
        next
    ) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleReSendConfirmEmail(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/access_token/create', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleGenerateAccessTokenRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/session/confirmation/send/code', koaBody, function*(
        ctx,
        next
    ) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleSendConfirmCode(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/session/confirmation/resend/code', koaBody, function*(
        ctx,
        next
    ) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleReSendConfirmCode(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/session/confirmation/code', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleConfirmCode(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/identity', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield sessionHandler
            .handleCheckAccessTokenRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/search', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield searchHandler
            .handleSearchRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/search', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield searchHandler
            .handleSearchUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label/search', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield searchHandler
            .handleSearchLabelRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });
    router.post('/user/invite', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleInviteUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/account/privatekey', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield walletHandler
            .handleShowPrivateKeyRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/initialize_auth', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield authHandler
            .handleInitializeAuth(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/authenticate', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield authHandler
            .handleAuthenticateRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/set_password', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield identityHandler
            .handleSetPasswordRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/hottest', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetUserHottestContentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/static/hottest', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetStaticUserHottestContentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/create', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleCreateContentRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/update', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleUpdateContentRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/delete', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleDeleteContentRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/view', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleCreateViewHistoryRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/comments', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetCommentsRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/requests/home', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield requestHandler
            .handleHomeRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/unview', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleDeleteViewHistoryRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield requestHandler
            .handleGetOneRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/create', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleRequestingRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/update', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleUpdateRequestingRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/delete', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleUnRequestingRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/accept', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleAcceptContentForRequestingRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/deny', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDenyContentForRequestingRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/requests/accept', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleAcceptContentForRequestingsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/requests/deny', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDenyContentForRequestingsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/upvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleRequestUpvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/downvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleRequestDownvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/unupvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDeleteRequestUpvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/undownvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDeleteRequestDownvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.get('/labels/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleInitializeLabelsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.get('/contents/vectors/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleInitializeVectorsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/counts/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleInitializeCountsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/amount/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleInitializeContentAmountRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/upvotes/amount/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleInitializeUpvoteAmountRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/upvotes/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleInitializeUpvotesRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/labels/counts/init', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleInitializeCountsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    // router.get('/labels/vectors/init', koaBody, function*(ctx, next) {
    //     yield labelHandler.handleInitializeVectorsRequest(this, ctx, next).catch(async e => await handleApiError(this, ctx, next, e));
    // });
    router.post('/contents/static', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleStaticCommunicatesRecommendRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/contents/recommend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetCommunicatesRecommendRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/users/static', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleStaticContentsRecommendRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/users/recommend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetUserContentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/request/feeds', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetUserFeedsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/feeds', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetUserFeedsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/feeds/static', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetStaticUserFeedsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/recommends', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield recommendHandler
            .handleUserRecommendsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/recommends/contents/daily', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield recommendHandler
            .handleGetDailyContentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/recommends/opinions/daily', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield recommendHandler
            .handleGetDailyOpinionsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleGetLabelRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/labels/recommend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .getUserRecommendRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/labels/static/recommend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .getUserStaticRecommendRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label/recommend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleGetRelatesRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label/contents/trend', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleGetDisscussionsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/update', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleUpdateUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/delete', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleDeleteUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/sync', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleSyncUserRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/notification_id/sync', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleSyncNotificationIdRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/contents', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserContentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/wanteds', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserWantedsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/comments', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserCommentsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/requests', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserRequestsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/requests/sent', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserSendRequestsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/requests/accepted', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserSolvedRequestsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/requests/unaccepted', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserUnSolvedRequestsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/user/histories', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield userHandler
            .handleGetUserHistoriesRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield contentHandler
            .handleGetContentRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/home_labels', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield homeLabelHandler
            .handleGetHomeLabelsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/labels/home', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield homeLabelHandler
            .handleGetHomeLabelsRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/upvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleUpvoteRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/downvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDownvoteRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/unupvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDeleteUpvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/undownvote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleDeleteDownvoteRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/accept', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleAcceptionOpinionRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/content/unaccept', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleUnAcceptionOpinionRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/follow', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleFollowRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/unfollow', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleUnFollowRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label/stock', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleStockRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/label/unstock', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield labelHandler
            .handleUnStockRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/wallet/send', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield walletHandler
            .handleSendTokenRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/wallet/transfer', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield walletHandler
            .handleTransferTokenRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/wallet/claim', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield walletHandler
            .handleClaimRewardRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/wallet/bridge', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield walletHandler
            .handleBridgeTokenRequest(results.router, results.ctx, results.next)
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/is_vote', koaBody, function*(ctx, next) {
        const results = yield gateway.run(this, ctx, next);
        if (!!results.error) {
            yield handleApiError(
                results.router,
                results.ctx,
                results.next,
                results.error
            );
            return;
        }
        yield transactionHandler
            .handleCheckVoteCondtionRequest(
                results.router,
                results.ctx,
                results.next
            )
            .catch(
                async e =>
                    await handleApiError(
                        results.router,
                        results.ctx,
                        results.next,
                        e
                    )
            );
    });

    router.post('/csp_violation', function*() {
        let params;
        try {
            params = yield coBody(this);
        } catch (error) {
            console.log('-- /csp_violation error -->', error);
        }
        if (params && params['csp-report']) {
            const csp_report = params['csp-report'];
            const value = `${csp_report['document-uri']} : ${
                csp_report['blocked-uri']
            }`;
            console.log(
                '-- /csp_violation -->',
                value,
                '--',
                this.req.headers['user-agent']
            );
        } else {
            console.log(
                '-- /csp_violation [no csp-report] -->',
                params,
                '--',
                this.req.headers['user-agent']
            );
        }
        this.body = '';
    });
}
