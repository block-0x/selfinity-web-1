import ope from '@extension/operator';

export const default_author_reward_ratio = 0.9;
export const default_voter_reward_ratio = 0.1;
export const default_answer_reward_ratio = 0.9;
export const least_user_score = 10; //0.01;
export const least_vote_score = 1; //0.001;
export const interest_rate = 1; //0.5;
export const reward_interval_date = 7;
export const pure_mode = true;
export const threshold_number = 5;
export const threshold_rate = 0;
export const better_opinion_rate = 0.5;
export const opinion_rate = 1.2;

export const getScore = item => {
    if (!item) return 0;
    if (ope.isLabel(item)) {
        return pure_mode ? item.sum_pure_score : item.sum_score;
    }
    return pure_mode ? item.pure_score : item.score;
};

export const getAuthorScore = item => {
    if (!item) return 0;
    return pure_mode ? item.author_pure_score : item.author_score;
};

export const getVoterScore = item => {
    if (!item) return 0;
    return pure_mode ? item.voter_pure_score : item.voter_score;
};

export default {
    default_author_reward_ratio,
    default_voter_reward_ratio,
    default_answer_reward_ratio,
    least_user_score,
    least_vote_score,
    interest_rate,
    reward_interval_date,
    pure_mode,
    threshold_number,
    threshold_rate,
    getScore,
    better_opinion_rate,
    opinion_rate,
    getAuthorScore,
    getVoterScore,
};
