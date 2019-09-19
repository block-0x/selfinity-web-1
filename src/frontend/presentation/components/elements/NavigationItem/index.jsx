import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import classNames from 'classnames';

class NavigationItem extends React.Component {
    static propTypes = {
        url: PropTypes.string,
        value: PropTypes.string,
        active: PropTypes.bool,
        show: PropTypes.bool,
    };

    static defaultProps = {
        url: '',
        value: '',
        active: false,
        show: true,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'NavigationItem'
        );
    }

    render() {
        const { url, value, active, show } = this.props;

        return show ? (
            <Link
                to={url}
                className={classNames('navigation-item__link', {
                    active: active,
                })}
            >
                <div className="navigation-item">{value}</div>
            </Link>
        ) : (
            <div />
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NavigationItem);
