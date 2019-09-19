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
import RequestInsertButton from '@elements/RequestInsertButton';
import Responsible from '@modules/Responsible';

class RequestViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(
            PropTypes.oneOfType([AppPropTypes.Content, AppPropTypes.Request])
        ),
        repository: AppPropTypes.Content,
    };

    static defaultProps = {
        repositories: [],
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'RequestViewer'
        );
    }

    render() {
        const {
            repositories,
            repository,
            current_user,
            isMyAccount,
        } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="request-viewer__item" key={key}>
                    <RequestItem repository={item} allowAnswer={false} />
                </div>
            ));

        return (
            <div className="request-viewer">
                <Responsible
                    className="request-viewer__inline"
                    defaultContent={
                        <div className="request-viewer__button">
                            <RequestInsertButton repository={repository} />
                        </div>
                    }
                    breakMd={true}
                />
                {repositories.length > 0 && renderItem(repositories)}
                <Responsible
                    className="request-viewer__button"
                    breakingContent={
                        <RequestInsertButton repository={repository} />
                    }
                    breakMd={true}
                />
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
)(RequestViewer);
