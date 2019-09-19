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
import models from '@network/client_models';
import LabelStatsBar from '@modules/LabelStatsBar';
import LabelBar from '@modules/LabelBar';
import LabelStockButton from '@elements/LabelStockButton';
import { browserHistory } from 'react-router';
import { labelShowRoute } from '@infrastructure/RouteInitialize';

class LabelItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Label,
    };

    static defaultProps = {
        repository: models.Label.build(),
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const { repository } = this.props;
        if (e) e.preventDefault();
        browserHistory.push(
            labelShowRoute.getPath({
                params: {
                    id: repository.id,
                },
            })
        );
    }

    render() {
        const { repository } = this.props;

        const { onClick } = this;

        return (
            <div className="label-item__link" onClick={onClick}>
                <div className="label-item">
                    <h3 className="label-item__title">{repository.title}</h3>
                    <div className="label-item__border" />
                    <div className="label-item__button">
                        <LabelStockButton repository={repository} />
                    </div>
                    <div className="label-item__foot">
                        <LabelStatsBar repository={repository} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({})
)(LabelItem);
