import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import Icon from '@elements/Icon';
import LoadingIndicator from '@elements/LoadingIndicator';
import classNames from 'classnames';

class Point extends React.Component {
    static propTypes = {
        score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClick: PropTypes.func,
        size: PropTypes.oneOf(['S', 'M', 'L']),
    };

    static defaultProps = {
        score: 0,
        onClick: () => {},
        size: 'M',
    };

    onClick(e) {
        if (e) e.stopPropagation();
        if (this.props.onClick) this.props.onClick();
    }

    render() {
        const { score, size } = this.props;

        const { onClick } = this;

        return (
            <div className={classNames('point', size)}>
                <div className="point__link" onClick={onClick}>
                    <Icon
                        src="point"
                        size={size != 'S' ? '3x' : '2x'}
                        className="point__image"
                    />
                </div>
                {score == 'undefined' ? (
                    <div className="point__score">
                        <LoadingIndicator
                            type={'circle'}
                            style={{ marginTop: '-12px' }}
                        />
                    </div>
                ) : (
                    <div className="point__score">{`${score || 0}`}</div>
                )}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(Point);
