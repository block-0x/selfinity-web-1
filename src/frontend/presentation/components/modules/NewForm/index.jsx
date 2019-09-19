import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import tt from 'counterpart';
import { browserHistory } from 'react-router';
import GradationButton from '@elements/GradationButton';
import SimpleButton from '@elements/SimpleButton';
import { Enum, defineEnum } from '@extension/Enum';
import LoadingIndicator from '@elements/LoadingIndicator';
import AtUserItem from '@elements/AtUserItem';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import sanitize from 'sanitize-html';
import Icon from '@elements/Icon';
import { Set } from 'immutable';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { SUBMIT_TYPE, CONTENT_TYPE, Color } from '@entity';
import models from '@network/client_models';
import rte from '@network/rte';
import ope from '@extension/operator';
import LabelForm from '@modules/LabelForm';
import UserForm from '@modules/UserForm';
import ReplyViewer from '@modules/ReplyViewer';
import safe2json from '@extension/safe2json';
import SwitchButton from '@elements/SwitchButton';
import autobind from 'class-autobind';
import ConditionalBackground from '@modules/ConditionalBackground';
import data_config from '@constants/data_config';
import QuoteItem from '@elements/QuoteItem';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';

class NewForm extends Component {
    isStory() {
        return this.state.type.value == SUBMIT_TYPE.Story.value;
    }

    isEdit() {
        return this.state.type.value == SUBMIT_TYPE.Edit.value;
    }

    isComment() {
        return this.state.type.value == SUBMIT_TYPE.Comment.value;
    }

