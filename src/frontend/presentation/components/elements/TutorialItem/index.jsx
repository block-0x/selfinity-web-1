import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class TutorialItem extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        text: PropTypes.string,
        hrefText: PropTypes.string,
        link: PropTypes.string,
        onLinkClick: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        text: '',
        hrefText: '',
        link: null,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TutorialItem'
        );
    }

    onLinkClick(e) {
        const { onLinkClick, link } = this.props;
        if (e) e.stopPropagation();
        if (link) browserHistory.push(link);
        if (onLinkClick) onLinkClick(e);
    }

    render() {
        const { title, text, hrefText, link } = this.props;

        const { onLinkClick } = this;

        return (
            <div className="tutorial-item__link">
                <div className="tutorial-item">
                    <div className="tutorial-item__title">{title}</div>
                    <div className="tutorial-item__text">{text}</div>
                    <div className="tutorial-item__href" onClick={onLinkClick}>
                        {hrefText}
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
)(TutorialItem);
