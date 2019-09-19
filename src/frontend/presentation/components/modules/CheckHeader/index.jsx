import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';

class CheckHeader extends React.Component {
    static propTypes = {
        head: PropTypes.string,
        src: PropTypes.string,
        title: PropTypes.string,
        text: PropTypes.string,
        foot: PropTypes.string,
    };

    static defaultProps = {
        head: '',
        src: 'debate',
        title: '',
        text: '',
        foot: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'CheckHeader');
    }

    render() {
        const { head, src, title, text, foot } = this.props;

        return (
            <div className="check-header">
                <div className="check-header__head">
                    <div className="check-header__head-left">
                        <Icon
                            className="check-header__head-left__icon"
                            size={'3x'}
                            src={src}
                        />
                    </div>
                    <h1 className="check-header__head-title">{title}</h1>
                    <div className="check-header__head-right">
                        <Icon
                            className="check-header__head-right__icon"
                            size={'3x'}
                            src={src}
                        />
                    </div>
                </div>
                <h2 className="check-header__text">{text}</h2>
                <div className="check-header__border" />
                <h3 className="check-header__foot">{'＼' + foot + '／'}</h3>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(CheckHeader);
