import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import CampaignSpreadShowList from '@cards/CampaignSpreadShowList';
import IndexComponentImpl from '@pages/IndexComponent';

class CampaignSpreadShow extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'CampaignSpreadShow'
        );
    }

    render() {
        return (
            <IndexComponentImpl>
                <div className="campaign-spread-show">
                    <CampaignSpreadShowList />
                </div>
            </IndexComponentImpl>
        );
    }
}

module.exports = {
    path: '/campaign/spread',
    component: connect(
        (state, props) => {
            return {};
        },
        dispatch => ({})
    )(CampaignSpreadShow),
};
