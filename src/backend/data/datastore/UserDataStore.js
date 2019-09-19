import DataStoreImpl from '@datastore/DataStoreImpl';
import RequestDataStore from '@datastore/RequestDataStore';
import Cookies from 'js-cookie';
import models from '@models';
import * as detection from '@network/detection';
import vector from '@extension/vector';
import Promise from 'bluebird';
import PyShell from '@network/python_shell';
import expo from '@extension/object2json';
import { ApiError } from '@extension/Error';
import data_config from '@constants/data_config';
import {
    generateLikeQuery,
    generateOrQuery,
    generateOrQueries,
} from '@extension/query';
import {
    apiUpdateUserValidates,
    apiInviteUserValidates,
} from '@validations/user';
import invite_config from '@constants/invite_config';
import Contracter from '@network/web3';

const requestDataStore = new RequestDataStore();
const contracter = new Contracter();

export default class UserDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async getIncludes(
        datum,
        params = {
            upvotes: true,
            downvotes: true,
            contents: true,
            follows: true,
            followers: true,
            vote_requests: true,
            voted_requests: true,
            view_histories: true,
            search_histories: true,
            interests: true,
            isPrivate: true,
        }
    ) {
        let users = datum.filter(data => !!data);
        const includes = await Promise.map(
            users,
            val => {
                return Promise.all([
                    params.upvotes &&
                        models.UpVote.findAll({
                            where: {
                                voter_id: val.id,
                            },
                            raw: true,
                        }),
                    params.downvotes &&
                        models.DownVote.findAll({
                            where: {
                                voter_id: val.id,
                            },
                            raw: true,
                        }),
                    params.contents &&
                        models.Content.findAll({
                            where: {
                                user_id: val.id,
                            },
                            raw: true,
                        }),
                    params.follows &&
                        models.Follow.findAll({
                            where: {
                                voter_id: val.id,
                            },
                            raw: true,
                        }),
                    params.followers &&
                        models.Follow.findAll({
                            where: {
                                votered_id: val.id,
                            },
                            raw: true,
                        }),
                    params.vote_requests &&
                        models.Request.findAll({
                            where: {
                                voter_id: val.id,
                            },
                            raw: true,
                        }),
                    params.voted_requests &&
                        models.Request.findAll({
                            where: {
                                votered_id: val.id,
                            },
                            raw: true,
                        }),
                    // params.view_histories && models.ViewHistory.findAll({
                    //     where: {
                    //         user_id: val.id,
                    //     },
                    //     raw: true,
                    // }),
                    // params.search_histories && models.SearchHistory.findAll({
                    //     where: {
                    //         user_id: val.id,
                    //     },
                    //     raw: true,
                    // }),
                ]);
            },
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const upvote_contents = params.upvotes
            ? await Promise.all(
                  includes.map(async data => {
                      let upvotes = data[0];
                      return await Promise.all(
                          upvotes.map(upvote => {
                              return models.Content.findOne({
                                  where: {
                                      id: upvote.VotedId,
                                  },
                                  raw: true,
                              });
                          })
                      );
                  })
              ).catch(e => {
                  throw new ApiError({
                      error: e,
                      tt_key: 'errors.invalid_response_from_server',
                  });
              })
            : [];

        const downvote_contents = params.downvotes
            ? await Promise.all(
                  includes.map(async data => {
                      let downvotes = data[1];
                      return await Promise.all(
                          downvotes.map(downvote => {
                              return models.Content.findOne({
                                  where: {
                                      id: downvote.VotedId,
                                  },
                                  raw: true,
                              });
                          })
                      );
                  })
              ).catch(e => {
                  throw new ApiError({
                      error: e,
                      tt_key: 'errors.invalid_response_from_server',
                  });
              })
            : [];

        const follow_users = params.follows
            ? await Promise.all(
                  includes.map(async data => {
                      let follows = data[3];
                      return await Promise.all(
                          follows.map(follow => {
                              return models.User.findOne({
                                  where: {
                                      id: follow.VoteredId,
                                  },
                                  raw: true,
                              });
                          })
                      );
                  })
              ).catch(e => {
                  throw new ApiError({
                      error: e,
                      tt_key: 'errors.invalid_response_from_server',
                  });
              })
            : [];

        const follower_users = params.followers
            ? await Promise.all(
                  includes.map(async data => {
                      let followers = data[4];
                      return await Promise.all(
                          followers.map(follower => {
                              return models.User.findOne({
                                  where: {
                                      id: follower.VoterId,
                                  },
                                  raw: true,
                              });
                          })
                      );
                  })
              ).catch(e => {
                  throw new ApiError({
                      error: e,
                      tt_key: 'errors.invalid_response_from_server',
                  });
              })
            : [];

        // const voter = params.vote_requests
        //     ? await Promise.all(
        //           includes.map(async data => {
        //               let requests = data[5];
        //               return await Promise.all(
        //                   requests.map(request => {
        //                       return models.User.findOne({
        //                           where: {
        //                               id: request.VoterId,
        //                           },
        //                           raw: true,
        //                       });
        //                   })
        //               );
        //           })
        //       ).catch(e => {
        //           throw new ApiError({
        //                  error: e,
        //                  tt_key: 'errors.invalid_response_from_server',
        //              });
        //       })
        //     : [];

        // const votered = params.voted_requests
        //     ? await Promise.all(
        //           includes.map(async data => {
        //               let requests = data[6];
        //               return await Promise.all(
        //                   requests.map(request => {
        //                       return models.User.findOne({
        //                           where: {
        //                               id: request.VoterId,
        //                           },
        //                           raw: true,
        //                       });
        //                   })
        //               );
        //           })
        //       ).catch(e => {
        //           throw new ApiError({
        //                  error: e,
        //                  tt_key: 'errors.invalid_response_from_server',
        //              });
        //       })
        //     : [];

        return await Promise.all(
            users.map(async (val, index) => {
                if (params.upvotes) {
                    val.UpVotes = includes[index][0];
                    val.UpVotes = val.UpVotes.map((val, i) => {
                        val.Content = upvote_contents[index][i];
                        return val;
                    });
                }
                if (params.downvotes) {
                    val.DownVotes = includes[index][1];
                    val.DownVotes = val.DownVotes.map((val, i) => {
                        val.Content = downvote_contents[index][i];
                        return val;
                    });
                }
                if (params.contents) val.Contents = includes[index][2];
                if (params.follows) val.Follows = follow_users[index]; //includes[index][3];
                if (params.followers) val.Followers = follower_users[index]; //includes[index][4];
                if (params.vote_requests) {
                    val.Requests = await requestDataStore.getIndexIncludes(
                        includes[index][5]
                    );
                }
                if (params.voted_requests) {
                    val.VotedRequests = await requestDataStore.getIndexIncludes(
                        includes[index][6]
                    );
                }
                return val;
            })
        );
    }

    async search({ keyword, limit, offset }) {
        let like_results = await Promise.all(
            generateLikeQuery(keyword).map(val => {
                return models.User.findAll({
                    where: {
                        $or: [
                            {
                                username: {
                                    $like: val,
                                },
                            },
                            {
                                nickname: {
                                    $like: val,
                                },
                            },
                        ],
                    },
                    offset: Number(offset || 0),
                    limit: Number(limit || data_config.fetch_data_limit('M')),
                    raw: true,
                    // order: [['score', 'DESC']],
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        like_results = Array.prototype.concat.apply([], like_results);

        const results = [];
        const map = new Map();
        for (const item of like_results) {
            if (!map.has(item.id)) {
                map.set(item.id, true);
                results.push(item);
            }
        }

        // like_results = await this.getIndexIncludes(like_results);

        return results;
    }

    async getUserIncludesInterests(user) {
        let interests = await models.Interest.findAll({
            where: {
                user_id: Number(user.id),
            },
            raw: true,
        });

        const labels = await Promise.all(
            interests.map(interest => {
                return models.Label.findOne({
                    where: {
                        id: Number(interest.LabelId),
                    },
                    raw: true,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        user.Interests = interests.map((val, index) => {
            val.Label = labels[index];
            return val;
        });
        return user;
    }

    async getUserIncludesLabelStocks(user) {
        let stocks = await models.LabelStock.findAll({
            where: {
                user_id: Number(user.id),
            },
            raw: true,
        });

        const labels = await Promise.all(
            stocks.map(stock => {
                return models.Label.findOne({
                    where: {
                        id: Number(stock.LabelId),
                    },
                    raw: true,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        user.LabelStocks = stocks.map((val, index) => {
            val.Label = labels[index];
            return val;
        });
        return user;
    }

    async findOneUser({ id }) {
        const result = await models.User.findOne({
            where: {
                id: Number(id),
            },
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await this.getIncludes([result]);

        return datum[0];
    }

    async updateUser({ user }) {
        await apiUpdateUserValidates.isValid({
            user,
            detail: user.detail,
            nickname: user.nickname,
        });

        const base = await models.User.findOne({
            where: {
                username: user.username,
                id: Number(user.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updatedUser = await base
            .update({
                nickname: user.nickname,
                detail: user.detail,
                picture_small: user.picture_small,
                picture_large: user.picture_large,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async deleteUser({ user }) {
        const result = await models.User.destroy({
            where: {
                username: user.username,
                id: Number(user.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async updateVector(user, vec) {
        const data = await user
            .update({
                vector: vector.sum([
                    expo.ifStringParseJSON(user.vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updatePostVector(user, vec) {
        const data = await user
            .update({
                post_vector: vector.sum([
                    expo.ifStringParseJSON(user.post_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateViewVector(user, vec) {
        const data = await user
            .update({
                view_vector: vector.sum([
                    expo.ifStringParseJSON(user.view_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateUpvoteVector(user, vec) {
        const data = await user
            .update({
                upvote_vector: vector.sum([
                    expo.ifStringParseJSON(user.upvote_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateFollowVector(user, vec) {
        const data = await user
            .update({
                follow_vector: vector.sum([
                    expo.ifStringParseJSON(user.follow_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateFollowerVector(user, vec) {
        const data = await user
            .update({
                follower_vector: vector.sum([
                    expo.ifStringParseJSON(user.follower_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateLabelStockVector(user, vec) {
        const data = await user
            .update({
                label_stock_vector: vector.sum([
                    expo.ifStringParseJSON(user.label_stock_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateRequestPostVector(user, vec) {
        const data = await user
            .update({
                request_post_vector: vector.sum([
                    expo.ifStringParseJSON(user.request_post_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateRequestUpvoteVector(user, vec) {
        const data = await user
            .update({
                request_upvote_vector: vector.sum([
                    expo.ifStringParseJSON(user.request_upvote_vector),
                    expo.ifStringParseJSON(vec),
                ]),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subVector(user, vec) {
        const data = await user
            .update({
                vector: vector.sub(
                    expo.ifStringParseJSON(user.vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subPostVector(user, vec) {
        const data = await user
            .update({
                post_vector: vector.sub(
                    expo.ifStringParseJSON(user.post_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subViewVector(user, vec) {
        const data = await user
            .update({
                view_vector: vector.sub(
                    expo.ifStringParseJSON(user.view_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subUpvoteVector(user, vec) {
        const data = await user
            .update({
                upvote_vector: vector.sub(
                    expo.ifStringParseJSON(user.upvote_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subFollowVector(user, vec) {
        const data = await user
            .update({
                follow_vector: vector.sub(
                    expo.ifStringParseJSON(user.follow_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subFollowerVector(user, vec) {
        const data = await user
            .update({
                follower_vector: vector.sub(
                    expo.ifStringParseJSON(user.follower_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subLabelStockVector(user, vec) {
        const data = await user
            .update({
                label_stock_vector: vector.sub(
                    expo.ifStringParseJSON(user.label_stock_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subRequestPostVector(user, vec) {
        const data = await user
            .update({
                request_post_vector: vector.sub(
                    expo.ifStringParseJSON(user.request_post_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async subRequestUpvoteVector(user, vec) {
        const data = await user
            .update({
                request_upvote_vector: vector.sub(
                    expo.ifStringParseJSON(user.request_upvote_vector),
                    expo.ifStringParseJSON(vec)
                ),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async getUsersSimiliars(target_user, users, limit = 10) {
        const results = users
            .map(val => {
                return {
                    user: val,
                    sim: vector.cosinesim(target_user.vector, val.vector),
                };
            })
            .sort((a, b) => {
                if (a.sim > b.sim) return -1;
                if (a.sim < b.sim) return 1;
                return 0;
            })
            .map(sorted => sorted.user)
            .slice(0, limit);

        return results;
    }

    async getUpvoteSumVec(user) {
        return vector.sum(
            user.UpVotes.map(
                upvote =>
                    upvote.Content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async getDownvoteSumVec(user) {
        return vector.sum(
            user.DownVotes.map(
                upvote =>
                    upvote.Content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async getViewSumVec(user) {
        return vector.sum(
            user.ViewHistories.map(
                viewHistory =>
                    viewHistory.Content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async getSearchSumVec(user) {
        return vector.sum(
            user.SearchHistories.map(
                searchHistory =>
                    search.Content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async getPostSumVec(user) {
        return vector.sum(
            user.Contents.map(
                content =>
                    content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async getRepostSumVec(user) {
        return vector.sum(
            user.Reposts.map(
                repost =>
                    repost.Content.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => {
                        return 0;
                    })
            )
        );
    }

    async invite({ user, invite_code }) {
        await apiInviteUserValidates.isValid({ user, invite_code }).catch(e => {
            throw e;
        });

        const datum = await Promise.all([
            models.User.findOne({
                where: {
                    id: Number(user.id),
                },
            }),
            models.User.findOne({
                where: {
                    invite_code,
                },
            }),
            models.Invite.findAll({
                where: {
                    invite_code,
                },
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const invited_user = datum[0],
            inviter_user = datum[1],
            invites = datum[2];

        const invited_txnHash = await contracter
            .transferToken(
                invited_user.eth_address,
                invite_config.invited_avarage
            )
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_not_correct',
                    tt_params: { data: 'user' },
                });
            });

        const inviter_txnHash = await contracter
            .transferToken(
                inviter_user.eth_address,
                invite_config.bonus(invites.length)
            )
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_not_correct',
                    tt_params: { data: 'user' },
                });
            });

        const result = await models.Invite.create({
            inviter_id: inviter_user.id,
            invited_id: invited_user.id,
            times: invites.length + 1,
            invite_code,
            inviter_amount: invite_config.bonus(invites.length),
            invited_amount: invite_config.invited_avarage,
            invited_txnHash,
            inviter_txnHash,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }
}
