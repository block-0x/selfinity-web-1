import { fromJS, Set, List, Map } from 'immutable';
import { call, put, select, fork, takeLatest, apply } from 'redux-saga/effects';
import * as sessionActions from '@redux/Session/SessionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import UseCaseImpl from '@usecase/UseCaseImpl';
import { browserHistory } from 'react-router';
import {
    SessionRepository,
    IdentityRepository,
    AuthRepository,
} from '@repository';
import models from '@network/client_models';
import { SIGNUP_STEP } from '@entity';
import oauth from '@network/oauth';
import tt from 'counterpart';

const sessionRepository = new SessionRepository();
const identityRepository = new IdentityRepository();
const authRepository = new AuthRepository();

export default class SessionUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *setUserStep({ payload: { accessToken, step } }) {
        try {
            const state = yield select(state => state);
            const localAccessToken =
                oauth.getAccessToken(localStorage) ||
                state.session.get('accessToken');
            let identity;
            if (
                accessToken &&
                accessToken != '' &&
                localAccessToken !== accessToken
            ) {
                yield put(
                    sessionActions.generateAccessToken({
                        accessToken,
                        isOneTime: true,
                    })
                );
                identity = yield sessionRepository.findOneIdentityRequest(
                    accessToken,
                    ''
                );
            } else if (!!accessToken || accessToken == '') {
                identity = yield sessionRepository.findOneIdentityRequest(
                    accessToken,
                    oauth.getClientId(localStorage) ||
                        state.session.get('client_id')
                );
            }
            if (!identity) return;
            yield put(
                sessionActions.setIdentity({
                    identity: Map({
                        id: identity.id,
                        username: identity.username,
                        username_booked_at: identity.username_booked_at,
                        email: identity.email,
                        email_is_verified: identity.email_is_verified,
                        last_attempt_verify_email:
                            identity.last_attempt_verify_email,
                        phoneNumber: identity.phoneNumber,
                        phoneNumberFormatted: identity.phoneNumberFormatted,
                        phone_number_is_verified:
                            identity.phone_number_is_verified,
                        last_attempt_verify_phone_number:
                            identity.last_attempt_verify_phone_number,
                        countryCode: null,
                        confirmation_code: identity.confirmation_code,
                        password_hash: identity.password_hash,
                        password: identity.password,
                        token: identity.token,
                        completed: false,
                        step: step,
                    }),
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *incrementStep() {
        const session = yield select(state => state.session);
        const steps = session.get('steps');
        const currentStep = yield select(sessionActions.getStep);
        let nextStep = steps.get(steps.indexOf(currentStep) + 1);
        try {
            // TODO: Update the user in the DB.
            switch (currentStep) {
                case SIGNUP_STEP.UserNameEmail.value:
                    var identity = session.get('identity');
                    identity = identity.toJS();
                    yield sessionRepository.sendConfirmEmail(
                        identity.email,
                        identity.username
                    );
                    break;
                case SIGNUP_STEP.Password.value:
                    var identity = session.get('identity');
                    identity = identity.toJS();
                    yield sessionRepository.setPassword(
                        identity.username,
                        identity.password
                    );
                    const data = yield authRepository.initAuth({
                        username: identity.username,
                        email: identity.email,
                    });
                    yield put(authActions.setCurrentUser(data.user));
                    break;
                case SIGNUP_STEP.PhoneNumber.value:
                    var identity = session.get('identity');
                    identity = identity.toJS();
                    yield sessionRepository.sendConfirmCode(
                        identity.phoneNumber,
                        identity.countryCode,
                        identity.username
                    );
                    break;
                case SIGNUP_STEP.ConfirmPhoneNumber.value:
                    var identity = session.get('identity');
                    identity = identity.toJS();
                    const result = yield sessionRepository.confirmCode(
                        identity.confirmation_code,
                        identity.username
                    );
                    if (!result) return;
                    break;
                default:
                    break;
            }

            yield put(sessionActions.setStep(nextStep));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
            nextStep = currentStep;
        }
        yield put(authActions.syncCurrentUser());
    }

    *decrementStep() {
        const steps = yield select(sessionActions.getSteps);
        const currentStep = yield select(sessionActions.getStep);
        const nextStep = steps.get(steps.indexOf(currentStep) - 1);
        try {
            yield put(sessionActions.setStep(nextStep));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *sendDeletePasswordConfirmEmail({ payload: { username, email } }) {
        try {
            const session = yield select(state => state.session);
            var identity = session.get('identity');
            identity = identity.toJS();
            yield sessionRepository.sendDeletePasswordConfirmEmail(
                email,
                username
            );
            yield put(
                sessionActions.hideSendDeletePasswordConfirmationMailModal()
            );
            yield put(
                appActions.addSuccess({ success: tt('g.mail_reset_password') })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *sendConfirmEmail() {
        try {
            const session = yield select(state => state.session);
            var identity = session.get('identity');
            identity = identity.toJS();
            yield sessionRepository.sendConfirmEmail(
                identity.email,
                identity.username
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *resendConfirmationMail({ payload: { username, email } }) {
        try {
            const session = yield select(state => state.session);
            var identity = session.get('identity');
            identity = identity.toJS();
            yield sessionRepository.resendConfirmEmail(email, username);
            yield put(sessionActions.hideResendConfirmationMailModal());
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *resendConfirmationCode({ payload: { phoneNumber, countryCode } }) {
        try {
            const session = yield select(state => state.session);
            var identity = session.get('identity');
            identity = identity.toJS();
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const username = current_user
                ? current_user.username
                : identity.username;
            yield sessionRepository.resendConfirmCode(
                phoneNumber,
                countryCode,
                username
            );
            yield put(sessionActions.hideResendConfirmationCodeModal());
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *generateAccessToken({ payload: { accessToken, isOneTime = true } }) {
        try {
            const state = yield select(state => state);
            const result = yield sessionRepository.generateAccessToken(
                accessToken,
                oauth.getClientId(localStorage) ||
                    state.session.get('client_id'),
                isOneTime
            );
            oauth.saveAccessToken(localStorage, result);
            yield sessionActions.setAccessToken({ accessToken: result });
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *checkUserName({ payload: username }) {
        const isValid = sessionRepository.checkUserName(username);
    }

    *checkEmail({ payload: email }) {
        const isValid = sessionRepository.checkEmail(email);
    }

    *checkPhoneNumber({ payload: phoneNumber }) {
        const isValid = sessionRepository.checkPhoneNumber(phoneNumber);
        const isTrue = sessionRepository.validatePhone(phoneNumber);
    }

    *guessCountryCode() {
        return 81;
    }
}
