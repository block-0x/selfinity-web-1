import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import models from '@network/client_models';
import LabelInput from '@elements/LabelInput';
import LabelTagWithClose from '@elements/LabelTagWithClose';
import Gallery from '@modules/Gallery';

class LabelForm extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(AppPropTypes.Label),
    };

    static defaultProps = {
        repositories: [],
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'LabelForm');
    }

    render() {
        const { repositories } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="label-form__item" key={key}>
                    <LabelTagWithClose key={key} repository={item} />
                </div>
            ));
        return (
            <div className="label-form">
                <Gallery>
                    {repositories.length > 0 && renderItem(repositories)}
                    <div className="label-form__input">
                        <LabelInput />
                    </div>
                </Gallery>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(LabelForm);
