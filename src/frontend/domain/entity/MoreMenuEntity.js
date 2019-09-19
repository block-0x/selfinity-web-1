import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';

export const MOREMENU_TYPE = defineEnum({
    Content: {
        rawValue: 0,
        value: 'content',
    },
    MyContent: {
        rawValue: 1,
        value: 'my_content',
    },
    Label: {
        rawValue: 2,
        value: 'label',
    },
    StockedLabel: {
        rawValue: 3,
        value: 'stocked_label',
    },
    Request: {
        rawValue: 4,
        value: 'request',
    },
    MyVoteRequest: {
        rawValue: 5,
        value: 'my_vote_request',
    },
    MyTargetRequest: {
        rawValue: 6,
        value: 'my_target_request',
    },
});

export class MoreMenuEntity extends Entity {
    constructor({ type, repository, onClickEdit, onClickDelete }) {
        super();
        this.type = type;
        this.value = type.value;
        this.repository = repository;
        this.onClickEdit = onClickEdit;
        this.onClickDelete = onClickDelete;
    }

    getProps() {
        switch (type) {
            case MOREMENU_TYPE.MyContent:
                return defineEnum({
                    Edit: {
                        rawValue: 0,
                        key: 0,
                        value: 'edit',
                        src: '',
                        onClick: this.onClickEdit,
                    },
                    Delete: {
                        rawValue: 1,
                        key: 1,
                        value: 'delete',
                        src: '',
                        onClick: this.onClickDelete,
                    },
                });
        }
    }
}
