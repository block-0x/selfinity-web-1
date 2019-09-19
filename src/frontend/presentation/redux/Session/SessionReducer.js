import { Map, List } from 'immutable';
import SIGNUP_STEP from '@entity/SignupStep';
import models from '@network/client_models';
import {
    loginRoute,
    resendConfirmationMailRoute,
    resendConfirmationCodeRoute,
    sendDeletePasswordConfirmationMailRoute,
} from '@infrastructure/RouteInitialize';
import uuidv4 from 'uuid/v4';

export const SET_ACCESS_TOKEN = 'session/SET_ACCESS_TOKEN';
export const REMOVE_ACCESS_TOKEN = 'session/REMOVE_ACCESS_TOKEN';
export const SET_CLIENT_ID = 'session/SET_CLIENT_ID';
export const REMOVE_CLIENT_ID = 'session/REMOVE_CLIENT_ID';
export const GUESS_COUNTRY_CODE = 'session/GUESS_COUNTRY_CODE';
export const SET_COUNTRY_CODE = 'session/SET_COUNTRY_CODE';
export const INCREMENT_STEP = 'session/INCREMENT_STEP';
export const DECREMENT_STEP = 'session/DECREMENT_STEP';
export const SET_STEP = 'session/SET_STEP';
export const SET_USERNAME = 'session/SET_USERNAME';
export const SET_EMAIL = 'session/SET_EMAIL';
export const SET_PHONE = 'session/SET_PHONE';
export const CLEAR_ERRORS = 'session/CLEAR_ERRORS';
export const SET_USERNAME_ERROR = 'session/SET_USERNAME_ERROR';
export const SET_EMAIL_ERROR = 'session/SET_EMAIL_ERROR';
export const SET_PASSWORD = 'session/SET_PASSWORD';
export const SET_PHONE_ERROR = 'session/SET_PHONE_ERROR';
export const SET_PHONE_FORMATTED = 'session/SET_PHONE_FORMATTED';
export const SET_TOKEN = 'session/SET_TOKEN';
export const GENERATE_ACCESS_TOKEN = 'session/GENERATE_ACCESS_TOKEN';
export const SET_PREFIX = 'session/SET_PREFIX';
export const SET_COMPLETED = 'session/SET_COMPLETED';
//export const SET_TRACKING_ID = 'session/SET_TRACKING_ID';
export const SHOW_SIGN_UP = 'session/SHOW_SIGN_UP';
export const HIDE_SIGN_UP = 'session/HIDE_SIGN_UP';
export const SET_USER_STEP = 'session/SET_USER_STEP';
export const SET_IDENTITY = 'session/SET_IDENTITY';
export const SET_CONFIRMATION_CODE = 'session/SET_CONFIRMATION_CODE';
export const RESEND_CONFIRMATION_CODE = 'session/RESEND_CONFIRMATION_CODE';
export const RESEND_CONFIRMATION_MAIL = 'session/RESEND_CONFIRMATION_MAIL';
export const SEND_DELETE_PASSWORD_CONFIRMATION_MAIL =
    'session/SEND_DELETE_PASSWORD_CONFIRMATION_MAIL';
export const SHOW_RESEND_CONFIRMATION_CODE_MODAL =
    'session/SHOW_RESEND_CONFIRMATION_CODE_MODAL';
export const SHOW_RESEND_CONFIRMATION_MAIL_MODAL =
    'session/SHOW_RESEND_CONFIRMATION_MAIL_MODAL';
export const HIDE_RESEND_CONFIRMATION_CODE_MODAL =
    'session/HIDE_RESEND_CONFIRMATION_CODE_MODAL';
export const HIDE_RESEND_CONFIRMATION_MAIL_MODAL =
    'session/HIDE_RESEND_CONFIRMATION_MAIL_MODAL';
export const SHOW_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL =
    'session/SHOW_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL';
export const HIDE_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL =
    'session/HIDE_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL';

const defaultState = Map({
    steps: List([
        SIGNUP_STEP.Options.value,
        SIGNUP_STEP.UserNameEmail.value,
        SIGNUP_STEP.CheckYourEmail.value,
        SIGNUP_STEP.Password.value,
        /*SIGNUP_STEP.MiddlePoint.value,*/
        SIGNUP_STEP.PhoneNumber.value,
        SIGNUP_STEP.ConfirmPhoneNumber.value,
        SIGNUP_STEP.Finish.value,
    ]),
    accessToken: '',
    client_id: uuidv4(),
    show_signup_modal: false,
    identity: Map({
        username: '',
        username_booked_at: new Date(),
        email: '',
        email_is_verified: false,
        last_attempt_verify_email: new Date(),
        phoneNumber: '',
        phoneNumberFormatted: '',
        phone_number_is_verified: false,
        last_attempt_verify_phone_number: new Date(),
        countryCode: null,
        confirmation_code: '',
        password_hash: '',
        password: '',
        token: '',
        completed: false,
        step: SIGNUP_STEP.UserNameEmail.value, //'signupOptions' is for SNS OAuth.
    }),
    errors: Map({
        username_error: null,
        email_error: null,
        phoneNumber_error: null,
    }),
    show_resend_confirmation_mail_modal: false,
    show_resend_confirmation_code_modal: false,
    show_send_delete_password_confirmation_mail_modal: false,
});

