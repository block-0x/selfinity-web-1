import { Enum, defineEnum } from '@extension/Enum';

export const RENDER_PATTERN = defineEnum({
    All: {
        rawValue: 0,
        value: 'All',
    },
    Index: {
        rawValue: 1,
        value: 'Index',
    },
    IndexHeader: {
        rawValue: 2,
        value: 'IndexHeader',
    },
    Show: {
        rawValue: 3,
        value: 'Show',
    },
    Detail: {
        rawValue: 4,
        value: 'Detail',
    },
    IndexHeader2Categories: {
        rawValue: 5,
        value: 'IndexHeader2Categories',
    },
    Relate: {
        rawValue: 6,
        value: 'Relate',
    },
    RelateBorder: {
        rawValue: 7,
        value: 'RelateBorder',
    },
});

export const RENDER_TYPE = defineEnum({
    Home: {
        rawValue: 0,
        value: 'Home',
    },
    Debate: {
        rawValue: 1,
        value: 'Debate',
    },
    Squad: {
        rawValue: 2,
        value: 'Squad',
    },
    Label: {
        rawValue: 3,
        value: 'Label',
    },
    Task: {
        rawValue: 4,
        value: 'Task',
    },
    User: {
        rawValue: 5,
        value: 'User',
    },
    Comment: {
        rawValue: 6,
        value: 'Comment',
    },
});
