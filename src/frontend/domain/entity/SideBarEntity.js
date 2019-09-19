import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import ope from '@extension/operator';
import {
    userShowRoute,
    labelShowRoute,
    feedsRoute,
    homeIndexRoute,
    usersRecommendRoute,
    trendRoute,
} from '@infrastructure/RouteInitialize';
import { browserHistory } from 'react-router';
import tt from 'counterpart';

export class SideBarEntity extends Entity {
    constructor({ menu, toAnchor, image }) {
        super();
        this.menu = menu || '';
        this.toAnchor = toAnchor || null;
        this.image = image || '';
    }

    onClick(e) {
        if (e) e.preventDefault();
    }

    get url() {
        return this.toAnchor;
    }

    toJSON() {
        return {
            menu: this.menu,
            toAnchor: this.toAnchor,
            image: this.image,
        };
    }
}

export class SideBarEntities extends Entity {
    constructor({ title, items }) {
        super();
        this.title = title || '';
        this.items = items || [];
        this.toAnchor = items.length > 0 ? items[0].toAnchor || null : null;
        this.show = true;
    }

    toggle() {
        this.show = !this.show;
    }

    set items(items) {
        this._items = items;
    }

    get items() {
        return this.show ? this._items : [];
    }

    toJSON() {
        return {
            items: this.items.map(item => {
                return item.toJSON();
            }),
            title: this.title,
        };
    }
}

export class FeedsSideBarEntity extends SideBarEntity {
    constructor({ repository }) {
        let menu;
        let image;
        switch (true) {
            case ope.isLabel(repository):
                menu = repository.title;
                break;
            case ope.isUser(repository):
                menu = repository.nickname;
                image = repository.picture_small;
                break;
            default:
                menu = '';
        }
        super({
            menu,
            toAnchor: repository.id,
            image,
        });
        this.repository = repository;
    }

    get url() {
        if (!this.repository) return feedsRoute.getPath();
        switch (true) {
            case ope.isLabel(this.repository):
                return labelShowRoute.getPath({
                    params: {
                        id: this.repository.id,
                    },
                });
            case ope.isUser(this.repository):
                return userShowRoute.getPath({
                    params: {
                        id: this.repository.id,
                    },
                });
            default:
                return feedsRoute.getPath();
        }
    }
}

export class FeedsSideBarEntities extends SideBarEntities {
    constructor({ title, items }) {
        super({
            title,
            items,
        });
    }
}

export const menuSection = defineEnum({
    Home: {
        rawValue: 0,
        value: 'Home',
        string: () => tt('g.home'),
        image: 'home',
        link: '/', //homeIndexRoute.path,
        active: pathname =>
            !!homeIndexRoute ? homeIndexRoute.isValidPath(pathname) : false,
    },
    Trend: {
        rawValue: 1,
        value: 'Trend',
        string: () => tt('g.trend'),
        image: 'trend',
        link: '/trends',
        active: pathname =>
            !!trendRoute ? trendRoute.isValidPath(pathname) : false,
    },
    // Events: {
    //     rawValue: 2,
    //     value: 'Events',
    //     image: 'event',
    //     link: '/events',
    // },
    Feed: {
        rawValue: 2,
        value: 'Feed',
        string: () => tt('g.feed'),
        image: 'feed',
        link: '/feeds', //feedsRoute.path,
        active: pathname =>
            !!feedsRoute ? feedsRoute.isValidPath(pathname) : false,
    },
    Mypage: {
        rawValue: 3,
        value: 'MyPage',
        string: () => tt('g.mypage'),
        image: 'noimage',
        link: id => userShowRoute.getPath({ params: { id } }),
        active: (id, pathname) =>
            !!userShowRoute
                ? userShowRoute.isValidPathWithParams(pathname, { id })
                : false,
    },
    Border3: {
        rawValue: 3,
        value: 'Border',
    },
});

export const aboutMenu = defineEnum({
    About: {
        rawValue: 0,
        value: 'About',
        string: () => tt('g.what_selfinity'),
        link: '/welcome', //welcomeRoute.path,
    },
    Term: {
        rawValue: 1,
        value: 'Term',
        string: () => tt('g.terms'),
        link: '/term', //termRoute.path,
    },
    Privacy: {
        rawValue: 1,
        value: 'Privacy',
        string: () => tt('g.privacy_policy'),
        link: '/privacy', //privacyRoute.path,
    },
    Contact: {
        rawValue: 1,
        value: 'Contact',
        string: () => tt('g.contact'),
        link: '/contact', //privacyRoute.path,
    },
});

export const tripMenus = defineEnum({
    ForYou: {
        rawValue: 0,
        value: 'foryou',
        string: 'あなたへのおすすめ',
    },
    New: {
        rawValue: 1,
        value: 'new',
        string: '新着コンテンツ',
    },
    Essential: {
        rawValue: 2,
        value: 'essential',
        string: '必見コンテンツ',
    },
    Relate: {
        rawValue: 3,
        value: 'relate',
        string: '関連コンテンツ',
    },
});
