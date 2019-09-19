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
import SimpleButton from '@elements/SimpleButton';
import SectionHeader from '@elements/SectionHeader';
import { browserHistory } from 'react-router';
import Point from '@elements/Point';
import { labelShowRoute } from '@infrastructure/RouteInitialize';
import reward_config from '@constants/reward_config';

class TaskHeader extends React.Component {
    static propTypes = {
        repository: PropTypes.object.isRequired,
        style: PropTypes.object,
    };

    static defaultProps = {
        repository: models.Content.build(),
        style: {},
    };

    constructor() {
        super();
    }

    render() {
        const { repository, style } = this.props;

        /*
        <div className="task-header__body__button">
            <SimpleButton
                value="カスタマイズ"
                url={'/customize'}
            />
        </div>
        <div className="task-header__body__button">
            <SimpleButton
                value="詳細へ..."
                url={`/label/${repository.id}`}
            />
        </div>
        */
        return (
            <SectionHeader style={style}>
                <Link
                    className="task-header__link"
                    to={labelShowRoute.getPath({
                        params: { id: repository.id },
                    })}
                >
                    <div className="task-header">
                        <div className="task-header__body">
                            <div className="task-header__body__title">
                                {repository.title}
                            </div>
                            <div className="task-header__body__point">
                                <Point
                                    score={reward_config.getScore(repository)}
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            </SectionHeader>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: state.auth.get('current_user'),
        };
    },

    dispatch => ({})
)(TaskHeader);
