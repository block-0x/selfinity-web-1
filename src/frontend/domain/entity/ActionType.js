import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';

const ACTION_TYPE = defineEnum({
    Upvote: {
        rawValue: 0,
        value: 'upvote',
    },
    Downvote: {
        rawValue: 1,
        value: 'downvote',
    },
    Repost: {
        rawValue: 2,
        value: 'repost',
    },
    Post: {
        rawValue: 3,
        value: 'post',
    },
    Import: {
        rawValue: 4,
        value: 'impoort',
    },
    View: {
        rawValue: 5,
        value: 'view',
    },
    Search: {
        rawValue: 6,
        value: 'search',
    },
});

export default ACTION_TYPE;
