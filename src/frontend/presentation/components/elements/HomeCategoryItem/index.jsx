import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import OpinionButton from '@elements/OpinionButton';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';
import Responsible from '@modules/Responsible';
import tt from 'counterpart';
import Ripple from '@elements/Ripple';
import {
    contentShowRoute,
    userShowRoute,
} from '@infrastructure/RouteInitialize';
import ope from '@extension/operator';
import PictureItem from '@elements/PictureItem';

class HomeCategoryItem extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeCategoryItem'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { repository } = this.props;

        const user = ope.isContent(repository)
            ? repository.User
            : repository.Voter;

        const isPrivate = Number.prototype.castBool(repository.isPrivate);

        return (
            <div className="home-category-item">
                {!isPrivate &&
                    user && (
                        <Link
                            className="home-category-item__image"
                            to={userShowRoute.getPath({
                                params: { id: user.id },
                            })}
                        >
                            <PictureItem
                                width={32}
                                redius={16}
                                url={user && user.picture_small}
                                alt={user && user.nickname}
                            />
                        </Link>
                    )}
                <div className="home-category-item__left">
                    <Link
                        className="home-category-item__left-link"
                        to={contentShowRoute.getPath({
                            params: { id: repository.id },
                        })}
                    >
                        <div className="home-category-item__left-title">
                            {repository.title}
                        </div>
                        <div className="home-category-item__left-body">
                            {''.cleaning_tag(`${repository.body}`)}
                        </div>
                    </Link>
                </div>
                <div className="home-category-item__right">
                    <div className="home-category-item__right-button">
                        <OpinionButton repository={repository} />
                    </div>
                    <div className="home-category-item__right-more">
                        <Link
                            className="home-category-item__right-more-link"
                            to={contentShowRoute.getPath({
                                params: { id: repository.id },
                            })}
                        >
                            {tt('g.show_more')}
                        </Link>
                    </div>
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
)(HomeCategoryItem);
