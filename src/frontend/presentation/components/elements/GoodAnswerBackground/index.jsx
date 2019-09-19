import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '@elements/Icon';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import AppPropTypes from '@extension/AppPropTypes';
import models from '@network/client_models';
import * as contentActions from '@redux/Content/ContentReducer';
import classNames from 'classnames';

class GoodAnswerBackground extends React.Component {
    static propTypes = {
        children: AppPropTypes.Children,
        repository: AppPropTypes.Content,
        className: PropTypes.string,
        offsetY: PropTypes.number,
    };

    static defaultProps = {
        repository: models.Content.build(),
        offsetY: 0,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'GoodAnswerBackground'
        );
    }

    render() {
        const { repository, children, isShow, className, offsetY } = this.props;

        return (
            <div className={classNames('good-answer-background', className)}>
                <div className="good-answer-background__children">
                    {children}
                </div>
                <div
                    className="good-answer-background__back"
                    style={{ top: `${8 + offsetY}px` }}
                >
                    {isShow && (
                        <Icon
                            className="good-answer-background__back-icon"
                            src={'super-good-img'}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const repository = contentActions.bind(props.repository, state);
        return {
            isShow:
                repository.isBetterAnswer == 1 ||
                repository.isBetterAnswer == true,
        };
    },

    dispatch => ({})
)(GoodAnswerBackground);
