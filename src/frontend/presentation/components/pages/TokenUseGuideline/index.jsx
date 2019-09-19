import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import TokenUseGuidelineItem from '@elements/TokenUseGuidelineItem';

class TokenUseGuideline extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TokenUseGuideline'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        return <div className="token-use-guide-line" />;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TokenUseGuideline);
