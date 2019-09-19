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

import SimpleButton from '@elements/SimpleButton';
import StatsBar from '@modules/StatsBar';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class ContentHeader extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: models.Content.build(),
    };

    constructor(props) {
        super(props);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ContentHeader'
        );
    }

    onClickAdd(e) {
        if (e) e.preventDefault();
    }

    render() {
        const { repository } = this.props;

        return (
            <Link className="content-header__link">
                <div className="content-header">
                    <div className="content-header__title">
                        {repository.title}
                    </div>
                    <div className="content-header__border" />
                    <div className="content-header__foot">
                        <StatsBar repository={repository} />
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
)(ContentHeader);
