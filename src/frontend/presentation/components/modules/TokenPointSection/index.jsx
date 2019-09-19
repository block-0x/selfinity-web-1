import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import tt from 'counterpart';
import Responsible from '@modules/Responsible';
import Point from '@elements/Point';
import models from '@network/client_models';
import Icon from '@elements/Icon';
import reward_config from '@constants/reward_config';
import NavigatorItem from '@elements/NavigatorItem';
import NavigatorDescItem from '@elements/NavigatorDescItem';
import NavigatorDescMenu from '@modules/NavigatorDescMenu';

class TokenPointSection extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Request,
    };

    static defaultProps = {
        repository: models.Request.build({}),
    };

    state = {};

    constructor(props) {
        super(props);
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TokenPointSection'
        );
    }

    onClick(e) {
        const { repository } = this.props;
        if (e) e.stopPropagation();
        if (!repository) return;
    }

    render() {
        const { repository } = this.props;

        const { onClick } = this;

        return (
            <div className="token-point-section" onClick={onClick}>
                <div className="token-point-section__image">
                    <Icon
                        src="selftoken-mini-logo"
                        size={'3x'}
                        className="token-point-section__image-src"
                    />
                </div>
                <div className="token-point-section__desc">
                    {tt('g.get_token_desc') + ' : '}
                </div>
                <div className="token-point-section__score">
                    {''.decimalize(`${repository.bid_amount}`)}
                </div>
                <div className="token-point-section__help">
                    <NavigatorItem
                        content={
                            <NavigatorDescMenu>
                                <NavigatorDescItem
                                    title={tt('g.merit_point')}
                                    value={tt('g.token_desc')}
                                    src={'selftoken-mini-logo'}
                                />
                            </NavigatorDescMenu>
                        }
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TokenPointSection);
