import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import SimpleButton from '@elements/SimpleButton';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class SectionButtonHeader extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        buttonTitle: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        buttonTitle: '',
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.onClick = e => {
            const { onClick } = this.props;
            if (onClick) onClick(e);
        };
        this.onClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { title, buttonTitle, onClick } = this.props;
        const n = nextProps;
        return (
            title !== n.title ||
            buttonTitle !== n.buttonTitle ||
            onClick !== n.onClick
        );
    }

    render() {
        const { title, buttonTitle } = this.props;

        const { onClick } = this;

        return (
            <div className="section-button-header">
                <div className="section-button-header__title">{title}</div>
                <div className="section-button-header__button">
                    <SimpleButton value={buttonTitle} onClick={onClick} />
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
)(SectionButtonHeader);
