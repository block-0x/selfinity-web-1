import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import classNames from 'classnames';
import Img from 'react-image';
import tt from 'counterpart';

class FunctionShowItem extends React.Component {
    static propTypes = {
        backTitle: PropTypes.string,
        title: PropTypes.string,
        text: PropTypes.string,
        src: PropTypes.string,
        reverse: PropTypes.bool,
    };

    static defaultProps = {
        backTitle: '1',
        title: '',
        text: '',
        src: '',
        reverse: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'FunctionShowItem'
        );
    }

    render() {
        const { backTitle, title, text, src, reverse } = this.props;

        return (
            <div
                className={classNames('function-show-item', {
                    reverse,
                })}
            >
                <div className="function-show-item__back">{backTitle}</div>
                <div className="function-show-item__fore">
                    <div className="function-show-item__fore__left">
                        <Img
                            className="function-show-item__fore__left-image"
                            src={src}
                            alt={tt('alts.default')}
                        />
                    </div>
                    <div className="function-show-item__fore__right">
                        <div className="function-show-item__fore__right-title">
                            {title}
                        </div>
                        <div className="function-show-item__fore__right-border" />
                        <div className="function-show-item__fore__right-text">
                            {text}
                        </div>
                    </div>
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
)(FunctionShowItem);
