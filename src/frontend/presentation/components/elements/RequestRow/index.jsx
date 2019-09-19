import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import { Map } from 'immutable';
import tt from 'counterpart';
import models from '@network/client_models';
import { browserHistory } from 'react-router';
import StatsBar from '@modules/StatsBar';
import RequestBar from '@elements/RequestBar';
import AppPropTypes from '@extension/AppPropTypes';
import Batch from '@modules/Batch';
import {
    requestShowRoute,
    userShowRoute,
    contentShowRoute,
} from '@infrastructure/RouteInitialize';
import RequestStatus from '@elements/RequestStatus';
import RequestAcceptButton from '@elements/RequestAcceptButton';
import AtMarkItem from '@elements/AtMarkItem';
import UserStatsBar from '@modules/UserStatsBar';
import TokenPointSection from '@modules/TokenPointSection';
import RequestReplyButton from '@elements/RequestReplyButton';
import ContentViewer from '@elements/ContentViewer';

class RequestRow extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
        allowAnswer: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Request.build(),
        allowAnswer: false,
    };

    static redirect = url => {
        window.location.replace(url);
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.unwrap = this.unwrap.bind(this);
    }

    onClick(e) {
        // if (e) e.preventDefault();
        // const { showRead, _repository } = this.props;
        // browserHistory.push(
        //     requestShowRoute.getPath({
        //         params: {
        //             id: _repository.id,
        //         },
        //     })
        // );
    }

    unwrap() {
        const { _repository } = this.props;
        if (!_repository) return false;
        if (
            _repository.title == RequestRow.defaultProps.repository.title &&
            _repository.body == RequestRow.defaultProps.repository.body &&
            _repository.VoterId == RequestRow.defaultProps.repository.VoterId
        )
            return false;
        return true;
    }

    isReplyShow() {
        const { current_user, _repository, allowAnswer } = this.props;

        if (!current_user || !_repository) return false;
        return (
            _repository.VoteredId == current_user.id &&
            allowAnswer &&
            !Number.prototype.castBool(_repository.isAnswered) &&
            !Number.prototype.castBool(_repository.isResolved) &&
            !!_repository.body
        );
    }

    render() {
        const {
            showRead,
            _repository,
            target,
            current_user,
            isMyAccount,
            allowAnswer,
        } = this.props;

        const { onClick } = this;

        if (!this.unwrap()) return <div />;

        const content =
            contentShowRoute.isValidPath(
                browserHistory.getCurrentLocation().pathname
            ) && target;

        return (
            <Batch src="auction" padding={'8px 12px'}>
                <div className="request-row__link" onClick={onClick}>
                    <div className="request-row">
                        <div className="request-row__status">
                            <RequestStatus repository={_repository} />
                        </div>
                        {_repository.TargetUser && (
                            <div className="request-row__at">
                                <AtMarkItem
                                    text={_repository.TargetUser.nickname}
                                    link={userShowRoute.getPath({
                                        params: {
                                            id: _repository.TargetUser.id,
                                        },
                                    })}
                                />
                            </div>
                        )}
                        <div className="request-row__title">
                            <ContentViewer
                                body={_repository.body}
                                small={true}
                            />
                        </div>
                        <div className="request-row__border" />
                        {content &&
                            isMyAccount && (
                                <div className="request-row__button">
                                    <RequestAcceptButton
                                        repository={_repository}
                                        target={content}
                                    />
                                </div>
                            )}
                        <div className="request-row__token">
                            <TokenPointSection repository={_repository} />
                        </div>
                        {!_repository.isPrivate && (
                            <div className="request-row__user">
                                <UserStatsBar repository={_repository.Voter} />
                            </div>
                        )}
                        <div className="request-row__foot">
                            <StatsBar
                                repository={_repository}
                                repository_user={_repository.Voter}
                                showDownvote={false}
                                showUpvote={false}
                                showPoint={false}
                                showTokenPoint={true}
                                showUser={false}
                            />
                        </div>
                        {this.isReplyShow() && (
                            <div className="request-row__button">
                                <RequestReplyButton repository={_repository} />
                            </div>
                        )}
                    </div>
                </div>
            </Batch>
        );
    }
}
/*
                    <div className="request-row__labels">
                        <RequestBar repository={repository} />
                    </div>
*/

export default connect(
    (state, props) => {
        return {
            target: contentActions.getShowContent(state).content,
            current_user: authActions.getCurrentUser(state),
            isMyAccount: userActions.isMyAccount(state, props.repository.Voter),
            _repository: requestActions.bind(props.repository, state),
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
)(RequestRow);
