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
import StatsBar from '@modules/StatsBar';
import LabelBar from '@modules/LabelBar';

class HomeShowItem extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: models.Content.build(),
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (e) e.preventDefault();
        const { showRead, repository } = this.props;
        showRead(repository);
    }

    render() {
        const { showRead, repository } = this.props;

        const { onClick } = this;

        return (
            <Link className="home-show-item__link" onClick={onClick}>
                <div className="home-show-item">
                    <div className="home-show-item__title">
                        {repository.title}
                    </div>
                    <div className="home-show-item__border" />
                    <div className="home-show-item__body">
                        {repository.body}
                    </div>
                    {repository.Labelings && (
                        <div className="home-show-item__labels">
                            <LabelBar
                                repositories={repository.Labelings.map(
                                    labeling => {
                                        return labeling.Label;
                                    }
                                )}
                            />
                        </div>
                    )}
                    <div className="home-show-item__foot">
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
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        showRead: content => {
            dispatch(contentActions.setShow({ content }));
            dispatch(contentActions.showRead());
        },
        hideRead: () => {
            dispatch(contentActions.hideRead());
        },
    })
)(HomeShowItem);
