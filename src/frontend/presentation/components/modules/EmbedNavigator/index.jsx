import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import NavigatorItem from '@elements/NavigatorItem';
import autobind from 'class-autobind';

class EmbedNavigator extends React.Component {
    static propTypes = {
        template: PropTypes.string,
    };

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'EmbedNavigator'
        );
        autobind(this);
    }

    render() {
        const { template, children } = this.props;

        return (
            <div className="embed-navigator">
                <div className="embed-navigator-item">
                    <NavigatorItem template={template} />
                </div>
                <div className="embed-navigator-body">{children}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(EmbedNavigator);
