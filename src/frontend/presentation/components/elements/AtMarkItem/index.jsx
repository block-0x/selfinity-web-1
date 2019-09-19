import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as appActions from '@redux/App/AppReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class AtMarkItem extends React.Component {
    static propTypes = {
        link: PropTypes.string,
        text: PropTypes.string,
    };

    static defaultProps = {
        link: null,
        text: '',
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'AtMarkItem');
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (e) e.stopPropagation();
        this.props.link && browserHistory.push(this.props.link);
    }

    render() {
        const { text, link } = this.props;

        return (
            <div className="at-mark-item" onClick={this.onClick}>
                {'@' + text}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(AtMarkItem);
