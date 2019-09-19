import { RouteEntity, RouteEntities } from '@entity/RouteEntity';
import data_config from '@constants/data_config';
import config from '@constants/config';
import tt from 'counterpart';

export const homeIndexRoute = new RouteEntity({
    path: '/',
    page: 'HomeIndex',
    component: require('@components/pages/HomeIndex'),
});

export const usersRecommendRoute = new RouteEntity({
    path: '/users/recommend',
    page: 'UsersRecommend',
    component: require('@components/pages/UsersRecommend'),
});

export const homeNewRoute = new RouteEntity({
    path: '/new',
    page: 'HomeNewAlias',
    component: require('@components/pages/HomeNewAlias'),
});

export const pickupModalRoute = new RouteEntity({
    path: '/pickup/contents',
    page: 'PickupModalAlias',
    component: require('@components/pages/PickupModalAlias'),
});

export const pickupOpinionModalRoute = new RouteEntity({
    path: '/pickup/opinions',
    page: 'PickupOpinionModalAlias',
    component: require('@components/pages/PickupOpinionModalAlias'),
});

export const bridgeNewRoute = new RouteEntity({
    path: '/bridge/new',
    page: 'BridgeNewAlias',
    component: require('@components/pages/BridgeNewAlias'),
});

export const feedsRoute = new RouteEntity({
    path: '/feeds/:section?',
    page: 'FeedIndex',
    component: require('@components/pages/FeedIndex'),
    validate: {
        section: /(news|disscussions)/,
    },
});

export const trendRoute = new RouteEntity({
    path: '/trends/:id?',
    page: 'TrendIndex',
    component: require('@components/pages/TrendIndex'),
    validate: { id: data_config.trend_limit_regexp },
});

export const eventsRoute = new RouteEntity({
    path: '/events',
    page: 'EventIndex',
    component: require('@components/pages/EventIndex'),
});

export const recommendRoute = new RouteEntity({
    path: '/recommends',
    page: 'Recommend',
    component: require('@components/pages/RecommendIndex'),
});

export const campaignSpreadShowRoute = new RouteEntity({
    path: '/campaign/spread',
    page: 'CampaignSpreadShow',
    component: require('@components/pages/CampaignSpreadShow'),
});

export const searchRoute = new RouteEntity({
    path: '/search/:section?',
    page: 'Search',
    validate: {
        section: /(contents|users|labels)/,
    },
    component: require('@components/pages/SearchIndex'),
});

export const userShowRoute = new RouteEntity({
    path: '/user/:id/:section?',
    page: 'UserShow',
    component: require('@components/pages/UserShow'),
    validate: {
        id: /\d+/,
        section: /(posts|comments|transfers|settings|requests|solved|unsolved|sent|edit)/,
    },
});

export const labelShowRoute = new RouteEntity({
    path: '/label/:id',
    page: 'LabelShow',
    component: require('@components/pages/LabelShow'),
    validate: { id: /\d+/ },
});

export const contentShowRoute = new RouteEntity({
    path: '/content/:id',
    page: 'ContentShow',
    component: require('@components/pages/ContentShow'),
    validate: { id: /\d+/ },
});

export const requestShowRoute = new RouteEntity({
    path: '/request/:id',
    page: 'RequestShow',
    component: require('@components/pages/RequestShow'),
    validate: { id: /\d+/ },
    // redirects: [
    //     [
    //         /request\/\d+\/\?content=(\d+)/, '/content/$0',
    //     ],
    // ],
});

export const loginRoute = new RouteEntity({
    path: '/login',
    page: 'Login',
    component: require('@components/pages/Login'),
});

export const signupRoute = new RouteEntity({
    path: '/signup',
    page: 'Signup',
    component: require('@components/pages/Signup'),
});

export const confirmForPrivateKeyRoute = new RouteEntity({
    path: '/privatekey/confirm',
    page: 'LoginModalForPrivateKeyAlias',
    component: require('@components/pages/LoginModalForPrivateKeyAlias'),
});

