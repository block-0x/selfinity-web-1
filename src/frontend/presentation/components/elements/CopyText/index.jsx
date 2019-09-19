import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';
import tt from 'counterpart';

class CopyText extends React.Component {
    static propTypes = {
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    state = {
        copied: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'CopyText');
    }

    render() {
        const { value } = this.props;

        const { copied } = this.state;

        return (
            <div className="copy-text">
                <span className="copy-text__value">{value}</span>
                <CopyToClipboard
                    text={value}
                    onCopy={() => this.setState({ copied: true })}
                >
                    <span className="copy-text__icon-link">
                        <Icon
                            className="copy-text__icon"
                            src={'copy'}
                            size={'3x'}
                        />
                    </span>
                </CopyToClipboard>
                {this.state.copied && (
                    <span className="copy-text__toast">{tt('g.copied')}</span>
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
)(CopyText);
