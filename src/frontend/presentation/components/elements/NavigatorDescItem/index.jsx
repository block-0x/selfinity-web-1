import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import autobind from 'class-autobind';
import tt from 'counterpart';
import Icon from '@elements/Icon';

class NavigatorDescItem extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        title: PropTypes.string,
        value: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        src: 'chevron-next',
        value: '',
        title: '',
    };

    state = {};

    constructor(props) {
        super(props);
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigatorDescItem'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { onClick, src, title, value } = this.props;

        return (
            <div
                className="navigator-menu-item"
                onClick={e => {
                    if (e) e.stopPropagation();
                    // onClick(e);
                }}
            >
                <div className="navigator-menu-item__header">
                    <div className="navigator-menu-item__header-image">
                        <Icon src={src} size={'2x'} />
                    </div>
                    <div className="navigator-menu-item__header-title">
                        {title}
                    </div>
                </div>
                <div className="navigator-menu-item__body">{value}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigatorDescItem);
