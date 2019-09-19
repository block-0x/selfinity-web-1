import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SectionHeader from '@elements/SectionHeader';
import {
    isXScrollEndByClass,
    isXScrollStartByClass,
    createEventScrollX,
    isXScrollEnableByClass,
} from '@extension/scroll';

class NavigationContainer extends React.Component {
    state = {
        isScrollEnable: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigationContainer'
        );
        this.onWindowScroll = this.onWindowScroll.bind(this);
    }

    componentDidMount() {
        if (process.env.BROWSER) {
            window.addEventListener('resize', this.onWindowScroll, false);
            this.onWindowScroll();
        }
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.onWindowScroll, false);
    }

    onWindowScroll = () => {
        const isScrollEnable = isXScrollEnableByClass('navigation-container');
        this.setState({ isScrollEnable });
    };

    render() {
        const {
            // children,
            lefts,
            rights,
            isCenter,
            style,
            inlineStyle,
        } = this.props;

        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                isScrollEnable: this.state.isScrollEnable,
            });
        });

        const renderCentering = children => (
            <div className="navigation-container">
                <div
                    className="navigation-container__center"
                    style={inlineStyle}
                >
                    {children}
                </div>
            </div>
        );

        const renderSeparating = (lefts, rights) => (
            <div className="navigation-container">
                <div className="navigation-container__center">
                    <div className="navigation-container__left">{lefts}</div>
                    <div className="navigation-container__right">{rights}</div>
                </div>
            </div>
        );

        return isCenter && !!children ? (
            <SectionHeader style={style}>
                {renderCentering(children)}
            </SectionHeader>
        ) : (
            <SectionHeader style={style}>
                {renderSeparating(lefts, rights)}
            </SectionHeader>
        );
    }
}

NavigationContainer.propTypes = {
    lefts: PropTypes.node,
    rights: PropTypes.node,
    children: PropTypes.node,
    style: PropTypes.object,
};

NavigationContainer.defaultProps = {
    lefts: null,
    rights: null,
    children: null,
    isCenter: true,
    style: {},
};

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigationContainer);
