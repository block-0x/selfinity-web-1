/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import * as authActions from '@redux/Auth/AuthReducer';
import * as sessionActions from '@redux/Session/SessionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import tt from 'counterpart';
import { Link } from 'react-router';
import GradationButton from '@elements/GradationButton';
import SimpleButton from '@elements/SimpleButton';
import { Enum, defineEnum } from '@extension/Enum';
import { connect } from 'react-redux';
import Img from 'react-image';
import Cookies from 'js-cookie';

class LoginForm extends Component {
    static propTypes = {
        login_error: PropTypes.string,
        onCancel: PropTypes.func,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        //this.setStateFromProps(props)
    }

    setStateFromProps(props) {
        this.setState({
            login_error: props.login_error,
            email: '',
            password: '',
        });
    }

    componentWillMount() {
        this.setState({
            login_error: '',
            email: '',
            password: '',
            retry: false,
        });
    }

    componentDidMount() {}

    shouldComponentUpdate = shouldComponentUpdate(this, 'LoginForm');

    SignUp() {}

    SignIn() {}

    saveLoginToggle = () => {
        const { saveLogin } = this.state;
        saveLoginDefault = !saveLoginDefault;
        localStorage.setItem('saveLogin', saveLoginDefault ? 'yes' : 'no');
        Cookies.set('saveLogin', saveLoginDefault ? 'yes' : 'no');
    };

    showChangePassword = () => {
        const { email, password } = this.state;
    };

    onCancel = e => {
        if (e.preventDefault) e.preventDefault();
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    emailOnChange = e => {
        const value = e.target.value;
        this.setState({
            email: e.target.value,
        });
    };

    passwordOnChange = e => {
        const value = e.target.value;
        this.setState({
            password: e.target.value,
        });
    };

    handleSubmit = e => {
        if (e) e.preventDefault();
        const { login } = this.props;

        const { email, password } = this.state;
        if (
            email == '' ||
            password == '' ||
            typeof password == 'undefined' ||
            typeof email == 'undefined'
        )
            return;
        login(email, password);
        this.setState({ retry: true });
    };

    render() {
        const {
            passwordOnChange,
            emailOnChange,
            onCancel,
            handleSubmit,
        } = this;

        // const {
        //     email,
        //     password,
        //     login_error,
        // } = this.state;

        const head = (
            <div className="LoginForm__head">
                <Link className="LoginForm__head__link" to="/">
                    <Img
                        className="LoginForm__head__logo"
                        src="/images/selfinityMiniWhiteBlurLogo.png"
                        alt={tt('alts.default')}
                    />
                </Link>
            </div>
        );

        const titleText = (title = tt('g.login')) => (
            <h3 className="LoginForm__title">
                <span className="LoginForm__title">{title}</span>
            </h3>
        );

        const signupLink = (
            <div className="LoginForm__sign-up">
                <p>
                    {''} <em>{''}</em>
                    {''}
                </p>
                <SimpleButton
                    color="white"
                    active={true}
                    className="LoginForm__sign-up-button hollow"
                    value={tt('g.return_to', { data: tt('g.signup') })}
                    url="/signup"
                />
            </div>
        );

        const form = (
            <form onSubmit={handleSubmit} method="post">
                <div className="LoginForm__username-input-group">
                    <div className="LoginForm__username-input-group-label">
                        {tt('g.email')}
                    </div>
                    <input
                        className="LoginForm__username-input-group-field"
                        type="text"
                        required
                        placeholder={tt('g.please_enter', {
                            data: tt('g.email'),
                        })}
                        ref="email"
                        onChange={emailOnChange}
                        autoComplete="on"
                        disabled={false}
                    />
                </div>

                <div className="LoginForm__password-input-group">
                    <div className="LoginForm__password-input-group-label">
                        {tt('g.password')}
                    </div>
                    <input
                        className="LoginForm__password-input-group-field"
                        type="password"
                        required
                        ref="pw"
                        onChange={passwordOnChange}
                        placeholder={tt('g.please_enter', {
                            data: tt('g.password'),
                        })}
                        autoComplete="on"
                        disabled={false}
                    />
                </div>
                <div className="LoginForm__login-modal-buttons">
                    <br />
                    <GradationButton
                        submit={true}
                        disabled={false}
                        value={tt('g.login')}
                        color={'blue'}
                    />
                    {this.props.onCancel && (
                        <button
                            type="button float-right"
                            disabled={false}
                            className="button hollow"
                            onClick={this.props.onCancel}
                        >
                            {tt('g.cancel')}
                        </button>
                    )}
                </div>
                {signupLink}
            </form>
        );

        return (
            <div className="LoginForm">
                <div className="LoginForm__head">{head}</div>
                <div className="LoginForm__titleText">{titleText()}</div>
                <div className="LoginForm__form">{form}</div>
                {this.state.retry && (
                    <div className="LoginForm__link">
                        <Link
                            className="LoginForm__link-text fade-in--1"
                            onClick={
                                this.props
                                    .showSendDeletePasswordConfirmationMailModal
                            }
                        >
                            {tt('g.delete_password_link')}
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}
/*
<div style={{ marginTop: '14px', marginBottom: '14px' }}>
    <label
        className="LoginForm__save-login"
        htmlFor="saveLogin"
    >
        <input
            className="LoginForm__save-login-input"
            id="saveLogin"
            type="checkbox"
            ref="pw"
            onChange={this.saveLoginToggle}
            disabled={false}
        />&nbsp;{tt('g.auto_login_question_mark')}
    </label>
</div>
*/

let hasError;
let saveLoginDefault = true;
if (process.env.BROWSER) {
    const s = localStorage.getItem('saveLogin');
    if (s === 'no') saveLoginDefault = false;
}

export default connect(
    state => {
        const login_error = state.auth.get('login_error');
        const currentUser_map = state.auth.get('current_user');
        const current_user = !!currentUser_map ? currentUser_map.toJS() : null;
        return {
            login_error,
            current_user,
        };
    },
    dispatch => ({
        login: (email, password) => {
            dispatch(authActions.login({ email, password }));
        },
        clearError: () => {
            dispatch(authActions.loginError({ error: null }));
        },
        showSendDeletePasswordConfirmationMailModal: () => {
            dispatch(
                sessionActions.showSendDeletePasswordConfirmationMailModal()
            );
        },
    })
)(LoginForm);
