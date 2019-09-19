import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import NavigationItem from '@elements/NavigationItem';
import {
    isXScrollEndByClass,
    isXScrollStartByClass,
    createEventScrollX,
    isXScrollEnableByClass,
} from '@extension/scroll';

class NavigationBar extends React.Component {
    static propTypes = {
        children: AppPropTypes.Children,
        isScrollEnable: PropTypes.bool,
    };

    static defaultProps = {
        children: null,
        isScrollEnable: false,
    };

    state = {
        isStart: false,
        isEnd: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigationBar'
        );
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }

    componentDidMount() {
        if (process.env.BROWSER) {
            const element = document.getElementsByClassName(
                'navigation-bar'
            )[0];
            var evX = new createEventScrollX(element);
            element.addEventListener('scroll-x', this.onWindowScroll, false);
            this.onWindowScroll();
        }
    }

    componentWillUnmount() {
        if (process.env.BROWSER) {
            const element = document.getElementsByClassName(
                'navigation-bar'
            )[0];
            element.removeEventListener('scroll-x', this.onWindowScroll, false);
        }
    }

    onWindowScroll = () => {
        const isStart = isXScrollStartByClass('navigation-bar');
        const isEnd = isXScrollEndByClass('navigation-bar');
        this.setState({ isStart, isEnd });
    };

    render() {
        const { children, isScrollEnable } = this.props;
        const { isStart, isEnd } = this.state;

        const renderItem = vals =>
            React.Children.map(vals, (child, key) => {
                const { children: itemChildren, ...otherProps } = child.props;

                return (
                    <div className="navigation-bar__item" key={key}>
                        <NavigationItem
                            key={key}
                            url={child.url}
                            value={child.value}
                            active={child.active}
                            {...otherProps}
                        />
                    </div>
                );
            });

        return (
            <div className="navigation-bar">
                {children && renderItem(children)}
            </div>
        );
    }
}

// {!isStart && isScrollEnable && (
//                     <div></div>
//                 )}
// {!isEnd && isScrollEnable && (
//                     <div></div>
//                 )}
export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigationBar);