export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.merge({
                show_resend_confirmation_code_modal: resendConfirmationCodeRoute.isValidPath(
                    action.payload.pathname
                ),
                show_resend_confirmation_mail_modal: resendConfirmationMailRoute.isValidPath(
                    action.payload.pathname
                ),
                show_send_delete_password_confirmation_mail_modal: sendDeletePasswordConfirmationMailRoute.isValidPath(
                    action.payload.pathname
                ),
            });

        case SET_ACCESS_TOKEN:
            return state.set('accessToken', action.payload.accessToken);
        case REMOVE_ACCESS_TOKEN:
            return state.set('accessToken', '');
        case SET_CLIENT_ID:
            return state.set('client_id', action.payload.client_id);
        case REMOVE_CLIENT_ID:
            return state.set('client_id', '');
        case SET_IDENTITY:
            return state.set('identity', action.payload.identity);
        case SET_USER_STEP:
            return state;
        case GUESS_COUNTRY_CODE:
            return state;
        case SET_COUNTRY_CODE:
            return state.setIn(
                ['identity', 'countryCode'],
                action.payload.countryCode
            );
        case INCREMENT_STEP:
            return state;
        case DECREMENT_STEP:
            return state;
        case SET_USERNAME:
            return state.setIn(
                ['identity', 'username'],
                action.payload.username
            );
        case SET_EMAIL:
            return state.setIn(['identity', 'email'], action.payload.email);

        case SHOW_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL: {
            return state.merge({
                show_send_delete_password_confirmation_mail_modal: true,
            });
        }

        case HIDE_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL:
            return state.merge({
                show_send_delete_password_confirmation_mail_modal: false,
            });

        case SHOW_RESEND_CONFIRMATION_MAIL_MODAL: {
            return state.merge({
                show_resend_confirmation_mail_modal: true,
            });
        }

        case HIDE_RESEND_CONFIRMATION_MAIL_MODAL:
            return state.merge({
                show_resend_confirmation_mail_modal: false,
            });

        case SHOW_RESEND_CONFIRMATION_CODE_MODAL: {
            return state.merge({
                show_resend_confirmation_code_modal: true,
            });
        }

        case HIDE_RESEND_CONFIRMATION_CODE_MODAL:
            return state.merge({
                show_resend_confirmation_code_modal: false,
            });

        case SET_PASSWORD:
            return state.setIn(
                ['identity', 'password'],
                action.payload.password
            );
        case SET_PHONE:
            return state.setIn(
                ['identity', 'phoneNumber'],
                action.payload.phone
            );

        case CLEAR_ERRORS:
            return state.set(
                'errors',
                Map({
                    username_error: null,
                    email_error: null,
                    phoneNumber_error: null,
                })
            );

        case SET_USERNAME_ERROR:
            return state.setIn(
                ['errors', 'username_error'],
                action.payload.username_error
            );
        case SET_EMAIL_ERROR:
            return state.setIn(
                ['errors', 'email_error'],
                action.payload.email_error
            );
        case SET_PHONE_ERROR:
            return state.setIn(
                ['errors', 'phoneNumber_error'],
                action.payload.phoneNumber_error
            );
        case SET_PHONE_FORMATTED:
            return state.setIn(
                ['identity', 'phoneNumberFormatted'],
                action.payload.phoneNumberFormatted
            );
        case SET_TOKEN:
            return state.setIn(['identity', 'token'], action.payload.token);
        case SET_STEP:
            return state.setIn(['identity', 'step'], action.payload.step);
        case SET_PREFIX:
            return state.setIn(['identity', 'prefix'], action.payload.prefix);
        case SET_COMPLETED:
            return state.setIn(
                ['identity', 'completed'],
                action.payload.completed
            );
        case SET_CONFIRMATION_CODE:
            return state.setIn(
                ['identity', 'confirmation_code'],
                action.payload.confirmation_code
            );
        // case SET_TRACKING_ID:
        //     return state.set('trackingId', action.payload.trackingId);
        case SHOW_SIGN_UP:
            return state.set('show_signup_modal', true);
        case HIDE_SIGN_UP:
            return state.set('show_signup_modal', false);
        default:
            return state;
    }
}

