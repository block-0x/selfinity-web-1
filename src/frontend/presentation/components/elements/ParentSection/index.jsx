import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import AppPropTypes from '@extension/AppPropTypes';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';
import classNames from 'classnames';
import tt from 'counterpart';

class ParentSection extends React.Component {
    static propTypes = {
        isFold: PropTypes.bool,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        isFold: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ParentSection'
        );
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    };

    render() {
        const { isFold, ...inputProps } = this.props;

        return (
            <div className="parent-section__link" onClick={this.handleClick}>
                <div
                    className={classNames('parent-section', {
                        isFold: isFold,
                    })}
                >
                    <Icon
                        size={'2x'}
                        src="chevron-next"
                        className="parent-section__image"
                    />
                    <div className="parent-section__value">
                        {tt('g.answered_parent')}
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
)(ParentSection);
