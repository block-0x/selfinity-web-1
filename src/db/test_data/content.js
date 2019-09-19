const casual = require('casual');
const times = require('../utils/times');
const PyShell = require('../utils/python_shell');
const content_types = ['content' /*, 'debate', 'squad', 'task'*/];

const get_texts_from_corpus = (
    limit = 30,
    min_text_length = 10,
    max_text_length = 250
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

const contents_vectorize = contents => {
    return new Promise((resolve, reject) => {
        PyShell.runPython(PyShell.PYTHON_METHODS[3], [
            JSON.stringify({
                contents: contents,
            }),
        ])
            .then(results => {
                resolve({
                    contents: results.map((result, index) => {
                        let val = contents[index];
                        val.vector = result.vector;
                        return val;
                    }),
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

const content = (
    key,
    users_limit,
    isCorpus = true,
    bodies_cache = [],
    titles_cache = []
) => {
    const mode = content_types[key % content_types.length];
    const score = casual.double((from = 0), (to = 1000));
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        parent_id: null,
        score: score,
        pure_score: score,
        last_payout_score: score,
        last_payout_pure_score: score,
        author_score: score * 0.9,
        author_pure_score: score * 0.9,
        last_payout_author_score: score * 0.9,
        last_payout_author_pure_score: score * 0.9,
        voters_score: score * 0.1,
        voters_pure_score: score * 0.1,
        last_payout_voters_score: score * 0.1,
        last_payout_voters_pure_score: score * 0.1,
        vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return 0;
            })
        ),
        url: '',
        title: isCorpus ? titles_cache[key] : casual.title,
        body: isCorpus
            ? bodies_cache[key]
            : casual.sentences((n = Math.floor(Math.random() * 20))),
        locale: 'ja',
        country_code: 'JP',
        meta: '',
        path: `/${key + 1}`,
        count: 2,
        isStory: true,
        isNsfw: false,
        ishide: false,
        allowEdit: true,
        allowDelete: true,
        allowReply: true,
        allow_votes: true,
        allow_curation_rewards: true,
        max_accepted_payout: '',
        hasPendingPayout: false,
        deadline_cashout_at: new Date(),
        last_score_at: new Date(),
        last_payout_at: new Date(),
        isOpinionWanted: key % 6 == 0,
        isRequestWanted: false,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function contents(limit = 30, users_number = 30, isCorpus = true) {
    let contents_array = [];
    const result = isCorpus
        ? await get_texts_from_corpus(limit).catch(err => {
              throw new Error(err);
          })
        : {};
    await times(limit)(() => {
        contents_array.push(
            content(
                contents_array.length,
                users_number,
                isCorpus,
                result.bodies_cache || [],
                result.titles_cache || []
            )
        );
    });

    // contents_array = await contents_vectorize(contents_array).catch((e) => {
    //     throw new Error(e)
    // })

    return contents_array;
}

module.exports = contents;
