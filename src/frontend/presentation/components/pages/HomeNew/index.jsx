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
import HomeNewList from '@cards/HomeNewList';
import { OPERATION_TYPE, SUBMIT_TYPE, CONTENT_TYPE } from '@entity';
import { homeNewRoute } from '@infrastructure/RouteInitialize';
import Responsible from '@modules/Responsible';
import IconButton from '@elements/IconButton';

class HomeNew extends React.Component {
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

    static pushURLState(title) {
        if (window) window.history.pushState({}, title, homeNewRoute.path);
    }

    static state = {
        beforePathname: '/',
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'HomeNew');
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        this.setState({
            beforePathname:
                browserHistory.getCurrentLocation().pathname !=
                    homeNewRoute.path &&
                browserHistory.getCurrentLocation().pathname,
        });
    }

    componentDidMount() {
        HomeNew.pushURLState(tt('g.new_posts'));
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
        browserHistory.push(this.state.beforePathname);
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
                <HomeNewList ParentId={this.props.ParentId} />
            </div>
        );
    }
}

export default HomeNew;
