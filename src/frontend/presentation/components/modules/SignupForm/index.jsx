/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Map } from 'immutable';
import * as sessionActions from '@redux/Session/SessionReducer';
import * as appActions from '@redux/App/AppReducer';
import { browserHistory } from 'react-router';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import tt from 'counterpart';
import { Link } from 'react-router';
import GradationButton from '@elements/GradationButton';
import SimpleButton from '@elements/SimpleButton';
import { SIGNUP_STEP } from '@entity';
import { Enum, defineEnum } from '@extension/Enum';
import DropDownContainer from '@cards/DropDownContainer';
import DropDownMenu from '@modules/DropDownMenu';
import DropDownItem from '@elements/DropDownItem';
import countryCode from '@constants/countryCode';
import Ripple from '@elements/Ripple';
import {
    signupRoute,
    resendConfirmationMailRoute,
    resendConfirmationCodeRoute,
    termRoute,
    privacyRoute,
} from '@infrastructure/RouteInitialize';
import { ClientError } from '@extension/Error';
import SwitchButton from '@elements/SwitchButton';
import OAuthButtons from '@modules/OAuthButtons';
import Cookies from 'js-cookie';
import Img from 'react-image';
import oauth from '@network/oauth';
import autobind from 'class-autobind';

var saveLoginDefault = true;
if (process.env.BROWSER) {
    const s = localStorage.getItem('saveLogin') || Cookies.get('saveLogin');
    if (s === 'no') saveLoginDefault = false;
}

class SignupForm extends Component {
    static PropTypes = {
        location: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        identity: AppPropTypes.identity.isRequired,
        errors: PropTypes.shape({
            username_error: PropTypes.string.isRequired,
            email_error: PropTypes.string.isRequired,
            phoneNumber_error: PropTypes.string.isRequired,
        }).isRequired,
        queryParams: PropTypes.shape({
            username: PropTypes.string,
            email: PropTypes.string,
            token: PropTypes.string,
            ref: PropTypes.string,
            xref: PropTypes.string,
            step: PropTypes.string,
        }).isRequired,
        setLocale: PropTypes.func.isRequired,
        guessCountryCode: PropTypes.func.isRequired,
        incrementStep: PropTypes.func.isRequired,
        decrementStep: PropTypes.func.isRequired,
        setStep: PropTypes.func.isRequired,
        setUsername: PropTypes.func.isRequired,
        setEmail: PropTypes.func.isRequired,
        setPassword: PropTypes.func.isRequired,
        setPhone: PropTypes.func.isRequired,
        setPhoneFormatted: PropTypes.func.isRequired,
        setToken: PropTypes.func.isRequired,
        setPrefix: PropTypes.func.isRequired,
        setCompleted: PropTypes.func.isRequired,
        // setTrackingId: PropTypes.func.isRequired,
        logCheckpoint: PropTypes.func.isRequired,
        showSignupModal: PropTypes.func.isRequired,
        hideSignupModal: PropTypes.func.isRequired,
    };

    static defaultProps = {
        queryParams: {
            username: undefined,
            email: undefined,
            token: undefined,
            ref: undefined,
            xref: undefined,
        },
        identity: {
            countryCode: null,
        },
        errors: {
            username_error: null,
            email_error: null,
            phoneNumber_error: null,
        },
    };

    static pushURLState(step) {
        if (window) {
            window.history.pushState(
                {},
                'signup',
                signupRoute.getPath({
                    query: {
                        step,
                    },
                })
            );
        }
    }

    static pushURL(step) {
        if (window) {
            browserHistory.push(
                signupRoute.getPath({
                    query: {
                        step,
                    },
                })
            );
        }
    }

