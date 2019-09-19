import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as requestActions from '@redux/Request/RequestReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { Map } from 'immutable';
import tt from 'counterpart';
import models from '@network/client_models';
import StatsBar from '@modules/StatsBar';
import UserStatsBar from '@modules/UserStatsBar';
import LabelBar from '@modules/LabelBar';
import RequestBar from '@elements/RequestBar';
import RequestReplyButton from '@elements/RequestReplyButton';
import { browserHistory } from 'react-router';
import PictureItem from '@elements/PictureItem';
import Batch from '@modules/Batch';
import AtMarkItem from '@elements/AtMarkItem';
import {
    requestShowRoute,
    userShowRoute,
    contentShowRoute,
} from '@infrastructure/RouteInitialize';
import ContentViewer from '@elements/ContentViewer';
import RequestStatus from '@elements/RequestStatus';

class RequestItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
        allowAnswer: PropTypes.bool,
    };

    static defaultProps = {
        repository: models.Request.build(),
        allowAnswer: true,
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
        const { _repository } = this.props;
        if (e) e.preventDefault();
        browserHistory.push(`/request/${_repository.id}`);
    }

    unwrap() {
        const { _repository } = this.props;
        if (!_repository) return false;
        if (
            _repository.title == RequestItem.defaultProps.repository.title &&
            _repository.body == RequestItem.defaultProps.repository.body &&
            _repository.VoterId == RequestItem.defaultProps.repository.VoterId
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
        const { _repository, current_user, allowAnswer } = this.props;

        const { onClick } = this;

        if (!this.unwrap()) return <div />;

        return (
            <Batch src="auction" padding={'8px 12px'}>
                <div className="request-item__link" onClick={onClick}>
                    <div className="request-item">
                        <div className="request-item__left">
                            <div className="request-item__status">
                                <RequestStatus repository={_repository} />
                            </div>
                            {_repository.Voter &&
                                !_repository.isPrivate && (
                                    <div className="request-item__left-voter">
                                        <UserStatsBar
                                            repository={_repository.Voter}
                                        />
                                    </div>
                                )}
                            <div className="request-item__left-foot">
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
                        </div>
                        <div className="request-item__right">
                            {_repository.TargetUser && (
                                <div className="request-item__right__at">
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
                            <div className="request-item__right-title">
                                <ContentViewer
                                    body={_repository.body}
                                    small={true}
                                />
                            </div>
                        </div>
                        {this.isReplyShow() && (
                            <div className="request-item__button">
                                <RequestReplyButton repository={_repository} />
                            </div>
                        )}
                    </div>
                </div>
            </Batch>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
            _repository: requestActions.bind(props.repository, state),
        };
    },

    dispatch => ({})
)(RequestItem);

/*
<div className="request-item__body">
    {this.isReplyShow() && (
        <div className="request-item__body__button">
            <RequestReplyButton repository={repository} />
        </div>
    )}
</div>
*/
