import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class DropDownContainer extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        content: PropTypes.node,
        height: PropTypes.string,
        id: PropTypes.string,
        enableBlur: PropTypes.bool,
        onShow: PropTypes.func,
        style: PropTypes.object,
    };

    static defaultProps = {
        height: '300px',
        enableBlur: true,
    };

    state = {
        displayMenu: false,
        top: `0px`,
        left: `0px`,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'DropDownContainer'
        );
        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
        this.handleRect = this.handleRect.bind(this);
        this.hideClickDropdownMenu = this.hideClickDropdownMenu.bind(this);
    }

    componentWillMount() {
        const { enableBlur } = this.props;
        if (enableBlur)
            window.addEventListener('mousedown', this.hideDropdownMenu);
    }

    componentWillUnmount() {
        const { enableBlur } = this.props;
        if (enableBlur)
            window.removeEventListener('mousedown', this.hideDropdownMenu);
    }

    handleRect(event) {
        if (!!event) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = rect.x,
                y = rect.y,
                width = rect.width,
                height = rect.height;

            this.setState({
                top: `${height}px`,
                left: `0px`,
            });
        }
    }

    showDropdownMenu(event) {
        const { displayMenu } = this.state;
        event.preventDefault();
        this.handleRect(event);
        this.setState({ displayMenu: true });
        if (!!this.props.onShow) this.props.onShow(event);
    }

    hideDropdownMenu(event) {
        const element = document.getElementById('drop_down_container');
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const isInclude =
            event.x >= rect.left &&
            event.x <= rect.left + rect.width &&
            event.y >= rect.top &&
            event.y <= rect.top + rect.height;
        if (this.state.displayMenu && !isInclude) {
            this.setState({ displayMenu: false });
        }
    }

    hideClickDropdownMenu(event) {
        if (this.state.displayMenu) {
            this.setState({ displayMenu: false });
        }
    }

    onClickButton(e) {
        const { enableBlur } = this.props;

        if (e) e.preventDefault();
        this.handleRect(e);

        if (!enableBlur) {
            const { displayMenu } = this.state;
            this.setState({
                displayMenu: !displayMenu,
            });
        }
    }

    render() {
        const { children, content, enableBlur, height, id, style } = this.props;

        const { displayMenu, top, left } = this.state;

        const {
            showDropdownMenu,
            hideDropdownMenu,
            hideClickDropdownMenu,
        } = this;

        return (
            <div className="drop-down-container" style={style}>
                {displayMenu && (
                    <div
                        className="drop-down-container__items"
                        id={
                            !!id
                                ? `drop_down_container ${id}`
                                : 'drop_down_container'
                        }
                        onClick={hideClickDropdownMenu}
                        style={{
                            top,
                            left,
                            maxHeight: height,
                        }}
                    >
                        {children}
                    </div>
                )}
                <div
                    className="drop-down-container__button"
                    onClick={showDropdownMenu}
                >
                    {content}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(DropDownContainer);
