import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';

export const CAMPAIGN_MENU = defineEnum({
    Image: {
        rawValue: 0,
        value: 'image',
    },
    Title: {
        rawValue: 0,
        value: 'title',
    },
    Text: {
        rawValue: 0,
        value: 'text',
    },
    Border: {
        rawValue: 0,
        value: 'border',
    },
    Custom: {
        rawValue: 0,
        value: 'custom',
    },
});

export default CAMPAIGN_MENU;
