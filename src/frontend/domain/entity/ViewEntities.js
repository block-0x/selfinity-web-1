import React from 'react';
import Entity from '@entity/Entity';
import OPERATION_TYPE from '@entity/OperationType';
import models from '@network/client_models';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import { CONTENT_TYPE } from '@entity';
import { Enum, defineEnum } from '@extension/Enum';
import { SideBarEntity, SideBarEntities } from '@entity/SideBarEntity';
import ope from '@extension/operator';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import tt from 'counterpart';

export class HomeModel extends Entity {
    constructor({
        contents,
        categories,
        storyContents,
        section,
        loadFunc,
        autoLoad,
    }) {
        super();
        this.contents = contents || [];
        this.categories = categories || [];
        this.storyContents = storyContents || [];
        this.section = section;
        this.loadFunc = loadFunc || null;
        this.autoLoad = autoLoad || false;
    }

    set section(section) {
        if (section) {
            this._section = section;
            return;
        }
        if (
            this.contents.length == 0 ||
            (!this.contents[0].title &&
                !this.contents[0].body &&
                !this.contents[0].id) ||
            (this.contents[0] == '' && this.contents[0].body == '')
        ) {
            this._section =
                this.storyContents.length > 0
                    ? defineEnum({
                          HomeCategory: {
                              rawValue: 0,
                              value: 'homeCategory',
                          },
                          NotFound: {
                              rawValue: 2,
                              value: 'notfound',
                          },
                      })
                    : defineEnum({
                          NotFound: {
                              rawValue: 1,
                              value: 'notfound',
                          },
                      });
            return;
        }
        switch (true) {
            case ope.isContent(this.contents[0]) &&
                this.storyContents.length > 0:
                this._section = defineEnum({
                    HomeCategory: {
                        rawValue: 0,
                        value: 'homeCategory',
                    },
                    Viewer: {
                        rawValue: 1,
                        value: 'viewer',
                    },
                    Border: {
                        rawValue: 2,
                        value: 'border',
                    },
                });
                break;
            default:
                this._section = defineEnum({
                    Category: {
                        rawValue: 0,
                        value: 'category',
                    },
                    Body: {
                        rawValue: 2,
                        value: 'body',
                    },
                });
                break;
        }
    }

    get section() {
        return this._section;
    }
}

export class HomeModels extends Entity {
    constructor({ items, content, key }) {
        super();
        this.items = items || [];
        this.content = content || null;
        this.key = key || 0;
    }

    get section_entities() {
        let title;
        if (!this.content) {
            title = null;
        } else if (!this.content.title) {
            title = !!this.content.nickname ? this.content.nickname : null;
        } else {
            title = this.content.title;
        }
        return new SideBarEntities({
            title: title,
            items: this.items.map((item, index) => {
                return new SideBarEntity({
                    menu: item.categories[0],
                    toAnchor: `${this.key || 0}${index || 0}0`,
                    image: ope.isUser(item) && item.picture_small,
                });
            }),
        });
    }

    static build(repositories, offset) {
        return repositories.map((repository, index) => {
            if (ope.isUser(repository)) {
                return {
                    content: safe2json(repository),
                    items: [
                        {
                            storyContents: [],
                            contents: repository.VotedRequests
                                ? repository.VotedRequests.map(val =>
                                      safe2json(val)
                                  ).slice(0, data_config.home_row_limit)
                                : [],
                            categories: [tt('g.requests_wanted')],
                            /*section: defineEnum({
                                Viewer: {
                                    rawValue: 2,
                                    value: 'viewer',
                                },
                            }),*/
                        },
                        {
                            storyContents: [],
                            contents: repository.Contents
                                ? repository.Contents.map(val =>
                                      safe2json(val)
                                  ).slice(0, data_config.home_row_limit)
                                : [],
                            categories: [tt('g.related')],
                            section: defineEnum({
                                Category: {
                                    rawValue: 0,
                                    value: 'category',
                                },
                                Viewer: {
                                    rawValue: 2,
                                    value: 'viewer',
                                },
                            }),
                        },
                    ],
                    key: index + (offset || 0) + 1,
                };
            } else if (ope.isLabel(repository)) {
                return {
                    storyContents: [safe2json(repository)],
                    contents: repository.Contents
                        ? repository.Contents.map(val => safe2json(val)).slice(
                              0,
                              data_config.fetch_data_raw_limit('M')
                          )
                        : [],
                    categories: [tt('g.related')],
                };
            } else if (ope.isContent(repository)) {
                return {
                    content: safe2json(repository),
                    items: [
                        {
                            storyContents: [safe2json(repository)],
                            contents: repository.children_contents
                                ? repository.children_contents
                                      .map(val => safe2json(val))
                                      .slice(0, data_config.home_row_limit)
                                : [],
                            categories: [tt('g.related')],
                        },
                    ],
                    key: index + (offset || 0) + 1,
                };
            }
        });
    }
}

