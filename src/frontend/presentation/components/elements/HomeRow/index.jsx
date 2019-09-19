import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import AppPropTypes from '@extension/AppPropTypes';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { Map } from 'immutable';
import tt from 'counterpart';
import { HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';
import { browserHistory } from 'react-router';
import StatsBar from '@modules/StatsBar';
import LabelBar from '@modules/LabelBar';
import {
    contentShowRoute,
    homeNewRoute,
} from '@infrastructure/RouteInitialize';
import UserStatsBar from '@modules/UserStatsBar';
import OpinionAcceptButton from '@elements/OpinionAcceptButton';
import ConditionalBackground from '@modules/ConditionalBackground';
import OpinionSectionButton from '@elements/OpinionSectionButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import QuoteItem from '@elements/QuoteItem';
import ope from '@extension/operator';
import ContentViewer from '@elements/ContentViewer';

class HomeRow extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {
        repository: models.Content.build(),
    };

    static redirect = url => {
        window.location.replace(url);
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.unwrap = this.unwrap.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeRow');
    }

    onClick(e) {
        if (e) e.preventDefault();
        const { showRead, _repository } = this.props;
        browserHistory.push(
            contentShowRoute.getPath({
                params: {
                    id: _repository.id,
                },
            })
        );
        // showRead(repository);
    }

    unwrap() {
        const { _repository } = this.props;
        if (!_repository) return false;
        if (
            _repository.title == HomeRow.defaultProps.repository.title &&
            _repository.body == HomeRow.defaultProps.repository.body &&
            _repository.UserId == HomeRow.defaultProps.repository.UserId
        )
            return false;
        return true;
    }

    render() {
        const {
            showRead,
            repository,
            _repository,
            isShowAcceptButton,
            isShowOpinionButton,
        } = this.props;

        const { onClick } = this;

        if (!this.unwrap()) return <div />;

        return (
            <div className="home-row__link" onClick={onClick}>
                <ConditionalBackground
                    repository={_repository}
                    className={'home-row'}
                >
                    {ope.hasParentContent(_repository) && (
                        <div className="home-row__parent">
                            <QuoteItem
                                text={
                                    `${_repository.ParentContent.title}\n` +
                                    _repository.ParentContent.body
                                }
                                isHTML={true}
                            />
                        </div>
                    )}
                    <h3 className="home-row__title">{_repository.title}</h3>
                    <div className="home-row__border" />
                    <div className="home-row__body">
                        <ContentViewer body={_repository.body} small={true} />
                    </div>
                    {_repository.Labelings && (
                        <div className="home-row__labels">
                            <LabelBar
                                repositories={_repository.Labelings.map(
                                    labeling => {
                                        return labeling.Label;
                                    }
                                )}
                            />
                        </div>
                    )}
                    {!_repository.isPrivate && (
                        <div className="home-row__user">
                            <UserStatsBar repository={_repository.User} />
                        </div>
                    )}
                    {isShowAcceptButton && (
                        <div className="home-row__button">
                            <OpinionAcceptButton repository={_repository} />
                        </div>
                    )}
                    <div className="home-row__foot">
                        <StatsBar
                            showHelp={false}
                            repository={_repository}
                            repository_user={_repository.User}
                            showReplyCounter={true}
                            showCheeringCounter={true}
                            showGoodOpinionCounter={true}
                            showPoint={false}
                            showUpvote={false}
                            showDownvote={false}
                        />
                    </div>
                    {isShowOpinionButton && (
                        <div className="home-row__button">
                            <OpinionSectionButton repository={_repository} />
                        </div>
                    )}
                </ConditionalBackground>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const _repository = contentActions.bind(props.repository, state);
        return {
            current_user: authActions.getCurrentUser(state),
            isShowAcceptButton: contentActions.isShowAcceptButton(
                _repository,
                state
            ),
            isShowOpinionButton: contentActions.isShowOpinionButton(
                _repository,
                state
            ),
            _repository,
        };
    },

    dispatch => ({
        showRead: content => {
            dispatch(contentActions.showRead({ content }));
        },
        hideRead: () => {
            dispatch(contentActions.hideRead());
        },
    })
)(HomeRow);