export const confirmForDeleteRoute = new RouteEntity({
    path: '/user/delete/confirm',
    page: 'LoginModalForDeleteAlias',
    component: require('@components/pages/LoginModalForDeleteAlias'),
});

export const resendConfirmationCodeRoute = new RouteEntity({
    path: '/session/resend/confirmation/code',
    page: 'ResendConfirmationCodeAlias',
    component: require('@components/pages/ResendConfirmationCodeAlias'),
});

export const resendConfirmationMailRoute = new RouteEntity({
    path: '/session/resend/confirmation/mail',
    page: 'ResendConfirmationMailAlias',
    component: require('@components/pages/ResendConfirmationMailAlias'),
});

export const sendDeletePasswordConfirmationMailRoute = new RouteEntity({
    path: '/session/send/confirmation/password/delete',
    page: 'SendDeletePasswordConfirmationMailAlias',
    component: require('@components/pages/SendDeletePasswordConfirmationMailAlias'),
});

export const welcomeRoute = new RouteEntity({
    path: '/welcome',
    page: 'Welcome',
    component: require('@components/pages/Welcome'),
});

export const privacyRoute = new RouteEntity({
    path: '/privacy',
    page: 'Privacy',
    component: require('@components/pages/Privacy'),
});

export const faqRoute = new RouteEntity({
    path: '/FAQ',
    page: 'FAQ',
    component: require('@components/pages/FAQ'),
});

export const termRoute = new RouteEntity({
    path: '/term',
    page: 'Term',
    component: require('@components/pages/Term'),
});

export const contactRoute = new RouteEntity({
    path: '/contact',
    page: 'Contact',
    component: require('@components/pages/Contact'),
});

export const customizeRoute = new RouteEntity({
    path: '/customize',
    page: 'HomeLabelIndex',
    component: require('@components/pages/HomeLabelIndex'),
});

export const cmpTestRoute = new RouteEntity({
    path: '/test/components',
    page: 'CmpTest',
    component: require('@components/pages/CmpTest'),
});

export const notfoundRoute = new RouteEntity({
    path: '/notfound',
    page: 'NotFound',
    component: require('@components/pages/NotFound'),
});

// export const xssRoute = new RouteEntity({
//     path: '/xss/test',
//     page: 'XSSTest',
//     component: require('@components/pages/XSSTest'),
// });

export const routeEntities = new RouteEntities({
    items: [
        homeIndexRoute,
        homeNewRoute,
        // usersRecommendRoute,
        feedsRoute,
        trendRoute,
        pickupModalRoute,
        pickupOpinionModalRoute,
        // eventsRoute,
        // recommendRoute,
        searchRoute,
        userShowRoute,
        labelShowRoute,
        requestShowRoute,
        contentShowRoute,
        loginRoute,
        signupRoute,
        welcomeRoute,
        privacyRoute,
        // faqRoute,
        termRoute,
        // customizeRoute,
        confirmForDeleteRoute,
        // confirmForPrivateKeyRoute,
        // bridgeNewRoute,
        resendConfirmationCodeRoute,
        resendConfirmationMailRoute,
        sendDeletePasswordConfirmationMailRoute,
        contactRoute,
        cmpTestRoute,
        // campaignSpreadShowRoute,
    ],
    notfoundRoute,
});

