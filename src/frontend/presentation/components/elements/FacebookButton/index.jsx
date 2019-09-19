import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Ripple from '@elements/Ripple';
import * as appActions from '@redux/App/AppReducer';
import Img from 'react-image';
import tt from 'counterpart';

class FacebookButton extends React.Component {
    static propTypes = {
        isSession: PropTypes.bool,
        error: PropTypes.any,
        modalPath: PropTypes.string,
    };

    static defaultProps = {
        isSession: false,
        error: null,
        modalPath: null,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'FacebookButton'
        );
    }

    render() {
        const { isSession, error, addError, modalPath } = this.props;

        return (
            <Ripple>
                <Link
                    className="facebook-button__link"
                    onClick={e => {
                        error
                            ? addError(error)
                            : !!isSession
                              ? (window.location.href =
                                    '/auth/facebook/session')
                              : (window.location.href = !modalPath
                                    ? '/auth/facebook'
                                    : `/auth/facebook/confirm?modal=${
                                          modalPath
                                      }`);
                    }}
                >
                    <div className="facebook-button">
                        <Img
                            src="/images/facebook.png"
                            className="facebook-button__image"
                            alt={tt('alts.default')}
                        />
                    </div>
                </Link>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({
        addError: error => {
            dispatch(appActions.addError({ error }));
        },
    })
)(FacebookButton);