export class FeedModels extends HomeModels {
    constructor(args) {
        super(args);
    }

    static build(repositories /*, offset*/) {
        return {
            items: [
                {
                    contents: repositories,
                    categories: [tt('g.new')],
                },
            ],
        };
    }
}

export class SearchModels extends HomeModels {
    constructor(args) {
        super(args);
    }

    static build(repositories /*, offset*/) {
        return [
            {
                items: [
                    {
                        contents: repositories,
                        categories: [tt('g.search_result')],
                        storyContent: null,
                    },
                ],
                content: null,
                key: 0,
            },
        ];
    }
}

export class NewestModels extends HomeModels {
    constructor(args) {
        super(args);
    }

    static build(repositories /*, offset*/) {
        return [
            {
                items: [
                    {
                        contents: repositories,
                        categories: [tt('g.newest')],
                        storyContent: null,
                    },
                ],
                content: null,
                key: 0,
            },
        ];
    }
}

export class RelateModel extends HomeModel {
    constructor({ contents, category }) {
        super({
            contents: contents || [],
            categories: [category || tt('g.related')],
            storyContents: [],
            section: defineEnum({
                Category: {
                    rawValue: 0,
                    value: 'pure_category',
                },
                Uplight: {
                    rawValue: 1,
                    value: 'uplight',
                },
            }),
        });
    }
}

export class DetailModel extends HomeModel {
    constructor({ contents, categories, loadFunc, autoLoad }) {
        let section;
        if (!contents) {
            section = defineEnum({
                Category: {
                    rawValue: 0,
                    value: 'category',
                },
                NotFound: {
                    rawValue: 1,
                    value: 'notfound',
                },
            });
        } else if (contents.length == 0) {
            section = defineEnum({
                Category: {
                    rawValue: 0,
                    value: 'category',
                },
                NotFound: {
                    rawValue: 1,
                    value: 'notfound',
                },
            });
        } else {
            section = defineEnum({
                Category: {
                    rawValue: 0,
                    value: 'category',
                },
                Body: {
                    rawValue: 1,
                    value: 'body',
                },
                Button: {
                    rawValue: 2,
                    value: !!loadFunc && !!autoLoad ? 'button' : 'not',
                },
            });
        }
        super({
            contents: contents || [],
            categories: categories,
            storyContents: [],
            loadFunc: loadFunc,
            autoLoad: autoLoad,
            section,
        });
    }
}

export class DetailModels extends HomeModels {
    constructor({ items, content, key }) {
        super({
            items,
            content,
            key,
        });
    }

    get hasAnswer() {
        return (
            ope.isRequest(this.content) && this.items[0].contents.length != 0
        );
    }

    get getAnswerId() {
        if (this.hasAnswer) {
            return this.items[0].contents[0].id;
        }
    }

    get section_entities() {
        return super.section_entities;
    }

    static build(target, contents) {
        return {
            key: 0,
            content: safe2json(target),
            items: [
                {
                    contents: ope.isLabel(target)
                        ? contents
                              .map(val => safe2json(val))
                              .filter(val => !!val)
                        : [safe2json(target.Content)].filter(val => !!val),
                    categories: [
                        ope.isLabel(target)
                            ? tt('g.related')
                            : tt('g.answered_communication'),
                    ],
                },
            ],
        };
    }
}

export class ShowModel extends Entity {
    constructor({ content, section, storyContent }) {
        super();
        this.content = content || null;
        this.storyContent = storyContent || null;
        this.children = content.children_contents || [];
        this.section = section;
    }

