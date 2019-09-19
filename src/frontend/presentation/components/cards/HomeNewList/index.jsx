import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import NewForm from '@modules/NewForm';
import HomeShowItem from '@elements/HomeShowItem';
import ReplyAxis from '@elements/ReplyAxis';
import debounce from 'lodash.debounce';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { OPERATION_TYPE, SUBMIT_TYPE, CONTENT_TYPE } from '@entity';
import models from '@network/client_models';
import * as authActions from '@redux/Auth/AuthReducer';

const formId = 'submitStory';
const SubmitReplyEditor = NewForm(formId);

class HomeNewList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeNewList');
    }

    render() {
        const {
            classes,
            className,
            style,
            title,
            loading,
            mode,
            ParentId,
            current_user,
            showLogin,
            showPhoneConfirm,
            ...inputProps
        } = this.props;

        let { content } = this.props;

        if (!!current_user) {
            content.UserId = current_user.id;
            content.ParentId = ParentId;
        } else if (!current_user.verified) {
            showPhoneConfirm();
            return <div />;
        } else {
            showLogin();
            return <div />;
        }

        return (
            <div className="home-new-list" id="home_new_list">
                {/*{ renderItem(this.Section) }*/}
                <div className="home-new-list__new-item">
                    <SubmitReplyEditor content={content} />
                </div>
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

HomeNewList.defaultProps = {
    className: '',
    loading: false,
    style: null,
    title: '',
    content: models.Content.build({
        body: '',
        mode: CONTENT_TYPE.Content.value,
        include: [models.Label],
    }),
    ParentId: null,
    mode: CONTENT_TYPE.Content,
};

HomeNewList.propTypes = {
    classes: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.string,
    title: PropTypes.string,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
    onChange: PropTypes.func,
    content: PropTypes.object,
    ParentId: PropTypes.number,
    mode: PropTypes.object,
};

export default connect(
    (state, ownProps) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },
    dispatch => ({
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
        showPhoneConfirm: () => {
            dispatch(authActions.showPhoneConfirm());
        },
    })
)(HomeNewList);
