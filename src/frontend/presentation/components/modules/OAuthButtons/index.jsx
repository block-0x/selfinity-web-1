import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import FacebookButton from '@elements/FacebookButton';
import TwitterButton from '@elements/TwitterButton';
import InstagramButton from '@elements/InstagramButton';
import { ClientError } from '@extension/Error';
import classNames from 'classnames';

class OAuthButtons extends React.Component {
    static propTypes = {
        isSession: PropTypes.bool,
        style: PropTypes.object,
        error: PropTypes.object,
        isModal: PropTypes.bool,
        modalPath: PropTypes.string,
    };

    static defaultProps = {
        isSession: false,
        isModal: false,
        style: {},
        error: null,
        modalPath: null,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OAuthButtons'
        );
    }

    render() {
        const { isSession, style, error, isModal, modalPath } = this.props;
        return (
            <div
                className={classNames('oauth-buttons', {
                    'is-modal': isModal,
                })}
                style={style}
            >
                <div className="oauth-buttons__item">
                    <InstagramButton
                        isSession={isSession}
                        error={error}
                        modalPath={modalPath}
                    />
                </div>
                <div className="oauth-buttons__item">
                    <TwitterButton
                        isSession={isSession}
                        error={error}
                        modalPath={modalPath}
                    />
                </div>
            </div>
        );
    }
}
/*
<div className="oauth-buttons__item">
                    <FacebookButton
                        isSession={isSession}
                        error={error}
                        modalPath={modalPath}
                    />
                </div>
*/

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(OAuthButtons);
