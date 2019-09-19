import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import SideItem from '@elements/SideItem';
import { Enum, defineEnum } from '@extension/Enum';
import LoadingIndicator from '@elements/LoadingIndicator';
import Calendar from '@modules/Calendar';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SideTripItem from '@elements/SideTripItem';
import SideTripSection from '@elements/SideTripSection';
import { Link, browserHistory } from 'react-router';
import {
    contentShowRoute,
    labelShowRoute,
    feedsRoute,
    homeIndexRoute,
    homeNewRoute,
    recommendRoute,
    usersRecommendRoute,
} from '@infrastructure/RouteInitialize';
import { aboutMenu } from '@entity/SideBarEntity';
import Gallery from '@modules/Gallery';
import Responsible from '@modules/Responsible';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'SideBar');
    }

    render() {
        var {
            className,
            classes,
            disabled,
            style,
            section,
            home_side_bar_menu,
            pathname,
            label_detail_side_bar_menu,
            recommend_side_bar_menu,
            feed_side_bar_menu,
            users_recommend_side_bar_menu,
            current_user,
            showLogin,
            hideSideBarModal,
            ...inputProps
        } = this.props;

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'Border':
                        return <div className="side-bar__border" key={index} />;
                    case 'MyPage':
                        if (!!current_user) {
                            return (
                                <li key={index} className="side-bar__item">
                                    <SideItem
                                        value={item.string()}
                                        image={item.image}
                                        link={item.link(current_user.id)}
                                        active={item.active(
                                            current_user.id,
                                            pathname
                                        )}
                                    />
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="side-bar__item">
                                    <SideItem
                                        value={item.string()}
                                        image={item.image}
                                        onClick={showLogin}
                                    />
                                </li>
                            );
                        }
                    default:
                        return (
                            <li key={index} className="side-bar__item">
                                <SideItem
                                    value={item.string()}
                                    image={item.image}
                                    link={item.link}
                                    active={item.active(pathname)}
                                />
                            </li>
                        );
                }
            });

        const renderSideTripItem = items =>
            items.map((item, index) => (
                <li key={index} className="side-bar__trip">
                    <SideTripItem
                        value={item.menu}
                        onClick={item.onClick}
                        link={item.url}
                        image={item.image}
                    />
                </li>
            ));

        const renderSideTrip = items =>
            items.map((item, index) => (
                <div key={index}>
                    {item.title && (
                        <li key={index} className="side-bar__trip">
                            <SideTripSection
                                value={item.title}
                                onClick={e => {
                                    item.toggle();
                                    this.forceUpdate();
                                }}
                                isFold={!item.show}
                            />
                        </li>
                    )}
                    {renderSideTripItem(item.items)}
                </div>
            ));

        const renderAboutMenu = items =>
            items._enums.map((item, index) => (
                <Responsible
                    key={index}
                    defaultContent={
                        <Link
                            key={index}
                            className="side-bar__grid-item"
                            to={item.link}
                            target="_blank"
                        >
                            {item.string()}
                        </Link>
                    }
                    breakingContent={
                        <Link
                            key={index}
                            className="side-bar__grid-item"
                            to={item.link}
                            onClick={e => {
                                if (e) e.stopPropagation();
                                hideSideBarModal(e);
                                browserHistory.push(item.link);
                            }}
                        >
                            {item.string()}
                        </Link>
                    }
                    breakXl={true}
                />
            ));

        const renderMenu = () => {
            if (!pathname) return <div />;
            switch (true) {
                case homeNewRoute.isValidPath(pathname):
                case homeIndexRoute.isValidPath(pathname):
                    return renderSideTrip(home_side_bar_menu);
                case usersRecommendRoute.isValidPath(pathname):
                    return renderSideTrip(users_recommend_side_bar_menu);
                case labelShowRoute.isValidPath(pathname):
                    return renderSideTrip(label_detail_side_bar_menu);
                case recommendRoute.isValidPath(pathname):
                    return renderSideTrip(recommend_side_bar_menu);
                case feedsRoute.isValidPath(pathname):
                    return renderSideTrip(feed_side_bar_menu);
                default:
                    return <div />;
            }
        };

        return (
            <div className="side-bar">
                <ul className="side-bar__items">
                    {section && renderItem(section)}
                </ul>
                <div className="side-bar__grid">
                    <Gallery>{renderAboutMenu(aboutMenu)}</Gallery>
                </div>
                <ul
                    className="side-bar__items"
                    style={{ marginBottom: '64px' }}
                >
                    {renderMenu()}
                </ul>
            </div>
        );
    }
}

SideBar.defaultProps = {
    className: '',
    disabled: false,
    style: null,
    pathname: '/',
};

SideBar.propTypes = {
    classes: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    section: PropTypes.object,
    pathname: PropTypes.string,
};

export default connect(
    (state, ownProps) => {
        return {
            current_user: authActions.getCurrentUser(state),
            home_side_bar_menu: appActions.getHomeSideBarMenu(state),
            feed_side_bar_menu: appActions.getFeedSideBarMenu(state),
            recommend_side_bar_menu: appActions.getRecommendSideBarMenu(state),
            users_recommend_side_bar_menu: appActions.getUsersRecommendSideBarMenu(
                state
            ),
            label_detail_side_bar_menu: appActions.getLabelDetailSideBarMenu(
                state
            ),
            pathname: browserHistory
                ? browserHistory.getCurrentLocation().pathname
                : null,
        };
    },
    dispatch => {
        return {
            showLogin: () => {
                dispatch(authActions.showLogin());
            },
            hideSideBarModal: e => {
                if (e) e.preventDefault();
                dispatch(appActions.hideSideBarModal());
            },
        };
    }
)(SideBar);