export const setAccessToken = payload => ({
    type: SET_ACCESS_TOKEN,
    payload,
});

export const removeAccessToken = payload => ({
    type: REMOVE_ACCESS_TOKEN,
    payload,
});

export const setClientId = payload => ({
    type: SET_ACCESS_TOKEN,
    payload,
});

export const removeClientId = payload => ({
    type: REMOVE_CLIENT_ID,
    payload,
});

export const setIdentity = payload => ({
    type: SET_IDENTITY,
    payload,
});

export const setConfirmationCode = confirmation_code => ({
    type: SET_CONFIRMATION_CODE,
    payload: { confirmation_code },
});

export const resendConfirmationCode = payload => ({
    type: RESEND_CONFIRMATION_CODE,
    payload,
});

export const resendConfirmationMail = payload => ({
    type: RESEND_CONFIRMATION_MAIL,
    payload,
});

export const sendDeletePasswordConfirmationMail = payload => ({
    type: SEND_DELETE_PASSWORD_CONFIRMATION_MAIL,
    payload,
});

export const setUserStep = payload => ({
    type: SET_USER_STEP,
    payload,
});

export const showSignUp = payload => ({
    type: SHOW_SIGN_UP,
    payload,
});

export const hideSignUp = payload => ({
    type: HIDE_SIGN_UP,
    payload,
});

export const showSendDeletePasswordConfirmationMailModal = payload => ({
    type: SHOW_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL,
    payload,
});

export const hideSendDeletePasswordConfirmationMailModal = payload => ({
    type: HIDE_SEND_DELETE_PASSWORD_CONFIRMATION_MAIL_MODAL,
    payload,
});

export const showResendConfirmationCodeModal = payload => ({
    type: SHOW_RESEND_CONFIRMATION_CODE_MODAL,
    payload,
});

export const hideResendConfirmationCodeModal = payload => ({
    type: HIDE_RESEND_CONFIRMATION_CODE_MODAL,
    payload,
});

export const showResendConfirmationMailModal = payload => ({
    type: SHOW_RESEND_CONFIRMATION_MAIL_MODAL,
    payload,
});

export const hideResendConfirmationMailModal = payload => ({
    type: HIDE_RESEND_CONFIRMATION_MAIL_MODAL,
    payload,
});

export const guessCountryCode = () => ({
    type: GUESS_COUNTRY_CODE,
});

export const setCountryCode = countryCode => ({
    type: SET_COUNTRY_CODE,
    payload: { countryCode },
});

export const incrementStep = () => ({
    type: INCREMENT_STEP,
});

export const decrementStep = () => ({
    type: DECREMENT_STEP,
});

export const setStep = step => ({
    type: SET_STEP,
    payload: { step },
});

export const clearErrors = () => ({
    type: CLEAR_ERRORS,
});

export const setUsername = username => ({
    type: SET_USERNAME,
    payload: { username },
});

export const setEmail = email => ({
    type: SET_EMAIL,
    payload: { email },
});

export const setPassword = payload => ({
    type: SET_PASSWORD,
    payload,
});

export const setPhone = phone => ({
    type: SET_PHONE,
    payload: { phone },
});

export const setUsernameError = username_error => ({
    type: SET_USERNAME_ERROR,
    payload: { username_error },
});

export const setEmailError = email_error => ({
    type: SET_EMAIL_ERROR,
    payload: { email_error },
});

export const setPhoneError = phoneNumber_error => ({
    type: SET_PHONE_ERROR,
    payload: { phoneNumber_error },
});

export const setPhoneFormatted = phoneNumberFormatted => ({
    type: SET_PHONE_FORMATTED,
    payload: { phoneNumberFormatted },
});

export const setToken = token => ({
    type: SET_TOKEN,
    payload: { token },
});

export const generateAccessToken = payload => ({
    type: GENERATE_ACCESS_TOKEN,
    payload,
});

export const setPrefix = prefix => ({
    type: SET_PREFIX,
    payload: { prefix },
});

export const setCompleted = completed => ({
    type: SET_COMPLETED,
    payload: { completed },
});

// export const setTrackingId = trackingId => ({
//     type: SET_TRACKING_ID,
//     payload: { trackingId },
// });

// Selectors
export const getStep = state => state.session.getIn(['identity', 'step']);
export const getSteps = state => state.session.get('steps');
//export const getTrackingId = state => state.session.get('trackingId');

export const getIdentity = state => {
    const val = state.session.get('identity');
    return !!val ? val.toJS() : null;
};
