import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import classNames from 'classnames';

class SimpleIconButton extends React.Component {
    static defaultProps = {
        className: '',
        disabled: false,
        style: null,
        shadowBool: true,
        color: '',
        url: null,
        submit: false,
        active: false,
    };

    static propTypes = {
        /** Override or extend the styles applied to the component. */
        classes: PropTypes.string,
        /** Custom top-level class */
        className: PropTypes.string,
        /** Disables text field. */
        disabled: PropTypes.bool,
        /** Fired when the button is tapped. */
        onClick: PropTypes.func,
        /** Override the inline-styles of the root element. */
        style: PropTypes.object,
        /** Disables shadow. */
        shadowBool: PropTypes.bool,
        /** The value of the text field. */
        /** The color of the button. */
        color: PropTypes.string,
        /** The url of the button. */
        url: PropTypes.string,
        /** The submit of the button. */
        submit: PropTypes.bool,
        /** The mode of the button layout. */
        active: PropTypes.bool,
        /** The src for icon. */
        src: PropTypes.string,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'SimpleIconButton'
        );
        this.state = {
            active: this.props.active,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        this.setState({
            active: nextProps.active,
        });
    }

    handleClick = e => {
        const { onClick, url, submit } = this.props;
        if (e && !submit) e.stopPropagation();
        if (url) browserHistory.push(url);
        if (onClick) {
            onClick(this.state.value);
        }
    };

    componentWillReceiveProps(nextProps) {
        if (this.state.active != nextProps.active)
            this.setState({ active: nextProps.active });
    }

    render() {
        const { active } = this.state;
        const {
            className,
            classes,
            disabled,
            onClick,
            style,
            shadowBool,
            color,
            url,
            submit,
            src,
            ...inputProps
        } = this.props;

        let button_class_name =
            color == ''
                ? 'simple-icon-button'
                : 'simple-icon-' + color + '-button';

        const simpleButton = submit ? (
            <button
                type="submit"
                className={classNames('simple-icon-button__link', {
                    active,
                })}
                id="simple_icon_button_submit"
                onClick={e => this.handleClick(e)}
            >
                <div
                    className={classNames(button_class_name, className, {
                        active,
                    })}
                >
                    <div className="simple-icon-button__items">
                        {src && (
                            <Icon
                                className="simple-icon-button__items-image"
                                src={src}
                                size={'2x'}
                            />
                        )}
                    </div>
                </div>
            </button>
        ) : (
            <div
                className={classNames('simple-icon-button__link', {
                    active: active,
                })}
                onClick={e => this.handleClick(e)}
            >
                <div
                    className={classNames(button_class_name, className, {
                        active: active,
                    })}
                >
                    <div className="simple-icon-button__items">
                        {src && (
                            <Icon
                                className="simple-icon-button__items-image"
                                src={src}
                                size={'2x'}
                            />
                        )}
                    </div>
                </div>
            </div>
        );

        return <Ripple>{simpleButton}</Ripple>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(SimpleIconButton);
