import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import HomeRow from '@elements/HomeRow';
import tt from 'counterpart';
import NotFoundItem from '@elements/NotFoundItem';

class PickupOpinionModalList extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(AppPropTypes.Content),
    };

    static defaultProps = {
        repositories: null,
    };

    state = {};

    constructor(props) {
        super(props);
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'PickupOpinionModalList'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { repositories } = this.props;

        const rendering = repositories =>
            repositories.map((repository, key) => (
                <div className="pickup-opinion-modal-list__item" key={key}>
                    <HomeRow repository={repository} />
                </div>
            ));

        return (
            <div className="pickup-opinion-modal-list">
                <div className="pickup-opinion-modal-list__title">
                    {tt('g.pickup_opinion')}
                </div>
                <div className="pickup-opinion-modal-list__items">
                    {repositories && repositories.length > 0 ? (
                        rendering(repositories)
                    ) : (
                        <div className="pickup-opinion-modal-list__notfound">
                            <NotFoundItem />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const models = state.content.get('pickup_opinion');
        const repositories = !!models ? models.toJS() : null;
        return {
            repositories,
        };
    },

    dispatch => ({})
)(PickupOpinionModalList);
