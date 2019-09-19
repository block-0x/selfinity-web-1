import { PythonShell } from 'python-shell';
const env = require('@env/env.json');
import { Enum, defineEnum } from '@extension/Enum';

function pythonMethodsPath(method) {
    return `${process.env.NODE_PATH}/python-scripts/`;
}

export const PYTHON_METHODS = defineEnum({
    ContentBased: {
        rawValue: 0,
        value: 'content_based_recommend',
    },
    UserScoreBased: {
        rawValue: 1,
        value: 'user_score_based_recommend',
    },
    UserOwnedBased: {
        rawValue: 2,
        value: 'user_owned_based_recommend',
    },
    LabelCreate: {
        rawValue: 3,
        value: 'label_create',
    },
    Synthetic: {
        rawValue: 4,
        value: 'synthetic_vector_recommend',
    },
    LabelSynthetic: {
        rawValue: 5,
        value: 'synthetic_vector_label_recommend',
    },
    TextVectorize: {
        rawValue: 6,
        value: 'text_vectorize',
    },
    LabelVectorize: {
        rawValue: 7,
        value: 'label_vectorize',
    },
    UserViewedBased: {
        rawValue: 8,
        value: 'user_viewed_based_recommend',
    },
    UserRequestBased: {
        rawValue: 9,
        value: 'user_request_based_recommend',
    },
    UserCommentBased: {
        rawValue: 10,
        value: 'user_comment_based_recommend',
    },
    UserUpvoteBased: {
        rawValue: 11,
        value: 'user_upvote_based_recommend',
    },
    LabelInterestBased: {
        rawValue: 12,
        value: 'label_interest_based_recommend',
    },
    LabelLabelingBased: {
        rawValue: 13,
        value: 'label_labeling_based_recommend',
    },
});

export const options = (method, args = []) => {
    return {
        mode: 'text',
        pythonPath: env.PYTHON_PATH,
        pythonOptions: ['-u'],
        scriptPath: pythonMethodsPath(method),
        args: args,
    };
};

export const runPython = (method, args = []) => {
    var pyshell = new PythonShell(`${method}.py`, options(method, args));
    pyshell.send(args);

    return new Promise((resolve, reject) => {
        pyshell.on('message', message => {
            resolve(JSON.parse(message));
            return;
        });

        pyshell.end((err, code, signal) => {
            if (err) reject(err);
            return;
        });
    });
};

module.exports = {
    PYTHON_METHODS,
    options,
    runPython,
};
