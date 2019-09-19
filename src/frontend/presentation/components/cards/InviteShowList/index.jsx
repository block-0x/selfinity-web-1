import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as userActions from '@redux/User/UserReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import CopyText from '@elements/CopyText';
import tt from 'counterpart';
import BorderInputRow from '@modules/BorderInputRow';
import GradationButton from '@elements/GradationButton';
import data_config from '@constants/data_config';

class InviteShowList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        invited_code: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'InviteShowList'
        );
        this.onChangeInvitedCode = this.onChangeInvitedCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChangeInvitedCode(e) {
        if (e) e.preventDefault();
        this.setState({
            invited_code: e.target.value,
        });
    }

    handleSubmit(e) {
        if (e) e.preventDefault();
        const { invited_code } = this.state;
        const { current_user, invite } = this.props;

        if (!current_user || !invited_code) return;

        invite && invite(invited_code);
    }

    render() {
        const { current_user } = this.props;

        const { invited_code } = this.state;

        return (
            <div className="invite-show-list">
                <div className="invite-show-list__code">
                    <div className="invite-show-list__code-title">
                        {tt('g.invite_code')}
                    </div>
                    <div className="invite-show-list__code-value">
                        <CopyText value={current_user.invite_code} />
                    </div>
                </div>
                <div className="invite-show-list__text">
                    {tt('g.invite_desc', {
                        date: data_config.invite_valid_interval,
                    })}
                </div>
                <div className="invite-show-list__form">
                    <form onSubmit={this.handleSubmit}>
                        <div className="invite-show-list__form-item">
                            <BorderInputRow
                                value={invited_code}
                                onChange={this.onChangeInvitedCode}
                                title={tt('g.invited_code')}
                                ref={'invited_code'}
                                placeholder={tt('g.please_enter', {
                                    data: tt('g.invited_code'),
                                })}
                            />
                        </div>
                        <div className="invite-show-list__form-text">
                            {tt('g.invite_code_desc', {
                                date: data_config.invite_valid_interval,
                            })}
                        </div>
                        <div className="invite-show-list__form-button">
                            <GradationButton
                                submit={true}
                                value={tt('g.submit')}
                                color={'blue'}
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            current_user: authActions.getCurrentUser(state),
        };
    },

    dispatch => ({
        invite: invite_code => {
            dispatch(userActions.invite({ invite_code }));
        },
    })
)(InviteShowList);
