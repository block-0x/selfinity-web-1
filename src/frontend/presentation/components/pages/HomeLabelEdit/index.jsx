/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import CloseButton from '@elements/CloseButton';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import HomeLabelEditList from '@cards/HomeLabelEditList';

class HomeLabelEdit extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func,
    };

    static defaultProps = {};

    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'HomeLabelEdit'
        );
    }

    onCancel = e => {
        if (e.preventDefault) e.preventDefault();
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { onCancel } = this.props;

        return (
            <div className="home-label-edit">
                <CloseButton
                    onClick={onCancel}
                    className="home-label-edit__button"
                />
                <HomeLabelEditList />
            </div>
        );
    }
}

export default HomeLabelEdit;
