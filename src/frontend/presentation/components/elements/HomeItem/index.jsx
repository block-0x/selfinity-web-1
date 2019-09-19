import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { Map } from 'immutable';
import tt from 'counterpart';
import { HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';
import StatsBar from '@modules/StatsBar';
import IndexBar from '@modules/IndexBar';
import LabelBar from '@modules/LabelBar';
import { COLOR } from '@entity/Color';
import { browserHistory } from 'react-router';
import Ripple from '@elements/Ripple';
import { contentShowRoute } from '@infrastructure/RouteInitialize';
import UserStatsBar from '@modules/UserStatsBar';
import classNames from 'classnames';
import ConditionalBackground from '@modules/ConditionalBackground';
import OpinionSectionButton from '@elements/OpinionSectionButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import RequestSimpleButton from '@elements/RequestSimpleButton';
import ContentViewer from '@elements/ContentViewer';

class HomeItem extends React.Component {
    static propTypes = {
        repository: PropTypes.object, //.isRequired,
        align: PropTypes.bool,
        isHiddenUser: PropTypes.bool,
        isHiddenLabel: PropTypes.bool,
        isHiddenOpinion: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Content.build(),
        align: false,
        isHiddenUser: false,
        isHiddenLabel: false,
        isHiddenOpinion: false,
    };

    static redirect = url => {
        window.location.replace(url);
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.unwrap = this.unwrap.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeItem');
    }

    onClick(e) {
        if (e) e.preventDefault();
        const { showRead, repository } = this.props;
        browserHistory.push(
            contentShowRoute.getPath({
                params: {
                    id: repository.id,
                },
            })
        );
        // showRead(repository);
    }

    unwrap() {
        const { repository } = this.props;
        if (!repository) return false;
        if (
            repository.title == HomeItem.defaultProps.repository.title &&
            repository.body == HomeItem.defaultProps.repository.body &&
            repository.UserId == HomeItem.defaultProps.repository.UserId
        )
            return false;
        return true;
    }

    render() {
        const {
            showRead,
            repository,
            _repository,
            align,
            isShowOpinionButton,
            isHiddenUser,
            isHiddenLabel,
            isHiddenOpinion,
        } = this.props;

        const { onClick, unwrap } = this;

        if (!unwrap()) return <div />;

        const isRequestWanted = Number.prototype.castBool(
            repository.isRequestWanted
        );
        const isOpinionWanted = Number.prototype.castBool(
            repository.isOpinionWanted
        );

        return (
            <Ripple isOut={false} isHover={false}>
                <div className="home-item__link" onClick={onClick}>
                    <ConditionalBackground
                        repository={repository}
                        className={classNames('home-item', { align })}
                    >
                        <h3 className="home-item__title">{repository.title}</h3>
                        <div className="home-item__border" />
                        <div className="home-item__body">
                            <ContentViewer
                                body={_repository.body}
                                small={true}
                            />
                        </div>
                        {repository.Labelings.length > 0 ? (
                            <div className="home-item__labels">
                                <LabelBar
                                    repositories={repository.Labelings.notBotLabels(
                                        repository.Labelings
                                    )}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    height:
                                        align && !isHiddenLabel ? '34px' : '0',
                                }}
                            />
                        )}
                        {!repository.isPrivate && !isHiddenUser ? (
                            <div className="home-item__user">
                                <UserStatsBar repository={repository.User} />
                            </div>
                        ) : (
                            <div
                                style={{
                                    height:
                                        align && !isHiddenUser ? '32px' : '0',
                                }}
                            />
                        )}
                        <div
                            className="home-item__foot"
                            style={isHiddenOpinion ? { height: '64px' } : {}}
                        >
                            <IndexBar
                                repository={repository}
                                repository_user={repository.User}
                            />
                        </div>
                        {isShowOpinionButton &&
                            !isRequestWanted &&
                            !isOpinionWanted &&
                            !isHiddenOpinion && (
                                <div className="home-item__button">
                                    <OpinionSectionButton
                                        repository={repository}
                                    />
                                </div>
                            )}
                        {isOpinionWanted &&
                            !isHiddenOpinion && (
                                <div className="home-item__button">
                                    <OpinionSectionButton
                                        repository={repository}
                                    />
                                </div>
                            )}
                    </ConditionalBackground>
                </div>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
            _repository: contentActions.bind(props.repository, state),
            isShowOpinionButton: contentActions.isShowOpinionButton(
                props.repository,
                state
            ),
        };
    },

    dispatch => ({
        showRead: content => {
            dispatch(contentActions.setShow({ content }));
            dispatch(contentActions.showRead());
        },
        hideRead: () => {
            dispatch(contentActions.hideRead());
        },
    })
)(HomeItem);
