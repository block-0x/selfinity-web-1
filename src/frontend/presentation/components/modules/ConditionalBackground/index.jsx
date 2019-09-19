import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CONTENT_TYPE } from '@entity';
import GoodOpinionBackground from '@elements/GoodOpinionBackground';
import CheeringBackground from '@elements/CheeringBackground';
import GoodAnswerBackground from '@elements/GoodAnswerBackground';
import ope from '@extension/operator';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class ConditionalBackground extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
        className: PropTypes.string,
        children: AppPropTypes.Children,
        offsetY: PropTypes.number,
    };

    static defaultProps = {
        repository: null,
        className: '',
        offsetY: 0,
    };

    shouldComponentUpdate = shouldComponentUpdate(
        this,
        'ConditionalBackground'
    );

    render() {
        const { repository, className, children, offsetY } = this.props;

        const renderItem = item => {
            const defaultBackgroud = (
                <div className={className}>{children}</div>
            );
            if (!item) return defaultBackgroud;
            switch (true) {
                case item.isBetterOpinion == 1 || item.isBetterOpinion == true:
                    return (
                        <GoodOpinionBackground
                            repository={repository}
                            className={className}
                            offsetY={offsetY}
                        >
                            {children}
                        </GoodOpinionBackground>
                    );
                case item.isBetterAnswer == 1 || item.isBetterAnswer == true:
                    return (
                        <GoodAnswerBackground
                            repository={repository}
                            className={className}
                            offsetY={offsetY}
                        >
                            {children}
                        </GoodAnswerBackground>
                    );
                case item.isCheering == 1 || item.isCheering == true:
                    return (
                        <CheeringBackground
                            repository={repository}
                            className={className}
                            offsetY={offsetY}
                        >
                            {children}
                        </CheeringBackground>
                    );
                default:
                    return defaultBackgroud;
            }
        };

        return (
            <div className="conditional-background">
                {renderItem(repository)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalBackground);
