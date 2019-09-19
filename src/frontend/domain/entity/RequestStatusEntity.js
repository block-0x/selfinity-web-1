import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';
import ope from '@extension/operator';

export const REQUEST_STATUS_TYPE = defineEnum({
    UnSolved: {
        rawValue: 0,
        value: 'unsolved',
        tt_key: 'g.unsolved',
        is: item => {
            if (!ope.isRequest(item)) return false;
            return (
                !Number.prototype.castBool(item.isResolved) &&
                // !Number.prototype.castBool(item.isAnswered) &&
                !Number.prototype.castBool(item.isAccepted)
            );
        },
    },
    UnAccepted: {
        rawValue: 1,
        value: 'unaccepted',
        tt_key: 'g.denial',
        is: item => {
            if (!ope.isRequest(item)) return false;
            return (
                Number.prototype.castBool(item.isResolved) &&
                Number.prototype.castBool(item.isAnswered) &&
                !Number.prototype.castBool(item.isAccepted)
            );
        },
    },
    Accepted: {
        rawValue: 1,
        value: 'accepted',
        tt_key: 'g.solved',
        is: item => {
            if (!ope.isRequest(item)) return false;
            return (
                Number.prototype.castBool(item.isResolved) &&
                Number.prototype.castBool(item.isAnswered) &&
                Number.prototype.castBool(item.isAccepted)
            );
        },
    },
});

export const getStatusKey = item => {
    if (REQUEST_STATUS_TYPE.UnSolved.is(item)) {
        return REQUEST_STATUS_TYPE.UnSolved.tt_key;
    } else if (REQUEST_STATUS_TYPE.UnAccepted.is(item)) {
        return REQUEST_STATUS_TYPE.UnAccepted.tt_key;
    } else if (REQUEST_STATUS_TYPE.Accepted.is(item)) {
        return REQUEST_STATUS_TYPE.Accepted.tt_key;
    }
};
