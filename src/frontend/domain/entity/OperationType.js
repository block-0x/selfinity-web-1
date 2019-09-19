import Entity from '@entity/Entity';
import { Enum, defineEnum } from '@extension/Enum';

const OPERATION_TYPE = defineEnum({
    Comment: {
        rawValue: 0,
        value: 'comment',
    },
    Delete_Comment: {
        rawValue: 1,
        value: 'delete_comment',
    },
    Convert: {
        rawValue: 2,
        value: 'convert',
    },
    Delete_Comment: {
        rawValue: 3,
        value: 'delete_comment',
    },
    custom_json: {
        rawValue: 4,
        value: 'custom_json',
    },
    Cancel_Transfer_From_Savings: {
        rawValue: 5,
        value: 'cancel_transfer_from_savings',
    },
    Vote: {
        rawValue: 6,
        value: 'vote',
    },
    Transfer: {
        rawValue: 7,
        value: 'transfer',
    },
    Transfer_To_Vesting: {
        rawValue: 8,
        value: 'transfer_to_vesting',
    },
    Claim_Reward_Balance: {
        rawValue: 9,
        value: 'claim_reward_balance',
    },
    Limit_Order_Cancel: {
        rawValue: 10,
        value: 'limit_order_cancel',
    },
    Withdraw_Vesting: {
        rawValue: 11,
        value: 'withdraw_vesting',
    },
    Account_Witness_Vote: {
        rawValue: 12,
        value: 'account_witness_vote',
    },
    Account_Witness_Proxy: {
        rawValue: 13,
        value: 'account_witness_proxy',
    },
});

export default OPERATION_TYPE;
