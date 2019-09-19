const casual = require('casual');
const times = require('../utils/times');
const content_types = ['content' /*, 'debate', 'squad', 'task'*/];
const PyShell = require('../utils/python_shell');

const get_texts_from_corpus = (
    limit = 30,
    min_text_length = 10,
    max_text_length = 600
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

const content_child = (
    contents_limit,
    key,
    users_limit,
    isCorpus = true,
    bodies_cache = [],
    titles_cache = []
) => {
    const parent_id = key % contents_limit + 1;
    const mode = content_types[(parent_id - 1) % content_types.length];
    const score = casual.double((from = 0), (to = 1000));
    return {
        parent_id: parent_id,
        user_id: casual.integer((from = 1), (to = users_limit)),
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
                return 0; //casual.double((from = -1), (to = 1));
            })
        ),
        url: '',
        title: isCorpus && titles_cache[key] ? titles_cache[key] : casual.title,
        body:
            isCorpus && bodies_cache[key]
                ? bodies_cache[key]
                : casual.sentences((n = Math.floor(Math.random() * 20))),
        locale: 'ja',
        country_code: 'JP',
        meta: '',
        path: `/${parent_id}/${contents_limit + 1}`,
        count: 1,
        isStory: false,
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
        last_payout_at: new Date(),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function content_children(
    limit = 30,
    contents_number = 30,
    users_number = 30,
    isCorpus = true
) {
    let content_children_array = [];
    const result = isCorpus
        ? await get_texts_from_corpus(limit).catch(err => {
              throw new Error(err);
          })
        : {};
    await times(limit)(() => {
        content_children_array.push(
            content_child(
                contents_number + content_children_array.length,
                content_children_array.length,
                users_number,
                isCorpus,
                result.bodies_cache || [],
                result.titles_cache || []
            )
        );
    });

    // content_children_array = await contents_vectorize(content_children_array).catch((e) => {
    //     throw new Error(e)
    // })

    return content_children_array;
}

module.exports = content_children;
