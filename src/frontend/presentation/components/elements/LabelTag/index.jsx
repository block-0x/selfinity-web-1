import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { COLOR } from '@entity/Color';
import { browserHistory } from 'react-router';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { labelShowRoute } from '@infrastructure/RouteInitialize';

class LabelTag extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
        onClick: PropTypes.func,
        disable: PropTypes.bool,
    };

    static defaultProps = {
        repository: null,
        disable: false,
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'LabelTag');
        this.onClick = e => {
            const { repository, onClick, disable } = this.props;
            if (e) e.stopPropagation();
            if (!disable) {
                browserHistory.push(
                    labelShowRoute.getPath({
                        params: {
                            id: repository.id,
                        },
                    })
                );
            }
            this.props.onClick();
        };
        this.onClick.bind(this);
    }

    render() {
        const { repository, disable } = this.props;

        const { onClick } = this;

        if (!repository) return <div />;

        return (
            <div className="label-tag__link" onClick={onClick}>
                <div
                    className="label-tag"
                    style={{ background: repository.color || COLOR.Base.color }}
                >
                    <div className="label-tag__title">{repository.title}</div>
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
)(LabelTag);