export const getPageTitle = (pathname, state) => {
    const page = routeEntities.resolveRoute(pathname).page;
    let title = tt('pages.HomeIndex');
    if (page == contentShowRoute.page) {
        if (
            !!state.content.get('show_content') &&
            !!state.content.get('show_content').get('title')
        )
            title = tt(`pages.${contentShowRoute.page}`, {
                data: state.content.get('show_content').get('title'),
            });
    } else if (page == requestShowRoute.page) {
        if (
            !!state.request.get('detail_content') &&
            !!state.request.get('detail_content').get('content') &&
            !!state.request.get('detail_content').get('content').body
        )
            title = tt(`pages.${requestShowRoute.page}`, {
                data: String.prototype.cleaning_tag(
                    state.request.get('detail_content').get('content').body
                ),
            });
    } else if (page == labelShowRoute.page) {
        if (
            !!state.label.get('detail_content') &&
            !!state.label.get('detail_content').get('content') &&
            !!state.label.get('detail_content').get('content').title
        )
            title = tt(`pages.${labelShowRoute.page}`, {
                data: state.label.get('detail_content').get('content').title,
            });
    } else if (page == userShowRoute.page) {
        if (
            !!state.user.get('show_user') &&
            !!state.user.get('show_user').get('nickname') &&
            !!state.user.get('show_user').get('detail')
        )
            title = tt(`pages.${userShowRoute.page}`, {
                nickname: state.user.get('show_user').get('nickname'),
                detail: state.user.get('show_user').get('detail'),
            });
    } else if (page == trendRoute.page) {
        const id = trendRoute.params_value('id', pathname) || 1;
        if (!!state.label.get('trend_label').get(id - 1)) {
            title = tt(`pages.${trendRoute.page}`, {
                data: state.label.get('trend_label').get(id - 1).title,
            });
        }
    } else if (page == searchRoute.page) {
        if (!!state.search.get('keyword')) {
            title = tt(`pages.${searchRoute.page}`, {
                data: state.search.get('keyword'),
            });
        }
    } else {
        title = tt(`pages.${page}`, { fallback: tt('pages.HomeIndex') });
    }
    return title + ' | ' + config.APP_NAME;
};

export const getPageDescription = (pathname, state) => {
    const page = routeEntities.resolveRoute(pathname).page;
    let description = tt('descriptions.HomeIndex');
    if (page == contentShowRoute.page) {
        if (
            !!state.content.get('show_content') &&
            !!state.content.get('show_content').get('body')
        )
            description = tt(`descriptions.${contentShowRoute.page}`, {
                data: String.prototype.cleaning_tag(
                    state.content.get('show_content').get('body')
                ),
            });
    } else if (page == requestShowRoute.page) {
        if (
            !!state.request.get('detail_content') &&
            !!state.request.get('detail_content').get('content') &&
            !!state.request.get('detail_content').get('content').body
        )
            description = tt(`descriptions.${requestShowRoute.page}`, {
                data: String.prototype.cleaning_tag(
                    state.request.get('detail_content').get('content').body
                ),
            });
    } else if (page == labelShowRoute.page) {
        if (
            !!state.label.get('detail_content') &&
            !!state.label.get('detail_content').get('content') &&
            !!state.label.get('detail_content').get('content').title
        )
            description = tt(`descriptions.${labelShowRoute.page}`, {
                data: state.label.get('detail_content').get('content').title,
            });
    } else if (page == userShowRoute.page) {
        if (
            !!state.user.get('show_user') &&
            !!state.user.get('show_user').get('detail')
        )
            description = tt(`descriptions.${userShowRoute.page}`, {
                data: state.user.get('show_user').get('detail'),
            });
    } else if (page == trendRoute.page) {
        const id = trendRoute.params_value('id', pathname) || 1;
        if (!!state.label.get('trend_label').get(id - 1)) {
            description = tt(`descriptions.${trendRoute.page}`, {
                data: state.label.get('trend_label').get(id - 1).title,
            });
        }
    } else if (page == searchRoute.page) {
        if (!!state.search.get('keyword')) {
            description = tt(`descriptions.${searchRoute.page}`, {
                data: state.search.get('keyword'),
            });
        }
    } else {
        description = tt(`descriptions.${page}`, {
            fallback: tt('pages.HomeIndex'),
        });
    }
    return description;
};

// export default function initialize() {}
