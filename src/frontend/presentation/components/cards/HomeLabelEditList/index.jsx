import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import SimpleButton from '@elements/SimpleButton';
import GradationButton from '@elements/GradationButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import * as labelActions from '@redux/Label/LabelReducer';
import TabPager from '@modules/TabPager';
import SearchInput from '@elements/SearchInput';
import LabelItem from '@elements/LabelItem';
import models from '@network/client_models';

class HomeLabelEditList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeLabelEditList'
        );
    }

    state = {
        pages: [{ title: 'ストック内' }, { title: 'おすすめ' }],
    };

    handleRequestSearch = e => {
        this.props.searchContent(e);
    };

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const {
            loadMore,
            loading,
            repositories,
            hideCustomizeEdit,
            ...inputProps
        } = this.props;

        const { handleRequestSearch } = this;

        const renderItem = items =>
            items.map((item, index) => (
                <div className="home-label-edit-list__item" key={index}>
                    <LabelItem repository={item} key={index} />
                </div>
            ));

        return (
            <div className="home-label-edit-list">
                <div className="home-label-edit-list__header">
                    <div className="home-label-edit-list__header-left">
                        <SearchInput onRequestSearch={handleRequestSearch} />
                    </div>
                    <div className="home-label-edit-list__header-right">
                        <GradationButton
                            value={'Done'}
                            onClick={hideCustomizeEdit}
                        />
                    </div>
                </div>
                <div className="home-label-edit-list__page">
                    <TabPager repositories={this.state.pages} />
                </div>
                {repositories.length > 0 && renderItem(repositories)}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

HomeLabelEditList.defaultProps = {
    loading: false,
    repositories: [],
};

HomeLabelEditList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            // repositories: ,
        };
    },

    dispatch => ({
        hideCustomizeEdit: payload => {
            dispatch(labelActions.hideCustomizeEdit());
        },
    })
)(HomeLabelEditList);