    set section(section) {
        if (section) {
            this._section = section;
            return;
        }
        switch (true) {
            default:
            case !this.content && !this.storyContent:
                this._section = defineEnum({
                    NotFound: {
                        rawValue: 0,
                        value: 'notfound',
                    },
                });
                break;
            case !this.content && this.storyContent:
                this._section = defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'header',
                    },
                    NotFound: {
                        rawValue: 1,
                        value: 'notfound',
                    },
                });
                break;
            case this.content && this.storyContent && this.children.length > 0:
                this._section = defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'header',
                    },
                    Content: {
                        rawValue: 1,
                        value: 'content',
                    },
                    Children: {
                        rawValue: 2,
                        value: 'children',
                    },
                });
                break;
            case this.content && this.storyContent && this.children.length == 0:
                this._section = defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'header',
                    },
                    Content: {
                        rawValue: 1,
                        value: 'content',
                    },
                });
                break;
            case this.content && this.children.length == 0:
                this._section = defineEnum({
                    Content: {
                        rawValue: 0,
                        value: 'content',
                    },
                });
                break;
            case this.content && this.children.length > 0:
                this._section = defineEnum({
                    Content: {
                        rawValue: 0,
                        value: 'content',
                    },
                    Children: {
                        rawValue: 1,
                        value: 'children',
                    },
                });
                break;
        }
    }

    get section() {
        return this._section;
    }
}

export class ContentShowModel extends Entity {
    constructor({ content, section, requests }) {
        super();
        this.content = content || null;
        if (requests instanceof Array) {
            if (requests.length > 0) {
                this.request_mode = true;
            } else {
                this.request_mode = false;
            }
        } else {
            this.request_mode = false;
        }
        this.children = content.children_contents || [];
        this.parent = content.ParentContent;
        this.isPrivate = Number(0).castBool(content.isPrivate);
        this.showParent = true;
        this.section = section;
        this.requests = requests || [];
        this.showRequest = true;
    }

    toggleRequest() {
        this.showRequest = !this.showRequest;
    }

    toggleParent() {
        this.showParent = !this.showParent;
    }

    set requests(requests) {
        this._requests = requests;
    }

    get requests() {
        return this.showRequest ? this._requests : [];
    }

    set parent(parent) {
        this._parent = parent;
    }

    get parent() {
        return this.showParent ? this._parent : null;
    }

    set section(section) {
        if (section) {
            this._section = section;
            return;
        }
        switch (true) {
            // default:
            // case this.content && this.children.length == 0:
            //     this._section = defineEnum({
            //         Header: {
            //             rawValue: 0,
            //             value: 'header',
            //         },
            //         Content: {
            //             rawValue: 0,
            //             value: 'content',
            //         },
            //     });
            //     break;
            case this.content && !this.parent && !this.request_mode: // && this.children.length > 0:
                this._section = defineEnum({
                    Body: {
                        rawValue: 0,
                        value: 'body',
                    },
                    UserSection: {
                        rawValue: 1,
                        value: 'user_section',
                    },
                    Relate: {
                        rawValue: 1,
                        value: 'relate',
                    },
                    ReplySection: {
                        rawValue: 2,
                        value: 'reply_section',
                    },
                    Children: {
                        rawValue: 3,
                        value: 'children',
                    },
                });
                break;
            case this.content && !!this.parent && !this.request_mode:
                this._section = defineEnum({
                    Body: {
                        rawValue: 0,
                        value: 'body',
                    },
                    UserSection: {
                        rawValue: 1,
                        value: 'user_section',
                    },
                    // ParentSection: {
                    //     rawValue: 2,
                    //     value: 'parent_section',
                    // },
                    Relate: {
                        rawValue: 3,
                        value: 'relate',
                    },
                    ReplySection: {
                        rawValue: 4,
                        value: 'reply_section',
                    },
                    Children: {
                        rawValue: 5,
                        value: 'children',
                    },
                });
                break;
            case this.content && this.request_mode:
                this._section = defineEnum({
                    Body: {
                        rawValue: 0,
                        value: 'body',
                    },
                    UserSection: {
                        rawValue: 1,
                        value: 'user_section',
                    },
                    // RequestSection: {
                    //     rawValue: 2,
                    //     value: 'request_section',
                    // },
                    Relate: {
                        rawValue: 1,
                        value: 'relate',
                    },
                    ReplySection: {
                        rawValue: 3,
                        value: 'reply_section',
                    },
                    Children: {
                        rawValue: 4,
                        value: 'children',
                    },
                });
                break;
            default:
                this._section = defineEnum({
                    /*NotFound: {
                        rawValue: 0,
                        value: 'notfound',
                    },*/
                    Body: {
                        rawValue: 0,
                        value: 'body',
                    },
                    UserSection: {
                        rawValue: 1,
                        value: 'user_section',
                    },
                    Relate: {
                        rawValue: 1,
                        value: 'relate',
                    },
                    ReplySection: {
                        rawValue: 2,
                        value: 'reply_section',
                    },
                    Children: {
                        rawValue: 3,
                        value: 'children',
                    },
                });
                break;
        }
    }

    get section() {
        return this._section;
    }
}
