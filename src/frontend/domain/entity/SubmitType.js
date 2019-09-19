import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';

//'submit_story', 'submit_comment', 'edit'
const SUBMIT_TYPE = defineEnum({
    Story: {
        rawValue: 0,
        value: 'submit_story',
    },
    Comment: {
        rawValue: 1,
        value: 'submit_comment',
    },
    Edit: {
        rawValue: 2,
        value: 'edit',
    },
});

export default SUBMIT_TYPE;
