import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import * as sessionActions from '@redux/Session/SessionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import GradationButton from '@elements/GradationButton';
import SimpleButton from '@elements/SimpleButton';
import tt from 'counterpart';
import {
    signupRoute,
    confirmForDeleteRoute,
    confirmForPrivateKeyRoute,
    sendDeletePasswordConfirmationMailRoute,
} from '@infrastructure/RouteInitialize';
import DropDownContainer from '@cards/DropDownContainer';
import DropDownMenu from '@modules/DropDownMenu';
import DropDownItem from '@elements/DropDownItem';
import countryCode from '@constants/countryCode';
import Ripple from '@elements/Ripple';
import { ClientError } from '@extension/Error';
import { Enum, defineEnum } from '@extension/Enum';
import OAuthButtons from '@modules/OAuthButtons';

class LoginModalList extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func,
        confirmForPrivateKey: PropTypes.bool,
        confirmForDelete: PropTypes.bool,
        confirmationMail: PropTypes.bool,
        confirmationCode: PropTypes.bool,
        confirmationDeletePassword: PropTypes.bool,
    };

    static defaultProps = {
        confirmForPrivateKey: false,
        confirmForDelete: false,
        confirmationMail: false,
        confirmationCode: false,
        confirmationDeletePassword: false,
    };

    state = {
        username: '',
        phonenumber: '',
        countrycode: '',
        email: '',
        password: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'LoginModalList'
        );
        this.emailOnChange = this.emailOnChange.bind(this);
        this.passwordOnChange = this.passwordOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.usernameOnChange = this.usernameOnChange.bind(this);
        this.phonenumberOnChange = this.phonenumberOnChange.bind(this);
        this.countrycodeOnChange = this.countrycodeOnChange.bind(this);
        this.onClickSignUp = this.onClickSignUp.bind(this);
        this.setSectionFromProps = this.setSectionFromProps.bind(this);
        this.setStateFromProps = this.setStateFromProps.bind(this);
        this.countrycodeOnClick = this.countrycodeOnClick.bind(this);
    }

    componentWillMount() {
        this.setStateFromProps(this.props);
    }

    setStateFromProps(props) {
        const {
            confirmationMail,
            confirmationCode,
            confirmForPrivateKey,
            confirmationDeletePassword,
            current_user,
            identity,
        } = props;

        this.setSectionFromProps(props);

        switch (true) {
            case confirmationDeletePassword:
            case confirmationMail:
                this.setState({
                    username: current_user
                        ? current_user.username
                        : identity.username,
                    email: identity.email,
                });
                break;
            case confirmationCode:
                this.setState({
                    phonenumber: identity.phonenumber,
                    countrycode: identity.countrycode,
                });
                break;
        }
    }

    setSectionFromProps(props) {
        const {
            confirmationMail,
            confirmationDeletePassword,
            confirmationCode,
            confirmForPrivateKey,
        } = props;

        const section = () => {
            switch (true) {
                case confirmationDeletePassword:
                    return defineEnum({
                        Text: {
                            rawValue: 0,
                            value: 'text',
                            title: tt('g.username_not_display'),
                            ref: 'username',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.username'),
                            }),
                            onChange: this.usernameOnChange,
                            disabled: false,
                            state: 'username',
                        },
                        TextEmail: {
                            rawValue: 1,
                            value: 'text',
                            title: tt('g.email'),
                            ref: 'email',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.email'),
                            }),
                            onChange: this.emailOnChange,
                            disabled: false,
                            state: 'email',
                        },
                        Button: {
                            rawValue: 2,
                            value: 'button',
                            title: tt('g.send'),
                            disabled: false,
                        },
                    });
                case confirmationMail:
                    return defineEnum({
                        Text: {
                            rawValue: 0,
                            value: 'text',
                            title: tt('g.username_not_display'),
                            ref: 'username',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.username'),
                            }),
                            onChange: this.usernameOnChange,
                            disabled: false,
                            state: 'username',
                        },
                        TextEmail: {
                            rawValue: 1,
                            value: 'text',
                            title: tt('g.email'),
                            ref: 'email',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.email'),
                            }),
                            onChange: this.emailOnChange,
                            disabled: false,
                            state: 'email',
                        },
                        Button: {
                            rawValue: 2,
                            value: 'button',
                            title: tt('g.send'),
                            disabled: false,
                        },
                    });
                case confirmationCode:
                    return defineEnum({
                        DropDown: {
                            rawValue: 0,
                            value: 'dropdown',
                            ref: 'countryCode',
                            title: tt('g.country_code'),
                            placeholder: tt('g.please_enter', {
                                data: tt('g.country_code'),
                            }),
                            onChange: this.countrycodeOnChange,
                            disabled: false,
                            state: 'countrycode',
                        },
                        Text: {
                            rawValue: 0,
                            value: 'text',
                            title: tt('g.phone'),
                            ref: 'PhoneNumber',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.phone'),
                            }),
                            onChange: this.phonenumberOnChange,
                            disabled: false,
                            state: 'phonenumber',
                        },
                        Button: {
                            rawValue: 2,
                            value: 'button',
                            title: tt('g.send'),
                            disabled: false,
                        },
                    });
                case confirmForPrivateKey:
                default:
                    return defineEnum({
                        TextEmail: {
                            rawValue: 0,
                            value: 'text',
                            title: tt('g.email'),
                            ref: 'email',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.email'),
                            }),
                            onChange: this.emailOnChange,
                            disabled: false,
                            state: 'email',
                        },
                        Password: {
                            rawValue: 1,
                            value: 'password',
                            title: tt('g.password'),
                            ref: 'password',
                            placeholder: tt('g.please_enter', {
                                data: tt('g.password'),
                            }),
                            onChange: this.passwordOnChange,
                            disabled: false,
                            password: 'password',
                        },
                        Button: {
                            rawValue: 2,
                            value: 'button',
                            title: tt('g.send'),
                            disabled: false,
                        },
                    });
            }
        };

        this.setState({ section: section() });
    }

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

    usernameOnChange = e => {
        const value = e.target.value;
        this.setState({
            username: e.target.value,
        });
    };

    phonenumberOnChange = e => {
        const value = e.target.value;
        this.setState({
            phonenumber: e.target.value,
        });
    };

    countrycodeOnChange = e => {
        this.setState({
            countrycode: e.target.value,
        });
    };

    countrycodeOnClick = e => {
        this.setState({
            countrycode: e.target.innerText.match(/\d+/g)[0],
        });
    };

    handleSubmit = e => {
        if (e) e.preventDefault();
        const {
            login,
            confirmForPrivateKey,
            confirmLoginForPrivateKey,
            confirmationDeletePassword,
            confirmForDelete,
            confirmationMail,
            confirmationCode,
            resendConfirmationMail,
            resendConfirmationCode,
            sendDeletePasswordConfirmationMail,
            confirmLoginForDelete,
        } = this.props;

        const {
            email,
            password,
            countrycode,
            phonenumber,
            username,
        } = this.state;

        switch (true) {
            case confirmForDelete:
                if (
                    email == '' ||
                    password == '' ||
                    typeof password == 'undefined' ||
                    typeof email == 'undefined'
                )
                    return;
                confirmLoginForDelete(email, password);
                break;
            case confirmationCode:
                if (
                    phonenumber == '' ||
                    countrycode == '' ||
                    typeof countrycode == 'undefined' ||
                    typeof phonenumber == 'undefined'
                )
                    return;
                resendConfirmationCode(countrycode, phonenumber);
                break;
            case confirmationMail:
                if (
                    email == '' ||
                    username == '' ||
                    typeof username == 'undefined' ||
                    typeof email == 'undefined'
                )
                    return;
                resendConfirmationMail(username, email);
                break;
            case confirmationDeletePassword:
                if (
                    email == '' ||
                    username == '' ||
                    typeof username == 'undefined' ||
                    typeof email == 'undefined'
                )
                    return;
                sendDeletePasswordConfirmationMail(username, email);
                break;
            case confirmLoginForPrivateKey:
            default:
                if (
                    email == '' ||
                    password == '' ||
                    typeof password == 'undefined' ||
                    typeof email == 'undefined'
                )
                    return;
                if (confirmForPrivateKey) {
                    confirmLoginForPrivateKey(email, password);
                    return;
                }
                login(email, password);
                break;
        }
    };

    onClickSignUp = e => {
        this.props.onCancel();
        browserHistory.push(signupRoute.path);
    };

    render() {
        const {
            passwordOnChange,
            emailOnChange,
            countrycodeOnChange,
            countrycodeOnClick,
            onCancel,
            handleSubmit,
            onClickSignUp,
            confirmationDeletePassword,
        } = this;

        const { section } = this.state;

        const titleText = (title = tt('g.confirm')) => (
            <h3 className="login-modal-list__title">
                <span className="login-modal-list__title">{title}</span>
            </h3>
        );

        const textInput = ({
            key,
            ref,
            title,
            placeholder,
            onChange,
            disabled,
            state,
        }) => (
            <div className="login-modal-list__username-input-group" key={key}>
                <div className="login-modal-list__username-input-group-label">
                    {title}
                </div>
                <input
                    className="login-modal-list__username-input-group-field"
                    type="text"
                    required
                    placeholder={placeholder}
                    ref={ref}
                    onChange={onChange}
                    autoComplete="on"
                    disabled={disabled}
                    value={this.state[state]}
                />
            </div>
        );

        const signupLink = (
            <div className="login-modal-list__sign-up">
                <SimpleButton
                    color="white"
                    active={true}
                    className="login-modal-list__sign-up-button hollow"
                    value={tt('g.return_to', { data: tt('g.signup') })}
                    onClick={onClickSignUp}
                />
            </div>
        );

        const submitButton = ({ key, title, disabled }) => (
            <div className="login-modal-list__login-modal-buttons" key={key}>
                <br />
                <GradationButton
                    submit={true}
                    disabled={disabled}
                    value={title}
                    color={'blue'}
                    active={true}
                />
            </div>
        );

        const phoneCodeDropDownItem = Object.keys(countryCode).map(
            (key, index) => (
                <DropDownItem
                    key={index}
                    onClick={countrycodeOnClick}
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
                    content={textInput({
                        key,
                        ...item,
                    })}
                >
                    <DropDownMenu query={this.state.countrycode}>
                        {phoneCodeDropDownItem}
                    </DropDownMenu>
                </DropDownContainer>
            </div>
        );

        const renderForm = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'text':
                        return textInput({
                            key: index,
                            ...item,
                        });
                    case 'dropdown':
                        return phoneCodeDropDown(item, index);
                    case 'password':
                        return (
                            <div
                                className="login-modal-list__password-input-group"
                                key={index}
                            >
                                <div className="login-modal-list__password-input-group-label">
                                    {tt('g.password')}
                                </div>
                                <input
                                    className="login-modal-list__password-input-group-field"
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
                        );
                    case 'button':
                        return submitButton({
                            key: index,
                            title: item.title,
                            disabled: item.disabled,
                        });
                    default:
                        break;
                }
            });

        const form = (
            <form onSubmit={handleSubmit} method="post">
                {renderForm(section)}
                {signupLink}
            </form>
        );

        const title =
            !this.props.confirmForPrivateKey &&
            !this.props.confirmForDelete &&
            !this.props.confirmationMail &&
            !this.props.confirmationCode &&
            !this.props.confirmationDeletePassword
                ? tt('g.login')
                : tt('g.confirm');

        const modalPath = () => {
            if (!process.env.BROWSER) return;
            const pathname = browserHistory.getCurrentLocation().pathname;
            if (confirmForDeleteRoute.isValidPath(pathname))
                return 'user/delete/confirm';
            if (confirmForPrivateKeyRoute.isValidPath(pathname))
                return 'privatekey/confirm';
        };

        return (
            <div className="login-modal-list">
                {!sendDeletePasswordConfirmationMailRoute.isValidPath(
                    browserHistory.getCurrentLocation().pathname
                ) && (
                    <OAuthButtons
                        isSession={false}
                        isModal={true}
                        modalPath={modalPath()}
                    />
                )}
                <div className="login-modal-list__titleText">
                    {titleText(title)}
                </div>
                <div className="login-modal-list__form">{form}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
            identity: sessionActions.getIdentity(state),
        };
    },

    dispatch => ({
        addError: error => {
            dispatch(appActions.addError({ error }));
        },
        login: (email, password) => {
            dispatch(authActions.login({ email, password }));
        },
        sendDeletePasswordConfirmationMail: (username, email) => {
            dispatch(
                sessionActions.sendDeletePasswordConfirmationMail({
                    email,
                    username,
                })
            );
        },
        resendConfirmationMail: (username, email) => {
            dispatch(
                sessionActions.resendConfirmationMail({ email, username })
            );
        },
        resendConfirmationCode: (countryCode, phoneNumber) => {
            dispatch(
                sessionActions.resendConfirmationCode({
                    countryCode,
                    phoneNumber,
                })
            );
        },
        confirmLoginForPrivateKey: (email, password) => {
            dispatch(
                authActions.confirmLoginForPrivateKey({ email, password })
            );
        },
        confirmLoginForDelete: (email, password) => {
            dispatch(authActions.confirmLoginForDelete({ email, password }));
        },
    })
)(LoginModalList);