    getSection() {
        const { repository, current_user } = this.props;

        if (ope.isContent(repository) && ope.isWanted(repository)) {
            return defineEnum({
                Header: {
                    rawValue: 0,
                    value: 'Header',
                    string: tt('g.new_wanted'),
                },
                Wanted: {
                    rawValue: 1,
                    value: 'Wanted',
                },
                Title: {
                    rawValue: 1,
                    value: 'Title',
                    string: tt('g.form_title'),
                    field: 'title',
                },
                Border: {
                    rawValue: 2,
                    value: 'Border',
                },
                Content: {
                    rawValue: 3,
                    value: 'Content',
                    string: tt('g.form_body'),
                    field: 'body',
                },
                Submit: {
                    rawValue: 6,
                    value: 'Submit',
                    string: tt('g.submit'),
                },
            });
        }

        switch (true) {
            case ope.hasParentContent(repository):
            case ope.hasTargetRequest(repository):
                return defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'Header',
                        string: tt('g.new_comment'),
                    },
                    Reply: {
                        rawValue: 1,
                        value: 'Reply',
                        string: ope.hasParentContent(repository)
                            ? tt('g.target_contents')
                            : tt('g.target_requests'),
                    },
                    Border0: {
                        rawValue: 2,
                        value: 'Border',
                    },
                    Anonymous: {
                        rawValue: 1,
                        value: 'Anonymous',
                    },
                    Title: {
                        rawValue: 3,
                        value: 'Title',
                        string: tt('g.opinion_form_title'),
                        field: 'title',
                    },
                    Border: {
                        rawValue: 4,
                        value: 'Border',
                    },
                    Content: {
                        rawValue: 5,
                        value: 'Content',
                        string: tt('g.opinion_form_body', {
                            data: ope.hasTargetRequest(repository)
                                ? ''
                                      .cleaning_tag(
                                          `${repository.Requests[0].body}`
                                      )
                                      .slice(
                                          0,
                                          data_config.email_desc_max_limit
                                      ) + '...'
                                : repository.ParentContent.title,
                        }),
                        field: 'body',
                    },
                    // Assign: {
                    //     rawValue: 4,
                    //     value: 'Assign',
                    // },
                    Label: {
                        rawValue: 6,
                        value: 'Label',
                    },
                    Cheering: {
                        rawValue: 7,
                        value:
                            ope.shouldCheering(repository, current_user) &&
                            'Cheering',
                    },
                    Submit: {
                        rawValue: 8,
                        value: 'Submit',
                        string: tt('g.submit'),
                    },
                });
            default:
            case ope.isContent(repository) &&
                !ope.hasParentContent(repository) &&
                !ope.hasTargetRequest(repository):
                return defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'Header',
                        string: tt('g.new_posts'),
                    },
                    Anonymous: {
                        rawValue: 1,
                        value: 'Anonymous',
                    },
                    Title: {
                        rawValue: 1,
                        value: 'Title',
                        string: tt('g.form_title'),
                        field: 'title',
                    },
                    Border: {
                        rawValue: 2,
                        value: 'Border',
                    },
                    Content: {
                        rawValue: 3,
                        value: 'Content',
                        string: tt('g.form_body'),
                        field: 'body',
                    },
                    // Assign: {
                    //     rawValue: 4,
                    //     value: 'Assign',
                    // },
                    Label: {
                        rawValue: 4,
                        value: 'Label',
                    },
                    Submit: {
                        rawValue: 6,
                        value: 'Submit',
                        string: tt('g.submit'),
                    },
                });
            case ope.isRequest(repository):
                return defineEnum({
                    Header: {
                        rawValue: 0,
                        value: 'Header',
                        string: tt('g.new_request'),
                    },
                    AtUser: {
                        rawValue: 1,
                        value: 'AtUser',
                        string: 'New',
                    },
                    Bid: !repository.id && {
                        rawValue: 1,
                        string: tt('g.bid_amount'),
                        field: 'bid_amount',
                        value: 'Bid',
                    },
                    Anonymous: {
                        rawValue: 1,
                        value: 'Anonymous',
                    },
                    Border: {
                        rawValue: 2,
                        value: 'Border',
                    },
                    Content: {
                        rawValue: 3,
                        value: 'Content',
                        string: tt('g.form_request_body', {
                            data: repository.TargetUser.nickname,
                        }),
                        field: 'body',
                    },
                    Submit: {
                        rawValue: 4,
                        value: 'Submit',
                        string: tt('g.submit'),
                    },
                });
        }
    }

    constructor(props) {
        super(props);
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'NewForm');
    }

    setAssignsFromProps(props) {
        this.setState({
            assigns: props.assigns,
        });
        return;
    }

    setLabelsFromProps(props) {
        this.setState({
            labels: props.labels,
        });
        return;
    }

    setStateFromProps(props) {
        const propsType = ope.getType(props.repository) || props.type;

        const getLabelsFromProps = props => {
            if (props.repository.Labelings) {
                if (
                    props.repository.Labelings.map(val => val.Label).length > 0
                ) {
                    return props.repository.Labelings.map(val => val.Label);
                }
            }
            return props.labels;
        };

        const getAssignsFromProps = props => {
            if (
                props.repository.Requests &&
                props.repository.Requests instanceof Array
            ) {
                if (
                    props.repository.Reqests.filter(val => val.isAssign)
                        .length > 0
                ) {
                    return props.repository.Reqests.filter(
                        val => val.isAssign
                    ).map(val => val.Voter);
                }
            }
            return props.assigns;
        };

        this.setState({
            progress: {},
            type: propsType,
            section: this.getSection(),
            defaultContent: props.repository,
            title: props.repository.title || '',
            rteBody: rte.stateFromHtml(
                this.props.richTextEditor,
                props.repository.body
            ),
            loading: false,
            disabled: false,
            postError: false,
            titleError: false,
            isStory: propsType == SUBMIT_TYPE.Story,
            isEdit: propsType == SUBMIT_TYPE.Edit,
            isComment: propsType == SUBMIT_TYPE.Comment,
            noClipboardData: true,
            labels: getLabelsFromProps(props),
            // assigns: getAssignsFromProps(props),
            target_user: props.repository.TargetUser || models.User.build(),
            isCheering: props.repository.isCheering,
            isPrivate: props.repository.isPrivate,
            bid_amount: props.repository.bid_amount || 0,
            isOpinionWanted: Number.prototype.castBool(
                props.repository.isOpinionWanted
            ),
            isRequestWanted: Number.prototype.castBool(
                props.repository.isRequestWanted
            ),
        });
    }

    componentWillMount() {
        this.setStateFromProps(this.props);

        if (!this.props.current_user) {
            this.props.hideNew();
            this.props.showLogin();
            return;
        } else if (!this.props.current_user.verified) {
            this.props.hideNew();
            this.props.showPhoneConfirm();
            return;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.labels.length > 0) {
            this.setLabelsFromProps(nextProps);
        }
        // if (nextProps.assigns.length > 0) {
        //     this.setAssignsFromProps(nextProps);
        // }
    }

    resetState() {}

    onBidChange = e => {
        const { current_user } = this.props;

        let bid_amount = 0;
        try {
            bid_amount = Number(e.target.value);
            if (bid_amount > 0 && e.target.value.indexOf('0') == 0) {
                bid_amount = Number(e.target.value.slice(1));
            }
            if (bid_amount < 0) {
                bid_amount = 0;
            } else if (bid_amount > current_user.token_balance) {
                bid_amount = current_user.token_balance;
            }
        } catch (e) {
            bid_amount = 0;
        }
        this.setState({ bid_amount });
    };

    onTitleChange = e => {
        this.setState({ title: e.target.value });
    };

    onBodyChange = e => {
        this.setState({ rteBody: e });
    };

    onCheeringChange = e => {
        this.setState({ isCheering: e });
    };

    onPrivateChange = e => {
        this.setState({ isPrivate: e });
    };

    onOpinionWantedChange = e => {
        this.setState({
            isOpinionWanted: true,
            isRequestWanted: false,
        });
    };

    onRequestWantedChange = e => {
        this.setState({
            isOpinionWanted: true,
            isRequestWanted: false,
        });
    };

    showDraftSaved() {
        // const { draft } = this.refs;
        // draft.className = 'newForm__draft';
        // void draft.offsetWidth; // reset animation
        // draft.className = 'newForm__draft newForm__draft-saved';
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        if (!acceptedFiles.length) {
            if (rejectedFiles.length) {
                this.setState({
                    progress: { error: 'Please insert only image files.' },
                });
                console.log('onDrop Rejected files: ', rejectedFiles);
            }
            return;
        }
        const file = acceptedFiles[0];
        this.upload(file, file.name);
    };

    onOpenClick = () => {
        this.dropzone.open();
    };

    onPasteCapture = e => {
        try {
            if (e.clipboardData) {
                for (const item of e.clipboardData.items) {
                    if (item.kind === 'file' && /^image\//.test(item.type)) {
                        const blob = item.getAsFile();
                        this.upload(blob);
                    }
                }
            } else {
                // http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
                // contenteditable element that catches all pasted data
                this.setState({ noClipboardData: true });
            }
        } catch (error) {
            console.error('Error analyzing clipboard event', error);
        }
    };

    upload = (file, name = '') => {
        const { uploadImage } = this.props;
        this.setState({
            progress: { message: tt('reply_editor.uploading') },
        });
        uploadImage(file, progress => {
            if (progress.url) {
                this.setState({ progress: {} });
                const { url } = progress;
                const image_md = `![${name}](${url})`;
                // const { body } = this.state;
                const { selectionStart, selectionEnd } = this.refs.postRef;
                // TODODODODO:
                // body.props.onChange(
                //     body.value.substring(0, selectionStart) +
                //         image_md +
                //         body.value.substring(selectionEnd, body.value.length)
                // );
            } else {
                this.setState({ progress });
            }
            setTimeout(() => {
                this.setState({ progress: {} });
            }, 4000); // clear message
        });
    };

    startLoadingIndicator = () => {
        this.setState({
            loading: true,
            postError: undefined,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const {
            title,
            rteBody,
            labels,
            isCheering,
            isPrivate,
            isRequestWanted,
            isOpinionWanted,
            assigns,
            bid_amount,
        } = this.state;

        const {
            createContent,
            current_user,
            repository,
            createRequest,
            showLogin,
            showPhoneConfirm,
            updateContent,
            updateRequest,
            hideNew,
        } = this.props;

        let { defaultContent } = this.state;

        if (!current_user) {
            hideNew();
            showLogin();
            return;
        } else if (!current_user.verified) {
            hideNew();
            showPhoneConfirm();
            return;
        }

        defaultContent.title = title;
        defaultContent.body = rte.stateToHtml(rteBody);
        defaultContent.isPrivate = isPrivate;
        if (isOpinionWanted && isRequestWanted) return;
        defaultContent.isOpinionWanted = isOpinionWanted;
        defaultContent.isRequestWanted = isRequestWanted;

        if (ope.isContent(defaultContent)) {
            defaultContent.Labels = labels
                .map(val => models.Label.build(val))
                .map(val => safe2json(val));
            // defaultContent.Assigns = assigns
            //     .map(val => models.User.build(val))
            //     .map(val => safe2json(val))
            //     .map(val =>
            //         models.Request.build({
            //             ...val,
            //             isAssign: true,
            //             VoteredId: val.id,
            //             VoterId: current_user.id,
            //         })
            //     );
            // if (defaultContent.Assigns.length > 0) {
            //     defaultContent.isAssign = true;
            // }
            defaultContent.isCheering = isCheering;
            defaultContent.UserId = current_user.id;
            this.isStory()
                ? createContent(defaultContent)
                : updateContent(defaultContent);
        } else if (ope.isRequest(defaultContent)) {
            defaultContent.bid_amount = Number(bid_amount);
            defaultContent.title = '';
            this.isStory()
                ? createRequest(defaultContent)
                : updateRequest(defaultContent);
        }
    };

    render() {
        const {
            className,
            classes,
            style,
            richTextEditor,
            current_user,
            disabled,
            repository,
            ...inputProps
        } = this.props;

        const {
            postError,
            loading,
            titleError,
            isStory,
            isEdit,
            isComment,
            noClipboardData,
            section,
            labels,
            assigns,
            defaultContent,
            target_user,
            isCheering,
            isPrivate,
            isRequestWanted,
            isOpinionWanted,
        } = this.state;

        const toolbarConfig = {
            display: [
                'INLINE_STYLE_BUTTONS',
                'BLOCK_TYPE_BUTTONS',
                'LINK_BUTTONS',
                'IMAGE_BUTTON',
                'BLOCK_TYPE_DROPDOWN',
                'HISTORY_BUTTONS',
            ],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Strikethrough', style: 'STRIKETHROUGH' },
                { label: 'Monospace', style: 'CODE' },
                { label: 'Underline', style: 'UNDERLINE' },
            ],
            BLOCK_TYPE_DROPDOWN: [
                { label: 'Normal', style: 'unstyled' },
                { label: 'Heading Large', style: 'header-two' },
                { label: 'Heading Medium', style: 'header-three' },
                { label: 'Heading Small', style: 'header-four' },
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: 'UL', style: 'unordered-list-item' },
                { label: 'OL', style: 'ordered-list-item' },
                { label: 'Blockquote', style: 'blockquote' },
            ],
        };

        const { onTitleChange, onBodyChange, handleSubmit, onBidChange } = this;

        const RichTextEditor = richTextEditor;

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'Border':
                        return <div className="new-form__border" key={index} />;
                    case 'AtUser':
                        return (
                            <div className="new-form__item__atuser" key={index}>
                                <AtUserItem repository={target_user} />
                            </div>
                        );
                    case 'Title':
                        return (
                            <div className="new-form__item__title" key={index}>
                                <input
                                    className="new-form__item__title-input"
                                    type="text"
                                    name={item.field}
                                    onChange={onTitleChange}
                                    value={this.state.title}
                                    disabled={loading}
                                    required
                                    placeholder={item.string}
                                    ref="titleRef"
                                    autoComplete="off"
                                    tabIndex={1}
                                />
                                {titleError && (
                                    <div className="new-form__item__title-error">
                                        {titleError}
                                    </div>
                                )}
                            </div>
                        );
                    case 'Label':
                        return (
                            <div className="new-form__labels" key={index}>
                                <LabelForm key={index} repositories={labels} />
                            </div>
                        );
                    case 'Assign':
                        return (
                            <div className="new-form__labels" key={index}>
                                <UserForm key={index} repositories={assigns} />
                            </div>
                        );
                    case 'Content':
                        return (
                            <div
                                className={'new-form__item__content'}
                                key={index}
                            >
                                {process.env.BROWSER ? (
                                    <RichTextEditor
                                        ref="rte"
                                        readOnly={loading}
                                        value={this.state.rteBody}
                                        onChange={onBodyChange}
                                        tabIndex={2}
                                        placeholder={item.string}
                                        toolbarConfig={toolbarConfig}
                                    />
                                ) : (
                                    <div />
                                )}
                                {postError && (
                                    <div
                                        className="new-form__item__content-error"
                                        key={index}
                                    >
                                        {postError}
                                    </div>
                                )}
                            </div>
                        );
                    case 'Reply':
                        return (
                            <div className="new-form__replies" key={index}>
                                <QuoteItem
                                    text={
                                        `${
                                            ope.getRepliesFromContent(
                                                defaultContent
                                            )[0].title
                                        }\n` +
                                        ope.getRepliesFromContent(
                                            defaultContent
                                        )[0].body
                                    }
                                    isHTML={true}
                                />
                            </div>
                        );
                    case 'Anonymous':
                        return (
                            <div className={'new-form__anonymouse'} key={index}>
                                <div className="new-form__anonymouse-input">
                                    <SwitchButton
                                        active={Number.prototype.castBool(
                                            isPrivate
                                        )}
                                        color={'blue'}
                                        onChange={this.onPrivateChange}
                                        title={tt('g.anonymouse')}
                                    />
                                </div>
                            </div>
                        );

                    case 'Bid':
                        return (
                            <div className={'new-form__bid'} key={index}>
                                <span className="new-form__bid-value">
                                    {tt('g.bid_amount_placeholder', {
                                        data: current_user.token_balance,
                                    })}
                                </span>
                                <input
                                    className="new-form__bid-input"
                                    type="number"
                                    step="0.0001"
                                    name={item.field}
                                    onChange={onBidChange}
                                    value={this.state.bid_amount}
                                    disabled={loading}
                                    required
                                    placeholder={item.string}
                                    ref="bidAmountRef"
                                    autoComplete="off"
                                    tabIndex={1}
                                    style={{ float: 'left' }}
                                />
                                <div
                                    className="new-form__cheering-value"
                                    style={{ paddingLeft: '8px' }}
                                >
                                    <NavigatorItem
                                        content={
                                            <NavigatorDescMenu>
                                                <NavigatorDescItem
                                                    title={tt(
                                                        'g.auction_title'
                                                    )}
                                                    value={tt('g.auction_desc')}
                                                    src={'auction'}
                                                />
                                            </NavigatorDescMenu>
                                        }
                                    />
                                </div>
                            </div>
                        );
                    case 'Payout':
                        return (
                            <div className={'NewForm__options'} key={index} />
                        );
                    case 'Submit':
                        return (
                            <div className="new-form__item__submit" key={index}>
                                <div className="new-form__item__submit-button">
                                    <GradationButton
                                        value={item.string}
                                        submit={true}
                                        active={disabled}
                                        disabled={disabled}
                                    />
                                </div>
                            </div>
                        );
                    case 'Header':
                        return (
                            <div key={index} className="new-form__header">
                                {item.string}
                            </div>
                        );
                    case 'Cheering':
                        return (
                            <div key={index} className="new-form__cheering">
                                <div className="new-form__cheering-input">
                                    <SwitchButton
                                        active={Number.prototype.castBool(
                                            isCheering
                                        )}
                                        onChange={this.onCheeringChange}
                                        title={tt('g.cheering_mode')}
                                    />
                                </div>
                                <div className="new-form__cheering-value">
                                    <NavigatorItem
                                        content={
                                            <NavigatorDescMenu>
                                                <NavigatorDescItem
                                                    title={tt('g.cheering')}
                                                    value={tt(
                                                        'g.cheering_content_desc',
                                                        {
                                                            data:
                                                                repository
                                                                    .ParentContent
                                                                    .User
                                                                    .nickname,
                                                        }
                                                    )}
                                                    src={'red-good-img'}
                                                />
                                            </NavigatorDescMenu>
                                        }
                                    />
                                </div>
                            </div>
                        );
                    case 'Wanted':
                        return (
                            <div className={'new-form__anonymouse'} key={index}>
                                <div className="new-form__anonymouse-input">
                                    <SwitchButton
                                        active={isOpinionWanted}
                                        onChange={this.onOpinionWantedChange}
                                        title={tt('g.opinion_wanted')}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        );
                    default:
                        return <div key={index} />;
                }
            });

        return (
            <div className="new-form">
                <form
                    onSubmit={handleSubmit}
                    onChange={() => {
                        this.setState({ postError: false });
                    }}
                >
                    <ConditionalBackground
                        repository={models.Content.build({
                            isCheering: Number.prototype.castBool(isCheering),
                            isBetterOpinion: Number.prototype.castBool(
                                repository.isBetterOpinion
                            ),
                            isBetterAnswer: Number.prototype.castBool(
                                repository.isBetterAnswer
                            ),
                        })}
                    >
                        <div className={'new-form__items'}>
                            {renderItem(section)}
                        </div>
                    </ConditionalBackground>
                </form>
            </div>
        );
    }
}

