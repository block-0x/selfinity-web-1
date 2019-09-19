import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';
import {
    userShowRoute,
    campaignSpreadShowRoute,
} from '@infrastructure/RouteInitialize';

const SETTING_MENU = defineEnum({
    // General: {
    //     rawValue: 0,
    //     value: () => tt('g.app_settings'),
    //     url: '/',
    // },
    // Notif: {
    //     rawValue: 1,
    //     value: () => tt('g.notification'),
    //     url: '/',
    // },
    // History: {
    //     rawValue: 2,
    //     value: () => tt('g.histories'),
    //     url: '/',
    // },
    Edit: {
        rawValue: 1,
        value: () => tt('g.user_edit'),
        url: id =>
            userShowRoute.getPath({
                params: {
                    id,
                    section: 'edit',
                },
            }),
    },
    Welcome: {
        rawValue: 2,
        value: () => tt('g.what_selfinity'),
        url: '/welcome',
    },
    // Invite: {
    //     rawValue: 3,
    //     value: () => tt('g.invite_code'),
    //     url: id =>
    //         userShowRoute.getPath({
    //             params: {
    //                 id,
    //                 section: 'invite',
    //             },
    //         }),
    // },
    // SnsSpreadCampaign: {
    //     rawValue: 4,
    //     value: () => tt('g.sns_spread_campaign'),
    //     url: '/campaign/spread',
    // },
    // FAQ: {
    //     rawValue: 4,
    //     value: () => tt('g.faqs'),
    //     url: '/FAQ',
    // },
    Term: {
        rawValue: 5,
        value: () => tt('g.terms'),
        url: '/term',
    },
    Privacy: {
        rawValue: 6,
        value: () => tt('g.privacy_policy'),
        url: '/privacy',
    },
    Contact: {
        rawValue: 7,
        value: () => tt('g.contact'),
        url: '/contact',
    },
    ChangePassword: {
        rawValue: 8,
        value: () => tt('g.change_password'),
        url: '/session/send/confirmation/password/delete',
        //MEMO: see onclick
    },
    Logout: {
        rawValue: 8,
        value: () => tt('g.logout'),
        url: '/',
        //MEMO: see onclick
    },
    Delete: {
        rawValue: 9,
        value: () => tt('g.quit'),
        url: null, //'/user/delete/confirm',
        //MEMO: see onclick
    },
});

export default SETTING_MENU;
