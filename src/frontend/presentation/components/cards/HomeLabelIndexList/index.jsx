import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Link } from 'react-router';
import { Enum, defineEnum } from '@extension/Enum';
import SimpleButton from '@elements/SimpleButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import HomeLabelItem from '@elements/HomeLabelItem';
import SectionButtonHeader from '@modules/SectionButtonHeader';
import { HomeModel, HomeModels } from '@entity';
import * as contentActions from '@redux/Content/ContentReducer';
import * as labelActions from '@redux/Label/LabelReducer';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity/RenderEntity';
import Img from 'react-image';

class HomeLabelIndexList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeLabelIndexList'
        );
        this.onAppendClick = e => {
            const { showCustomizeEdit } = this.props;
            if (showCustomizeEdit) showCustomizeEdit();
        };
        this.onAppendClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const { loadMore, loading, repositories, ...inputProps } = this.props;

        const { onAppendClick } = this;

        const renderingCell = items =>
            items.map((item, index) => (
                <div className="home-label-index-list__item" key={index}>
                    <HomeLabelItem key={index} repository={item} />
                </div>
            ));

        return (
            <div className="home-label-index-list" id="home_list">
                <div className="home-label-index-list__header">
                    <Img
                        className="home-label-index-list__header__image"
                        src="/images/wave-header.png"
                        alt={tt('alts.default')}
                    />
                </div>
                <div className="home-label-index-list__head">
                    <SectionButtonHeader
                        title={'カスタマイズ'}
                        buttonTitle={'＋ 追加する'}
                        onClick={onAppendClick}
                    />
                </div>
                {repositories.length > 0 && renderingCell(repositories)}
                {loading && (
                    <center>
                        <LoadingIndicator style={{ marginBottom: '2rem' }} />
                    </center>
                )}
            </div>
        );
    }
}

HomeLabelIndexList.defaultProps = {
    loading: false,
    repositories: [],
};

HomeLabelIndexList.propTypes = {
    repositories: PropTypes.array,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
};

export default connect(
    (state, props) => {
        return {
            repositories: labelActions.getHomeLabel(state),
        };
    },

    dispatch => ({
        showCustomizeEdit: e => {
            if (e) e.preventDefault();
            dispatch(labelActions.showCustomizeEdit());
        },
    })
)(HomeLabelIndexList);
