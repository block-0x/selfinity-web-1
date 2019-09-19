/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import CloseButton from '@elements/CloseButton';
import constants from '@redux/constants';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideBar from '@modules/SideBar';
import PickupModalList from '@cards/PickupModalList';
import { OPERATION_TYPE, SUBMIT_TYPE, CONTENT_TYPE } from '@entity';
import {
    pickupModalRoute,
    contentShowRoute,
} from '@infrastructure/RouteInitialize';
import Responsible from '@modules/Responsible';
import IconButton from '@elements/IconButton';
import querystring from 'querystring';

class PickupModal extends React.Component {
    static propTypes = {
        type: PropTypes.object,
        mode: PropTypes.object,
        onCancel: PropTypes.func,
        content: PropTypes.object,
        ParentId: PropTypes.number,
    };

    static defaultProps = {
        ParentId: null,
    };

    static pushURLState(title, params = null) {
        if (window)
            window.history.pushState(
                {},
                title,
                params
                    ? `${pickupModalRoute.path}?${querystring.stringify(
                          params
                      )}`
                    : pickupModalRoute.path
            );
    }

    static state = {
        beforePathname: '/',
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'PickupModal');
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.setState({
            beforePathname:
                browserHistory.getCurrentLocation().pathname !=
                    pickupModalRoute.path &&
                browserHistory.getCurrentLocation().pathname,
        });
    }

    componentDidMount() {
        PickupModal.pushURLState(
            tt('g.new_posts'),
            browserHistory.getCurrentLocation().query
        );
        if (process.env.BROWSER)
            window.addEventListener(
                'touchmove',
                e => {
                    e.preventDefault();
                },
                true
            );
    }

    componentWillUnmount() {
        if (
            !contentShowRoute.isValidPath(
                browserHistory.getCurrentLocation().pathname
            )
        ) {
            browserHistory.push(this.state.beforePathname);
        }
        if (process.env.BROWSER)
            window.removeEventListener(
                'touchmove',
                e => {
                    e.preventDefault();
                },
                true
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
            <div className="home-new">
                <Responsible
                    defaultContent={
                        <CloseButton
                            onClick={onCancel}
                            className="home-new__button"
                        />
                    }
                    breakingContent={
                        <IconButton
                            onClick={onCancel}
                            src="close"
                            size={'2x'}
                        />
                    }
                    breakMd={true}
                    className="home-new__button"
                />
                <PickupModalList />
            </div>
        );
    }
}

export default PickupModal;
