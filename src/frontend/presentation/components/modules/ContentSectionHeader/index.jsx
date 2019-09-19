import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SectionHeader from '@elements/SectionHeader';
import { contentShowRoute } from '@infrastructure/RouteInitialize';
import AppPropTypes from '@extension/AppPropTypes';
import LabelBar from '@modules/LabelBar';
import models from '@network/client_models';
import Point from '@elements/Point';
import reward_config from '@constants/reward_config';
import Responsible from '@modules/Responsible';
import tt from 'counterpart';
import Ripple from '@elements/Ripple';
import GradationButton from '@elements/GradationButton';
import OpinionSectionButton from '@elements/OpinionSectionButton';
import GradationIconButton from '@elements/GradationIconButton';

class ContentSectionHeader extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
        style: PropTypes.object,
        sticky: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Content.build(),
        style: {},
        sticky: true,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ContentSectionHeader'
        );
        this.handleClickComment = this.handleClickComment.bind(this);
    }

    handleClickComment = e => {
        const {
            repository,
            showNewComment,
            current_user,
            showPhoneConfirm,
            showLogin,
            addSuccess,
        } = this.props;

        if (!current_user) {
            showLogin();
            return;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return;
        }

        if (repository && current_user) {
            addSuccess(tt('flash.new_message_for_super'));
            showNewComment(repository, current_user);
        }
    };

    render() {
        const { repository, style, sticky } = this.props;
        const { handleClickComment } = this;
        return sticky ? (
            <SectionHeader style={style}>
                <Ripple>
                    <Link
                        className="content-section-header__link"
                        to={contentShowRoute.getPath({
                            params: { id: repository.id },
                        })}
                    >
                        <div className="content-section-header">
                            <div className="content-section-header__body">
                                <div className="content-section-header__left">
                                    <div className="content-section-header__left-title">
                                        {repository.title}
                                    </div>
                                    <div className="content-section-header__left-body">
                                        {''.cleaning_tag(`${repository.body}`)}
                                    </div>
                                </div>
                                <div className="content-section-header__right">
                                    <div className="content-section-header__right-top">
                                        <div className="content-section-header__right-point">
                                            <Point
                                                score={''.decimalize(
                                                    `${reward_config.getScore(
                                                        repository
                                                    )}`
                                                )}
                                            />
                                        </div>
                                        <Responsible
                                            className="content-section-header__right-button"
                                            defaultContent={
                                                <GradationButton
                                                    value={tt('g.do_comment')}
                                                    color="red"
                                                    src={'comment'}
                                                    onClick={
                                                        this.handleClickComment
                                                    }
                                                />
                                            }
                                            breakingContent={
                                                <GradationIconButton
                                                    src="comment"
                                                    color="red"
                                                    size="2x"
                                                    onClick={handleClickComment}
                                                />
                                            }
                                            breakXxl={true}
                                        />
                                    </div>
                                    {(repository.Labelings || align) && (
                                        <div className="content-section-header__right-labels">
                                            <LabelBar
                                                repositories={repository.Labelings.notBotLabels(
                                                    repository.Labelings
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </Ripple>
            </SectionHeader>
        ) : (
            <Ripple>
                <Link
                    className="content-section-header__link"
                    to={contentShowRoute.getPath({
                        params: { id: repository.id },
                    })}
                >
                    <div className="content-section-header">
                        <div className="content-section-header__body">
                            <div className="content-section-header__left">
                                <div className="content-section-header__left-title">
                                    {repository.title}
                                </div>
                                <div className="content-section-header__left-body">
                                    {''.cleaning_tag(`${repository.body}`)}
                                </div>
                            </div>
                            <div className="content-section-header__right">
                                <div className="content-section-header__right-top">
                                    <div className="content-section-header__right-point">
                                        <Point
                                            score={''.decimalize(
                                                `${reward_config.getScore(
                                                    repository
                                                )}`
                                            )}
                                        />
                                    </div>
                                    <Responsible
                                        className="content-section-header__right-button"
                                        defaultContent={
                                            <GradationButton
                                                value={tt('g.comment')}
                                                color="red"
                                                src={'comment'}
                                                onClick={
                                                    this.handleClickComment
                                                }
                                            />
                                        }
                                        breakingContent={
                                            <GradationIconButton
                                                src="comment"
                                                color="red"
                                                size="2x"
                                                onClick={handleClickComment}
                                            />
                                        }
                                        breakXxl={true}
                                    />
                                </div>
                                {(repository.Labelings || align) && (
                                    <div className="content-section-header__right-labels">
                                        <LabelBar
                                            repositories={repository.Labelings.notBotLabels(
                                                repository.Labelings
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        return {
            current_user,
        };
    },

    dispatch => ({
        showLogin: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showLogin());
        },
        showNewComment: (content, user) => {
            dispatch(contentActions.showNewComment({ content, user }));
        },
        showPhoneConfirm: e => {
            if (e) e.preventDefault();
            dispatch(authActions.showPhoneConfirm());
        },
        addSuccess: success => {
            dispatch(appActions.addSuccess({ success }));
        },
    })
)(ContentSectionHeader);
