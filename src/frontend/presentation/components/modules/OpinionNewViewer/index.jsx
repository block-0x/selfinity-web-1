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
import EmptyNewItem from '@elements/EmptyNewItem';
import ReplyAxis from '@elements/ReplyAxis';
import AppPropTypes from '@extension/AppPropTypes';
import OpinionInsertButton from '@elements/OpinionInsertButton';
import Responsible from '@modules/Responsible';

class OpinionNewViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(
            PropTypes.oneOfType([AppPropTypes.Content, AppPropTypes.Request])
        ),
        readOnly: PropTypes.bool,
    };

    static defaultProps = {
        repositories: [],
        readOnly: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OpinionNewViewer'
        );
    }

    render() {
        const {
            repositories,
            current_user,
            isMyAccount,
            readOnly,
        } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="opinion-new-viewer__item" key={key}>
                    <div className="opinion-new-viewer__item-top">
                        <HomeItem
                            isHiddenOpinion={true}
                            repository={item}
                            align={true}
                        />
                    </div>
                    <div className="opinion-new-viewer__item-border">
                        <ReplyAxis />
                    </div>
                    <div className="opinion-new-viewer__item-input">
                        <EmptyNewItem repository={item} />
                    </div>
                </div>
            ));

        return (
            <div className="opinion-new-viewer">
                <div className="opinion-new-viewer__container">
                    <div className="opinion-new-viewer__items">
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
        };
    },

    dispatch => ({})
)(OpinionNewViewer);
