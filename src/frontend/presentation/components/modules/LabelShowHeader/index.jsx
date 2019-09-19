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
import Img from 'react-image';
import AppPropTypes from '@extension/AppPropType';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class LabelShowHeader extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Label,
    };

    static defaultProps = {
        repository: models.Label.build(),
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'LabelShowHeader'
        );
    }

    render() {
        const { repository } = this.props;
        return (
            <Link className="label-show-header__link">
                <div className="label-show-header">
                    <div className="label-show-header__title">
                        {repository.name}
                    </div>
                    <div className="label-show-header__border" />
                    <div className="label-show-header__body">
                        <a className="label-show-header__body__image__link">
                            <Img
                                src="/icons/coin.svg"
                                className="label-show-header__body__image"
                                alt={tt('alts.default')}
                            />
                        </a>
                        <div className="label-show-header__body__coin">
                            $100
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(LabelShowHeader);
