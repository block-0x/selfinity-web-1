import RepositoryImpl from '@repository/RepositoryImpl';
import Cookies from 'js-cookie';
import models from '@network/client_models';
import { CONTENT_TYPE, SUBMIT_TYPE, ACTION_TYPE } from '@entity';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import { HomeModels, FeedModels, NewestModels } from '@entity';

export default class ContentRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    checkAction(action) {
        switch (action) {
            case ACTION_TYPE.LIKE.value:
            case ACTION_TYPE.LIKE.rawValue:
            case ACTION_TYPE.REPOST.value:
            case ACTION_TYPE.REPOST.rawValue:
            case ACTION_TYPE.POST.value:
            case ACTION_TYPE.POST.rawValue:
            case ACTION_TYPE.IMPORT.value:
            case ACTION_TYPE.IMPORT.rawValue:
                return true;
                break;
            default:
                throw new Error('request action is not correct');
        }
    }

    async getIndex({ user, offset, limit }) {
        const data = await super.apiCall('/api/v1/contents/recommend', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            user: safe2json(user),
        });
        return HomeModels.build(data.contents, offset || 0);
    }

    async getStatic({ offset, limit, locale, country }) {
        const data = await super.apiCall('/api/v1/contents/static', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            locale,
            country,
        });
        return HomeModels.build(data.contents, offset || 0);
    }

    async getHottest({ user, offset, limit }) {
        const data = await super.apiCall('/api/v1/contents/hottest', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            user: safe2json(user),
        });
        return data && data.contents;
    }

    async getStaticHottest({ offset, limit, locale, country }) {
        const data = await super.apiCall('/api/v1/contents/static/hottest', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            locale,
            country,
        });
        return data && data.contents;
    }

    async getFeed({ user, limit, offset }) {
        let data = await super.apiCall('/api/v1/feeds', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            user: safe2json(user),
        });
        data.homeModels = HomeModels.build(data.contents, offset || 0);
        return data;
    }

    async getStaticFeed({
        limit = data_config.fetch_data_limit('S'),
        offset,
        isCommunicates = true,
    }) {
        let data = await super.apiCall('/api/v1/feeds/static', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            isCommunicates,
        });
        if (isCommunicates) {
            data.homeModels = HomeModels.build(data.contents, offset || 0);
        } else {
            data.homeModels = NewestModels.build(data.contents);
        }
        return data;
    }

    async getComments({ content, offset, limit }) {
        const data = await super.apiCall('/api/v1/content/comments', {
            limit: limit || data_config.fetch_data_limit('M'),
            offset: Number(offset || 0),
            content: safe2json(content),
        });
        return data;
    }

    async createContent(content) {
        const data = await super.apiCall('/api/v1/content/create', {
            content: safe2json(content),
        });

        return data;
    }

    async initShow({ id, relate_limit = data_config.relate_limit }) {
        const data = await super.apiCall('/api/v1/content', {
            id,
            relate_limit,
        });

        return (
            data && {
                content: data.content,
                relate_contents: data.relate_contents,
            }
        );
    }

    async getContent({ id, relate_limit = 0 }) {
        const data = await super.apiCall('/api/v1/content', {
            id,
            relate_limit,
        });

        return data && data.content;
    }

    async updateContent(content) {
        const data = await super.apiCall('/api/v1/content/update', {
            content: safe2json(content),
        });

        return data;
    }

    async deleteContent(content) {
        const data = await super.apiCall('/api/v1/content/delete', {
            content: safe2json(content),
        });

        return data;
    }

    async createViewHistory(content, user) {
        const data = await super.apiCall('/api/v1/content/view', {
            content: safe2json(content),
            user: safe2json(user),
        });

        return data;
    }

    async getStaticSummary({ offset, limit, date }) {
        const data = await super.apiCall('/api/v1/recommends/contents/daily', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            date: date instanceof Date ? date.toString() : date,
        });
        return data && data.contents;
    }

    async getStaticSummaryOpinion({ offset, limit, date }) {
        const data = await super.apiCall('/api/v1/recommends/opinions/daily', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            date: date instanceof Date ? date.toString() : date,
        });
        return data && data.contents;
    }
}
