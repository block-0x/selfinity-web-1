import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import * as appActions from '@redux/App/AppReducer';
import ope from '@extension/operator';
import HomeRow from '@elements/HomeRow';
import RequestRow from '@elements/RequestRow';
import HomeItem from '@elements/HomeItem';
import RequestItem from '@elements/RequestItem';
import AppPropTypes from '@extension/AppPropTypes';
import IntroductionNewButton from '@elements/IntroductionNewButton';

class IntroductionViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(
            PropTypes.oneOfType([AppPropTypes.Content, AppPropTypes.Request])
        ),
        repository: AppPropTypes.User,
    };

    static defaultProps = {
        repositories: [],
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'IntroductionViewer'
        );
    }

    render() {
        const { repositories, current_user, isMyAccount } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="introduction-viewer__item" key={key}>
                    <HomeItem
                        repository={item}
                        isHiddenUser={true}
                        isHiddenLabel={true}
                        align={true}
                    />
                </div>
            ));

        return (
            <div className="introduction-viewer">
                <div className="introduction-viewer__container">
                    <div className="introduction-viewer__items">
                        {isMyAccount && (
                            <div className="introduction-viewer__button">
                                <IntroductionNewButton />
                            </div>
                        )}
                        {repositories.length > 0 && renderItem(repositories)}
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
            isMyAccount: userActions.isMyAccount(state, props.repository),
            repositories: userActions.getUserWanted(state)
                ? userActions.getUserWanted(state).contents
                : [],
        };
    },

    dispatch => ({})
)(IntroductionViewer);
