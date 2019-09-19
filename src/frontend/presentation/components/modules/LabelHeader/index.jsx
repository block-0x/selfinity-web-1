import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from '@elements/TimeAgoWrapper';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import tt from 'counterpart';
import { HomeModel, HomeModels } from '@entity';
import models from '@network/client_models';

import LabelStockButton from '@elements/LabelStockButton';
import LabelStatsBar from '@modules/LabelStatsBar';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class LabelHeader extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: models.Content.build(),
    };

    constructor(props) {
        super(props);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'LabelHeader');
    }

    onClickAdd(e) {
        if (e) e.preventDefault();
    }

    render() {
        const { repository } = this.props;

        return (
            <Link className="label-header__link">
                <div className="label-header">
                    <h1 className="label-header__title">{repository.title}</h1>
                    <div className="label-header__border" />
                    <div className="label-header__button">
                        <LabelStockButton repository={repository} />
                    </div>
                    <div className="label-header__foot">
                        <LabelStatsBar repository={repository} />
                    </div>
                </div>
            </Link>
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
)(LabelHeader);