NewForm.defaultProps = {
    className: '',
    disabled: false,
    style: null,
    isStory: false,
    type: SUBMIT_TYPE.Story,
    section: defineEnum({
        Header: {
            rawValue: 0,
            value: 'Header',
            string: '新規作成',
        },
        Title: {
            rawValue: 1,
            value: 'Title',
            string: 'あなたの考え',
            field: 'title',
        },
        Border: {
            rawValue: 2,
            value: 'Border',
        },
        Content: {
            rawValue: 3,
            value: 'Content',
            string: '詳細や理由',
            field: 'body',
        },
        Label: {
            rawValue: 4,
            value: 'Label',
        },
        Submit: {
            rawValue: 6,
            value: 'Submit',
            string: 'Submit',
        },
    }),
    repository: models.Content.build({
        body: '',
    }),
    labels: [],
};

NewForm.propTypes = {
    classes: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    section: PropTypes.object,
    formId: PropTypes.string.isRequired,
    type: PropTypes.object,
    onCancel: PropTypes.func,
    repository: PropTypes.oneOfType([
        AppPropTypes.Content,
        AppPropTypes.Request,
    ]),
    labels: PropTypes.arrayOf(AppPropTypes.Label),
    richTextEditor: PropTypes.func,
    defaultPayoutType: PropTypes.string,
    payoutType: PropTypes.string,
    createContent: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
};

export default formId =>
    connect(
        (state, ownProps) => {
            const repository = contentActions.getNewContent(state);
            const current_user = authActions.getCurrentUser(state);
            const labels = contentActions.getNewContentLabel(state);
            const assigns = contentActions.getNewContentAssign(state);
            const disabled = state.app.get('screen_loading');
            return {
                formId: formId,
                richTextEditor: rte.richTextEditor,
                current_user,
                repository,
                labels,
                disabled,
                assigns,
            };
        },
        dispatch => ({
            uploadImage: (file, progress) => {
                dispatch(contentActions.uploadImage({ file, progress }));
            },
            createContent: content => {
                dispatch(contentActions.createContent({ content }));
            },
            updateContent: content => {
                dispatch(contentActions.updateContent({ content }));
            },
            hideNew: () => {
                dispatch(contentActions.hideNew());
            },
            createRequest: request => {
                dispatch(transactionActions.createRequest({ request }));
            },
            updateRequest: request => {
                dispatch(transactionActions.updateRequest({ request }));
            },
            showLogin: () => {
                dispatch(authActions.showLogin());
            },
            showPhoneConfirm: () => {
                dispatch(authActions.showPhoneConfirm());
            },
        })
    )(NewForm);
