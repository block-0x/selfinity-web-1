import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import TextValueInput from '@elements/TextValueInput';
import GradationButton from '@elements/GradationButton';
import { USER_EDIT_TYPE } from '@entity';
import ImageUploadItem from '@elements/ImageUploadItem';
import { FileEntity, FileEntities } from '@entity';
import { fromJS, Map, List } from 'immutable';

class UserEditList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        nickname: '',
        detail: '',
        picture_small: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'UserEditList'
        );
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onNicknameChange = this.onNicknameChange.bind(this);
        this.onPictureChange = this.onPictureChange.bind(this);
        this.onDetailChange = this.onDetailChange.bind(this);
        this.setStateFromProps = this.setStateFromProps.bind(this);
    }

    componentWillMount() {
        const { showLogin, current_user } = this.props;

        if (!current_user) {
            showLogin();
            return;
        }
        this.setStateFromProps(this.props);
    }

    setStateFromProps(props) {
        const { showLogin, current_user } = this.props;

        this.setState({
            nickname: current_user.nickname,
            detail: current_user.detail,
            picture_small: Map(
                FileEntities.build_from_urls([
                    current_user.picture_small,
                ]).toJSON()
            ),
        });
    }

    onNicknameChange(e) {
        this.setState({
            nickname: e,
        });
    }

    onPictureChange(e) {
        this.setState({
            picture_small: e,
        });
    }

    onDetailChange(e) {
        this.setState({
            detail: e,
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { nickname, detail, picture_small } = this.state;

        let { current_user, updateUser } = this.props;

        current_user.nickname = nickname;
        current_user.detail = detail;
        current_user.picture_small = picture_small || '/icons/noimage.svg';

        updateUser(current_user);
    }

    render() {
        const { disabled } = this.props;

        const {
            onNicknameChange,
            onPictureChange,
            onDetailChange,
            handleSubmit,
        } = this;

        const { nickname, detail, picture_small } = this.state;

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case USER_EDIT_TYPE.Nickname.value:
                        return (
                            <div className="user-edit-list__input" key={index}>
                                <TextValueInput
                                    ref={item.value}
                                    type={item.type}
                                    title={item.string()}
                                    onChange={onNicknameChange}
                                    value={nickname}
                                />
                            </div>
                        );
                    case USER_EDIT_TYPE.Detail.value:
                        return (
                            <div className="user-edit-list__input" key={index}>
                                <TextValueInput
                                    ref={item.value}
                                    type={item.type}
                                    title={item.string()}
                                    onChange={onDetailChange}
                                    value={detail}
                                />
                            </div>
                        );
                    case USER_EDIT_TYPE.Picture.value:
                        return (
                            <div
                                className="user-edit-list__input"
                                id="user-edit-list-input-image"
                                key={index}
                            >
                                <div className="text-value-input__title">
                                    {item.string()}
                                </div>
                                <ImageUploadItem
                                    className="user-edit-list__input-image"
                                    ref={item.value}
                                    onChange={onPictureChange}
                                    values={picture_small}
                                />
                            </div>
                        );
                    case USER_EDIT_TYPE.Submit.value:
                        return (
                            <div className="user-edit-list__submit" key={index}>
                                <GradationButton
                                    value={item.string()}
                                    submit={true}
                                    color={'blue'}
                                    disabled={disabled}
                                />
                            </div>
                        );
                    default:
                        return <div key={index} />;
                }
            });

        return (
            <div className="user-edit-list">
                <form onSubmit={handleSubmit}>
                    <div className={'user-edit-list__items'}>
                        {renderItem(USER_EDIT_TYPE)}
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = authActions.getCurrentUser(state);
        return {
            current_user,
        };
    },

    dispatch => ({
        updateUser: user => {
            dispatch(userActions.updateUser({ user }));
        },
        showLogin: () => {
            dispatch(authActions.showLogin());
        },
    })
)(UserEditList);
