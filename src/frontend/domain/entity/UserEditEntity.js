import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';

const USER_EDIT_TYPE = defineEnum({
    Nickname: {
        rawValue: 0,
        value: 'nickname',
        type: 'text',
        string: () => tt('g.nickname'),
    },
    Detail: {
        rawValue: 1,
        value: 'detail',
        type: 'text',
        string: () => tt('g.detail_user'),
    },
    Picture: {
        rawValue: 2,
        value: 'picture',
        type: 'file',
        string: () => tt('g.profile_image'),
    },
    Submit: {
        rawValue: 3,
        value: 'submit',
        string: () => tt('g.save'),
    },
});

export default USER_EDIT_TYPE;
