import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import IconButton from '@elements/IconButton';
import GradationIconButton from '@elements/GradationIconButton';

class Batch extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        children: PropTypes.node,
        isGradation: PropTypes.bool,
        padding: PropTypes.string,
    };

    static defaultProps = {
        src: '',
        isGradation: true,
        padding: null,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Batch');
    }

    render() {
        const { src, children, isGradation, padding } = this.props;

        return (
            <div className="batch">
                <div className="batch-item">
                    {isGradation ? (
                        <GradationIconButton
                            padding={padding}
                            size={'2_4x'}
                            color={'blue'}
                            src={src}
                        />
                    ) : (
                        <IconButton size={'2_4x'} src={src} />
                    )}
                </div>
                <div className="batch-body">{children}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(Batch);
