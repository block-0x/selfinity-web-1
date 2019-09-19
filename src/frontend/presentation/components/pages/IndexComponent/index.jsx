/* eslint react/prop-types: 0 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import { Enum, defineEnum } from '@extension/Enum';
import { menuSection } from '@entity';

class IndexComponentImpl extends React.Component {
    static propTypes = {
        section: PropTypes.object,
        isHeaderVisible: PropTypes.bool,
        children: PropTypes.node,
    };

    static defaultProps = {
        isHeaderVisible: true,
        section: menuSection,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'IndexComponent'
        );
    }

    render() {
        const {
            isHeaderVisible,
            children,
            section,
            show_side_bar,
        } = this.props;

        return (
            <div
                className={classNames('index-component', {
                    isShowBar: show_side_bar,
                    isHiddenBar: !show_side_bar,
                })}
            >
                <div className="index-component__side">
                    <SideBar section={section} />
                </div>
                <div className="index-component__children fade-in--1">
                    {children}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const show_side_bar = state.app.get('show_side_bar');
        return {
            show_side_bar,
        };
    },
    dispatch => {
        return {};
    }
)(IndexComponentImpl);
