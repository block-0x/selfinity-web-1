const casual = require('casual');
const times = require('../utils/times');
const PyShell = require('../utils/python_shell');
const content_types = ['request'];

const get_texts_from_corpus = (
    limit = 30,
    min_text_length = 10,
    max_text_length = 100
) => {
    return new Promise((resolve, reject) => {
        PyShell.runPython(PyShell.PYTHON_METHODS[1], [
            JSON.stringify({
                limit: limit,
                min_text_length: min_text_length,
                max_text_length: max_text_length,
            }),
        ])
            .then(result => {
                resolve({
                    bodies_cache: result.bodies,
                    titles_cache: result.titles,
                });
                return;
            })
            .catch(err => {
                console.log(err);
                throw new Error(err);
                reject(err);
            });
    });
};

const request = (
    key,
    users_limit,
    contents_limit,
    isCorpus = true,
    bodies_cache = [],
    titles_cache = []
) => {
    const mode = content_types[key % content_types.length];
    const score = casual.double((from = 0), (to = 1000));
    return {
        content_id: casual.integer((from = 1), (to = contents_limit)),
        voter_id: casual.integer((from = 1), (to = users_limit)),
        votered_id: casual.integer((from = 1), (to = users_limit)),
        locale: 'ja',
        country_code: 'JP',
        score: score,
        pure_score: score,
        last_payout_score: score,
        last_payout_pure_score: score,
        answer_score: score * 0.9,
        answer_pure_score: score * 0.9,
        last_payout_answer_score: score * 0.9,
        last_payout_answer_pure_score: score * 0.9,
        voters_score: score * 0.1,
        voters_pure_score: score * 0.1,
        last_payout_voters_score: score * 0.1,
        last_payout_voters_pure_score: score * 0.1,
        vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return 0;
            })
        ),
        isResolved: false,
        isAccepted: false,
        url: '',
        title: isCorpus ? titles_cache[key] : casual.title,
        body: isCorpus
            ? bodies_cache[key]
            : casual.sentences((n = Math.floor(Math.random() * 20))),
        meta: '',
        isNsfw: false,
        ishide: false,
        allowEdit: true,
        allowDelete: true,
        allowReply: true,
        allow_votes: true,
        allow_curation_rewards: true,
        max_accepted_payout: '',
        last_score_at: new Date(),
        hasPendingPayout: false,
        deadline_cashout_at: new Date(),
        last_payout_at: new Date(),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function requests(
    limit = 30,
    users_number = 30,
    contents_number = 30,
    isCorpus = true
) {
    let requests_array = [];
    const result = isCorpus
        ? await get_texts_from_corpus(limit).catch(err => {
              throw new Error(err);
          })
        : {};
    await times(limit)(() => {
        requests_array.push(
            request(
                requests_array.length,
                users_number,
                contents_number,
                isCorpus,
                result.bodies_cache || [],
                result.titles_cache || []
            )
        );
    });
    return requests_array;
}

module.exports = requests;
