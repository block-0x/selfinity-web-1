import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import AppPropTypes from '@extension/AppPropTypes';
import tt from 'counterpart';
import DropDownContainer from '@cards/DropDownContainer';
import DropDownMenu from '@modules/DropDownMenu';
import DropDownItem from '@elements/DropDownItem';
import data_config from '@constants/data_config';
import reward_config from '@constants/reward_config';
import SearchRepository from '@repository/SearchRepository';
import { Set, Map, fromJS, List } from 'immutable';
import Ripple from '@elements/Ripple';
import Point from '@elements/Point';

const searchRepository = new SearchRepository();

class UserInput extends React.Component {
    static propTypes = {
        repository: AppPropTypes.User,
        build: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
    };

    static defaultProps = {
        repository: models.User.build({
            nickname: '',
        }),
    };

    state = {
        nickname: '',
        users: [],
        showing: false,
        changed: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserInput');
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClickDropDown = this.onClickDropDown.bind(this);
        this.onShowDropDown = this.onShowDropDown.bind(this);
    }

    componentWillMount() {
        this.setState({
            nickname: this.props.repository.nickname,
        });
    }

    onTitleChange(e) {
        if (e) {
            this.setState({
                nickname: e.target.value,
            });
            const { nickname } = this.state;
            const { current_user } = this.props;
            searchRepository
                .searchUser({
                    limit: data_config.drop_down_search_limit,
                    keyword: e.target.value,
                    user: current_user,
                })
                .then(entity => {
                    this.setState({
                        users: List(entity[0].items[0].contents),
                    });
                });
        }
    }

    onKeyPress(e) {
        if (!e) return;
        if (e.key === 'Enter' || e.keyCode == 32) {
            this.handleSubmit(e);
        }
    }

    handleSubmit(e) {
        const { build, remove } = this.props;

        let { repository } = this.props;

        const { nickname, showing, users, changed } = this.state;

        const lists = users instanceof List ? users.toJS() : [];

        const isList = lists.filter(val => val.nickname == nickname).length > 0;

        if (showing && !isList) {
            const element = document.getElementById('user-drop_down_container');
            element.focus();
            this.setState({ showing: false });
            return;
        }

        if (repository.nickname != '') {
            remove(repository);
        }

        if (build && repository && nickname) {
            repository.nickname = nickname;
            build(repository);
            this.setState({
                nickname: '',
            });
        }
    }

    onClickDropDown(e) {
        if (e.target.innerText) this.setState({ nickname: e.target.innerText });
    }

    onShowDropDown(e) {
        this.setState({ showing: true });
    }

    render() {
        let { nickname, users } = this.state;

        const {
            onTitleChange,
            onKeyPress,
            handleSubmit,
            onClickDropDown,
            onShowDropDown,
        } = this;

        users = users instanceof List ? users.toJS() : [];
        users = users.slice(0, data_config.drop_down_search_limit);

        const renderDropDown = users.map((user, index) => (
            <DropDownItem key={index} onClick={onClickDropDown}>
                <Ripple>
                    <div
                        className="user-input__drop-down-item"
                        style={{ marginTop: index == 0 ? '8px' : '0px' }}
                    >
                        <div className="user-input__drop-down-item-value">
                            {user.nickname}
                        </div>
                    </div>
                </Ripple>
            </DropDownItem>
        ));

        return (
            <div className="user-input">
                <DropDownContainer
                    onShow={onShowDropDown}
                    content={
                        <input
                            className="user-input__field"
                            id={'user-drop_down_container'}
                            ref="userTitle"
                            type="text"
                            value={nickname}
                            onChange={onTitleChange}
                            onBlur={handleSubmit}
                            onKeyPress={onKeyPress}
                            placeholder={
                                tt('g.enter', {
                                    data: tt('g.user'),
                                }) + `(${tt('g.optional')})`
                            }
                        />
                    }
                    style={{ float: 'left' }}
                >
                    <DropDownMenu query={''}>{renderDropDown}</DropDownMenu>
                </DropDownContainer>
                {nickname &&
                    nickname != '' && (
                        <Link
                            className="user-input__button fade-in--1"
                            onClick={handleSubmit}
                        >
                            {tt('g.complete')}
                        </Link>
                    )}
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
        build: user => {
            dispatch(contentActions.buildContentAssign({ user }));
        },
        remove: user => {
            dispatch(contentActions.removeContentAssign({ user }));
        },
    })
)(UserInput);
