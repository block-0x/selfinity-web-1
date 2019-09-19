import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';

const CONTENT_TYPE = defineEnum({
    Content: {
        rawValue: 0,
        value: 'content',
    },
    Debate: {
        rawValue: 1,
        value: 'debate',
    },
    Squad: {
        rawValue: 2,
        value: 'squad',
    },
    Task: {
        rawValue: 3,
        value: 'task',
    },
    Label: {
        rawValue: 4,
        value: 'label',
    },
});

export default CONTENT_TYPE;