    constructor(props) {
        super(props);
        this.setStateFromProps(props);
        const { step, accessToken } = props.queryParams;
        if (accessToken != undefined && step) {
            props.setUserStep(accessToken, step);
            SignupForm.pushURLState(step);
        } else if (!!step) {
            const localAccessToken =
                oauth.getAccessToken(localStorage) || props.accessToken;
            props.setUserStep(localAccessToken, step);
        }
        autobind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'SignupForm');
    }

    setStateFromProps(props, step = null) {
        const propsStep = SIGNUP_STEP.getByValue('value', props.identity.step);
        this.state = {
            locale: props.locale,
            section: this.getSection(this.getHeadTitle(propsStep)),
            formRow: this.getFormRow(propsStep),
            username: props.identity.username,
            username_booked_at: props.identity.username_booked_at,
            email: props.identity.email,
            email_is_verified: props.identity.email_is_verified,
            last_attempt_verify_email: props.identity.email_is_verified,
            phoneNumber: props.identity.phoneNumber,
            phoneNumberFormatted: props.identity.phoneNumberFormatted,
            phone_number_is_verified: props.identity.phone_number_is_verified,
            last_attempt_verify_phone_number:
                props.identity.last_attempt_verify_phone_number,
            countryCode: props.identity.countryCode || '81',
            confirmation_code: props.identity.confirmation_code,
            password_hash: props.identity.password_hash,
            password: props.identity.password,
            token: props.identity.token,
            completed: props.identity.completed,
            step: propsStep,
            username_error: props.errors.username_error,
            email_error: props.errors.email_error,
            phoneNumber_error: props.errors.phoneNumber_error,
        };
    }

    componentWillMount() {
        this.setState({ acceptTerm: true });
    }

    componentDidMount() {
        const { username, step } = this.state;
        if (!!username && !!step) {
            SignupForm.pushURLState(step.value);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { username, step } = nextState;
        if (!!username && !!step) {
            SignupForm.pushURLState(step.value);
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextStep = SIGNUP_STEP.getByValue(
            'value',
            nextProps.identity.step
        );
        if (this.state.step == nextStep) return;
        this.setStateFromProps(nextProps);
    }

    onUserNameChange = e => {
        if (e) e.preventDefault();
        this.setState({ username: e.target.value });
    };

    onEmailChange = e => {
        if (e) e.preventDefault();
        this.setState({ email: e.target.value });
    };

    onPasswordChange = e => {
        if (e) e.preventDefault();
        this.setState({ password: e.target.value });
    };

    onConfirmPasswordChange = e => {
        if (e) e.preventDefault();
        this.setState({ confirm_password: e.target.value });
    };

    onPhoneNumberChange = e => {
        if (e) e.preventDefault();
        this.setState({ phoneNumber: e.target.value });
    };

    onCountryCodeChange = e => {
        if (e) e.preventDefault();
        this.setState({ countryCode: e.target.value });
    };

    onConfirmationCodeChange = e => {
        if (e) e.preventDefault();
        this.setState({ confirmation_code: e.target.value });
    };

    onCancel = e => {
        // e.preventDefault();
        const { step } = this.state;
        const { incrementStep, decrementStep } = this.props;

        switch (step) {
            case SIGNUP_STEP.Password:
                break;
            case SIGNUP_STEP.UserNameEmail:
            case SIGNUP_STEP.MiddlePoint:
                browserHistory.push('/');
                break;
            default:
                decrementStep();
                break;
        }
    };

    onSubmit = e => {};

    getFormRow(step) {
        switch (step) {
            case SIGNUP_STEP.Options:
                break;
            case SIGNUP_STEP.UserNameEmail:
                return defineEnum({
                    Text: {
                        rawValue: 0,
                        value: 'text',
                        title: tt('g.username_not_display'),
                        ref: 'username',
                        placeholder: tt('g.please_enter', {
                            data: tt('g.username'),
                        }),
                        onChange: this.onUserNameChange,
                        disabled: false,
                    },
                    TextEmail: {
                        rawValue: 1,
                        value: 'text',
                        title: tt('g.email'),
                        ref: 'email',
                        placeholder: tt('g.please_enter', {
                            data: tt('g.email'),
                        }),
                        onChange: this.onEmailChange,
                        disabled: false,
                    },
                    Term: {
                        rawValue: 2,
                        value: 'term',
                    },
                    Buttons: {
                        rawValue: 3,
                        value: 'buttons',
                        submitTitle: tt('g.next'),
                        submitOnClick: this.onSubmit,
                        cancelTitle: tt('g.to_next', { data: tt('g.home') }),
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
            case SIGNUP_STEP.CheckYourEmail:
                return defineEnum({
                    Detail: {
                        rawValue: 0,
                        value: 'detail',
                        title: tt('g.send_confirm_email'),
                    },
                    ResendEmail: {
                        rawValue: 1,
                        value: 'resend_email',
                    },
                });
            case SIGNUP_STEP.Password:
                return defineEnum({
                    Password: {
                        rawValue: 0,
                        value: 'password',
                        title: tt('g.password'),
                        ref: 'password',
                        placeholder: tt('g.please_enter', {
                            data: tt('g.password'),
                        }),
                        onChange: this.onPasswordChange,
                        disabled: false,
                    },
                    ConfirmPassword: {
                        rawValue: 1,
                        value: 'password',
                        title: tt('g.confirm_of_password'),
                        placeholder: tt('g.please_enter', {
                            data: tt('g.confirm_of_password'),
                        }),
                        ref: 'confirm_password',
                        onChange: this.onConfirmPasswordChange,
                        disabled: false,
                    },
                    Buttons: {
                        rawValue: 2,
                        value: 'buttons',
                        submitTitle: tt('g.next'),
                        submitOnClick: this.onSubmit,
                        cancelTitle: tt('g.go_back'),
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
            case SIGNUP_STEP.MiddlePoint:
                return defineEnum({
                    Detail2: {
                        rawValue: 0,
                        value: 'detail',
                        title: tt('g.signup_middlepoint_descript'),
                    },
                    Buttons2: {
                        rawValue: 1,
                        value: 'buttons',
                        submitTitle: tt('g.register_phone'),
                        submitOnClick: this.onSubmit,
                        cancelTitle: tt('g.to_next', { data: tt('g.home') }),
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
            case SIGNUP_STEP.PhoneNumber:
                return defineEnum({
                    DropDown: {
                        rawValue: 0,
                        value: 'dropdown',
                        ref: 'countryCode',
                        title: tt('g.country_code'),
                        placeholder: tt('g.please_enter', {
                            data: tt('g.country_code'),
                        }),
                        onChange: this.onCountryCodeChange,
                        disabled: false,
                    },
                    Text: {
                        rawValue: 0,
                        value: 'text',
                        title: tt('g.phone'),
                        ref: 'phoneNumber',
                        placeholder: tt('g.please_enter', {
                            data: tt('g.phone'),
                        }),
                        onChange: this.onPhoneNumberChange,
                        disabled: false,
                    },
                    Buttons: {
                        rawValue: 1,
                        value: 'buttons',
                        submitTitle: tt('g.next'),
                        submitOnClick: this.onSubmit,
                        cancelTitle: tt('g.go_back'),
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
            case SIGNUP_STEP.ConfirmPhoneNumber:
                return defineEnum({
                    Text: {
                        rawValue: 0,
                        value: 'text',
                        title: tt('g.phone_code_with_notif'),
                        ref: 'confirmation_code',
                        placeholder: tt('g.please_enter', {
                            data: tt('g.phone_code_with_notif'),
                        }),
                        onChange: this.onConfirmationCodeChange,
                        disabled: false,
                    },
                    ResendEmail: {
                        rawValue: 1,
                        value: 'resend_code',
                    },
                    Buttons: {
                        rawValue: 1,
                        value: 'buttons',
                        submitTitle: tt('g.next'),
                        submitOnClick: this.onSubmit,
                        cancelTitle: null, //'もう一度Codeを送る',
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
            case SIGNUP_STEP.Finish:
                return defineEnum({
                    Detail3: {
                        rawValue: 0,
                        value: 'detail',
                        title: tt('g.signup_finish'),
                    },
                    Buttons4: {
                        rawValue: 1,
                        value: 'buttons',
                        submitTitle: tt('g.to_next', { data: tt('g.home') }),
                        submitOnClick: this.onSubmit,
                        cancelTitle: null,
                        cancelOnClick: this.onCancel,
                        isSubmitable: true,
                        isCancelable: true,
                    },
                });
        }
    }

    getSection(title = null) {
        return defineEnum({
            Head: {
                rawValue: 0,
                value: 'head',
            },
            Title: {
                rawValue: 1,
                value: 'title',
                title: title ? title : tt('g.signup'),
            },
            Form: {
                rawValue: 2,
                value: 'form',
            },
        });
    }

    getHeadTitle(step) {
        switch (step) {
            case SIGNUP_STEP.CheckYourEmail:
                return tt('g.send_confirm_email_title');
            case SIGNUP_STEP.MiddlePoint:
                return tt('g.congratulations');
            case SIGNUP_STEP.Finish:
                return tt('g.thanks');
            default:
                return null;
        }
    }

    saveLoginToggle = () => {
        const { saveLogin } = this.state;
        saveLoginDefault = !saveLoginDefault;
        localStorage.setItem('saveLogin', saveLoginDefault ? 'yes' : 'no');
        saveLogin.props.onChange(saveLoginDefault); // change UI
    };

    onChangeAcceptTerm(e) {
        this.setState({ acceptTerm: e });
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            step,
            username,
            email,
            phoneNumber,
            countryCode,
            password,
            confirm_password,
            confirmation_code,
            acceptTerm,
        } = this.state;
        const {
            incrementStep,
            decrementStep,
            setUsername,
            setEmail,
            setPassword,
            setPhone,
            setCountryCode,
            setConfirmationCode,
            addError,
        } = this.props;

        const number_regexp = /^[0-9]+$/;

        switch (step) {
            case SIGNUP_STEP.UserNameEmail:
                if (!acceptTerm) {
                    addError(
                        new ClientError({
                            error: new Error('not_agree_term'),
                            tt_key: 'errors.not_agree_term',
                        })
                    );
                    return;
                }
                setUsername(username);
                setEmail(email);
                incrementStep();
                break;
            case SIGNUP_STEP.PhoneNumber:
                if (!countryCode.match(number_regexp)) {
                    addError(
                        new ClientError({
                            error: new Error('Invalid response from server'),
                            tt_key: 'errors.not_number_country_code',
                        })
                    );
                }
                if (!phoneNumber.match(number_regexp)) {
                    addError(
                        new ClientError({
                            error: new Error('Invalid response from server'),
                            tt_key: 'errors.not_number_phone',
                        })
                    );
                }
                setPhone(phoneNumber);
                setCountryCode(countryCode);
                incrementStep();
                break;
            case SIGNUP_STEP.ConfirmPhoneNumber:
                setConfirmationCode(confirmation_code);
                incrementStep();
                break;
            case SIGNUP_STEP.Password:
                if (password !== confirm_password) {
                    addError(
                        new ClientError({
                            error: new Error('Invalid response from server'),
                            tt_key: 'errors.confirm_password_is_not_valid',
                        })
                    );
                    return;
                }
                setPassword(username, password);
                incrementStep();
                break;
            case SIGNUP_STEP.Finish:
                browserHistory.push('/');
                break;
            default:
                incrementStep();
                break;
        }
    };

    onClickPhoneCode(e) {
        if (e.target.innerText)
            this.setState({ countryCode: e.target.innerText.match(/\d+/g)[0] });
    }

    clearError = e => {
        if (e) e.preventDefault();
    };

    render() {
        const { section, formRow, saveLoginToggle, acceptTerm } = this.state;

        const {
            handleSubmit,
            clearError,
            onClickPhoneCode,
            state,
            onChangeAcceptTerm,
        } = this;

        const {
            showResendConfirmationMailModal,
            showResendConfirmationCodeModal,
            location,
        } = this.props;

        if (!process.env.BROWSER) {
            return (
                <div className="row">
                    <div className="column">
                        <p>{'loading'}...</p>
                    </div>
                </div>
            );
        }

        const head = (
            <div className="SignupForm__head">
                <Link className="SignupForm__head__link" to="/">
                    <Img
                        className="SignupForm__head__logo"
                        src="/images/selfinityMiniWhiteBlurLogo.png"
                        alt={tt('alts.default')}
                    />
                </Link>
            </div>
        );

        const titleText = title => (
            <h3 className="SignupForm__title">
                <span className="SignupForm__title">{title}</span>
            </h3>
        );

        const detailText = (key, text) => (
            <div className="SignupForm__detail fade-in--1" key={key}>
                {text}
            </div>
        );

        const resendEmailText = key => (
            <Link
                className="SignupForm__detail-link fade-in--1"
                key={key}
                onClick={showResendConfirmationMailModal}
            >
                {tt('g.send_email_not_reach')}
            </Link>
        );

        const resendCodeText = key => (
            <Link
                className="SignupForm__detail-link fade-in--1"
                key={key}
                onClick={showResendConfirmationCodeModal}
            >
                {tt('g.send_code_not_reach')}
            </Link>
        );

        const text_input = ({
            key,
            title,
            placeholder,
            onChange,
            ref,
            disabled = false,
            isPassword = false,
            error = null,
        }) => (
            <div className="SignupForm__text-input fade-in--1" key={key}>
                <div className="SignupForm__text-input__label">{title}</div>
                <div className="SignupForm__text-input-group">
                    {isPassword && (
                        <input type="hidden" ref={ref} value={state[ref]} />
                    )}
                    <input
                        className="SignupForm__text-input-group-field"
                        type={isPassword ? 'password' : 'text'}
                        required
                        placeholder={placeholder}
                        onChange={onChange}
                        autoComplete="on"
                        disabled={disabled}
                        value={state[ref] == undefined ? '' : state[ref]}
                    />
                </div>
                {error && (
                    <div className="SignupForm__text-input-group-error fade-in--1">
                        {error}
                    </div>
                )}
            </div>
        );

        const phoneCodeDropDownItem = Object.keys(countryCode).map(
            (key, index) => (
                <DropDownItem
                    key={index}
                    onClick={onClickPhoneCode}
                    query={`${countryCode[key].name}(+${
                        countryCode[key].code
                    })`}
                >
                    <Ripple>
                        <div className="SignupForm__drop-down-item">
                            <div className="SignupForm__drop-down-item-value">
                                {`${countryCode[key].name}(+${
                                    countryCode[key].code
                                })`}
                            </div>
                        </div>
                    </Ripple>
                </DropDownItem>
            )
        );

        const phoneCodeDropDown = (item, key) => (
            <div className="SignupForm__drop-down" key={key}>
                <DropDownContainer
                    content={text_input({
                        key,
                        ...item,
                    })}
                >
                    <DropDownMenu query={this.state.countryCode}>
                        {phoneCodeDropDownItem}
                    </DropDownMenu>
                </DropDownContainer>
            </div>
        );

        const submit_buttons = (
            key,
            submitTitle,
            submitOnClick,
            cancelTitle,
            cancelOnClick,
            isSubmitable = true,
            isCancelable = true
        ) => (
            <div className="SignupForm__buttons fade-in--1" key={key}>
                <div className="SignupForm__button">
                    <GradationButton
                        submit={true}
                        color="blue"
                        disabled={!isSubmitable}
                        onClick={submitOnClick}
                        value={submitTitle}
                    />
                </div>
                {cancelTitle && (
                    <div className="SignupForm__button">
                        <SimpleButton
                            color="white"
                            disabled={isCancelable}
                            onClick={cancelOnClick}
                            value={cancelTitle}
                        />
                    </div>
                )}
                <div className="SignupForm__button" id="button_login">
                    <SimpleButton
                        color="white"
                        active={true}
                        url={'/login'}
                        value={tt('g.return_to', { data: tt('g.login') })}
                    />
                </div>
            </div>
        );

        const term_item = key => (
            <div className="SignupForm__term" key={key}>
                この画面を押してユーザー登録を進めた場合、<Link
                    className="SignupForm__term-value"
                    to={termRoute.path}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {tt('g.terms')}
                </Link>・<Link
                    className="SignupForm__term-value"
                    to={privacyRoute.path}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {tt('g.privacy_policy')}
                </Link>に同意したものとみなします
            </div>
        );

        const renderForm = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'text':
                        return text_input({
                            key: index,
                            ...item,
                        });
                    case 'dropdown':
                        return phoneCodeDropDown(item, index);
                    case 'password':
                        return text_input({
                            key: index,
                            ...item,
                            isPassword: true,
                        });
                    case 'detail':
                        return detailText(index, item.title);
                    case 'term':
                        return term_item(index);
                    case 'resend_email':
                        return resendEmailText(index);
                    case 'resend_code':
                        return resendCodeText(index);
                    case 'buttons':
                        return submit_buttons(
                            index,
                            item.submitTitle,
                            item.submitOnClick,
                            item.cancelTitle,
                            item.cancelOnClick,
                            item.isSubmitable,
                            item.isCancelable
                        );
                    default:
                        break;
                }
            });

        const form = (
            <form onSubmit={handleSubmit} onChange={clearError} method="post">
                {renderForm(formRow)}
            </form>
        );

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'head':
                        return (
                            <div className="SignupForm__head" key={index}>
                                {head}
                            </div>
                        );
                    case 'title':
                        return (
                            <div className="SignupForm__titleText" key={index}>
                                {titleText(item.title)}
                            </div>
                        );
                    case 'form':
                        return (
                            <div className="SignupForm__form" key={index}>
                                {form}
                            </div>
                        );
                }
            });

        return (
            <div className="SignupForm">
                <OAuthButtons
                    style={{
                        display:
                            location.query.step &&
                            location.query.step !=
                                SIGNUP_STEP.UserNameEmail.value
                                ? 'none'
                                : 'block',
                    }}
                    isSession={true}
                    error={
                        !acceptTerm
                            ? new ClientError({
                                  error: new Error('not_agree_term'),
                                  tt_key: 'errors.not_agree_term',
                              })
                            : null
                    }
                />
                {renderItem(section)}
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const map_identity = state.session.get('identity');
        const map_errors = state.session.get('errors');
        const accessToken = state.session.get('accessToken');
        return {
            accessToken,
            queryParams: ownProps.location.query,
            locale: state.app.getIn(['user_preferences', 'locale']),
            identity: map_identity.toJS(),
            step: state.session.get('step'),
            errors: map_errors.toJS(),
        };
    },
    dispatch => ({
        addError: error => {
            dispatch(appActions.addError({ error }));
        },
        generateAccessToken: accessToken => {
            dispatch(
                sessionActions.generateAccessToken({
                    accessToken,
                    isOneTime: true,
                })
            );
        },
        setUserStep: (accessToken, step) => {
            dispatch(sessionActions.setUserStep({ accessToken, step }));
        },
        setLocale: locale => {
            dispatch(appActions.setUserPreferences({ locale: locale }));
        },
        guessCountryCode: () => {
            dispatch(sessionActions.guessCountryCode());
        },
        incrementStep: () => {
            dispatch(sessionActions.incrementStep());
        },
        decrementStep: () => {
            dispatch(sessionActions.decrementStep());
        },
        showSignupModal: () => {
            dispatch(sessionActions.hideSignUp());
        },
        hideSignupModal: () => {
            dispatch(sessionActions.hideSignUp());
        },
        setStep: stepName => {
            dispatch(sessionActions.setStep(stepName));
        },
        setUsername: username => {
            dispatch(sessionActions.setUsername(username));
        },
        setEmail: email => {
            dispatch(sessionActions.setEmail(email));
        },
        setPassword: (username, password) => {
            dispatch(sessionActions.setPassword({ username, password }));
        },
        setPhone: phone => {
            dispatch(sessionActions.setPhone(phone));
        },
        setCountryCode: countryCode => {
            dispatch(sessionActions.setCountryCode(countryCode));
        },
        clearErrors: () => {
            dispatch(sessionActions.clearErrors());
        },
        setUsernameError: username_error => {
            dispatch(sessionActions.setUsername(username_error));
        },
        setEmailError: email_error => {
            dispatch(sessionActions.setEmail(email_error));
        },
        setPhoneError: phone_error => {
            dispatch(sessionActions.setPhone(phoneNumber_error));
        },
        setPhoneFormatted: phoneFormatted => {
            dispatch(sessionActions.setPhoneFormatted(phoneFormatted));
        },
        setToken: token => {
            dispatch(sessionActions.setToken(token));
        },
        setAccessToken: accessToken => {
            dispatch(sessionActions.setAccessToken({ accessToken }));
        },
        removeAccessToken: () => {
            dispatch(sessionActions.removeAccessToken());
        },
        setPrefix: prefix => {
            dispatch(sessionActions.setPrefix(prefix));
        },
        setCompleted: completed => {
            dispatch(sessionActions.setCompleted(completed));
        },
        setConfirmationCode: confirmation_code => {
            dispatch(sessionActions.setConfirmationCode(confirmation_code));
        },
        showResendConfirmationMailModal: () => {
            dispatch(sessionActions.showResendConfirmationMailModal());
        },
        showResendConfirmationCodeModal: () => {
            dispatch(sessionActions.showResendConfirmationCodeModal());
        },
        // setTrackingId: trackingId => {
        //     dispatch(sessionActions.setTrackingId(trackingId));
        // },
        logCheckpoint: checkpoint => {
            dispatch(sessionActions.logCheckpoint(checkpoint));
        },
    })
)(SignupForm);
