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

class LabelInput extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Label,
        build: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
    };

    static defaultProps = {
        repository: models.Label.build({
            title: '',
        }),
    };

    state = {
        title: '',
        labels: [],
        showing: false,
        changed: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'LabelInput');
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClickDropDown = this.onClickDropDown.bind(this);
        this.onShowDropDown = this.onShowDropDown.bind(this);
    }

    componentWillMount() {
        this.setState({
            title: this.props.repository.title,
        });
    }

    onTitleChange(e) {
        if (e) {
            this.setState({
                title: e.target.value,
            });
            const { title } = this.state;
            const { current_user } = this.props;
            searchRepository
                .searchLabel({
                    limit: data_config.drop_down_search_limit,
                    keyword: e.target.value,
                    user: current_user,
                })
                .then(entity => {
                    this.setState({
                        labels: List(entity[0].items[0].contents),
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

        const { title, showing, labels, changed } = this.state;

        const lists = labels instanceof List ? labels.toJS() : [];

        const isList = lists.filter(val => val.title == title).length > 0;

        if (showing && !isList) {
            const element = document.getElementById(
                'label-drop_down_container'
            );
            element.focus();
            this.setState({ showing: false });
            return;
        }

        if (repository.title != '') {
            remove(repository);
        }

        if (build && repository && title) {
            repository.title = title;
            build(repository);
            this.setState({
                title: '',
            });
        }
    }

    onClickDropDown(e) {
        if (e.target.innerText) this.setState({ title: e.target.innerText });
    }

    onShowDropDown(e) {
        this.setState({ showing: true });
    }

    render() {
        let { title, labels } = this.state;

        const {
            onTitleChange,
            onKeyPress,
            handleSubmit,
            onClickDropDown,
            onShowDropDown,
        } = this;

        labels = labels instanceof List ? labels.toJS() : [];
        labels = labels.slice(0, data_config.drop_down_search_limit);

        const renderDropDown = labels.map((label, index) => (
            <DropDownItem key={index} onClick={onClickDropDown}>
                <Ripple>
                    <div
                        className="label-input__drop-down-item"
                        style={{ marginTop: index == 0 ? '8px' : '0px' }}
                    >
                        <div className="label-input__drop-down-item-value">
                            {label.title}
                        </div>
                    </div>
                </Ripple>
            </DropDownItem>
        ));

        return (
            <div className="label-input">
                <DropDownContainer
                    onShow={onShowDropDown}
                    content={
                        <input
                            className="label-input__field"
                            id={'label-drop_down_container'}
                            ref="labelTitle"
                            type="text"
                            value={title}
                            onChange={onTitleChange}
                            onBlur={handleSubmit}
                            onKeyPress={onKeyPress}
                            placeholder={
                                tt('g.enter', {
                                    data: tt('g.tag'),
                                }) + `(${tt('g.optional')})`
                            }
                        />
                    }
                    style={{ float: 'left' }}
                >
                    <DropDownMenu query={''}>{renderDropDown}</DropDownMenu>
                </DropDownContainer>
                {title &&
                    title != '' && (
                        <Link
                            className="label-input__button fade-in--1"
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
        build: label => {
            dispatch(contentActions.buildContentLabel({ label }));
        },
        remove: label => {
            dispatch(contentActions.removeContentLabel({ label }));
        },
    })
)(LabelInput);
