import React from 'react';
import PropTypes from 'prop-types';
import AppPropTypes from '@extension/AppPropTypes';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '@redux/Auth/AuthReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import SimpleButton from '@elements/SimpleButton';
import tt from 'counterpart';

class OpinionAcceptButton extends React.Component {
    static propTypes = {
        repository: AppPropTypes.Content,
    };

    static defaultProps = {};

    state = {
        active: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'OpinionAcceptButton'
        );
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        const { repository } = this.props;
        this.setState({
            active:
                repository.isBetterOpinion == 1 ||
                repository.isBetterOpinion == true,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { repository } = nextProps;
        if (!repository) {
            this.setState({
                active: false,
            });
            return;
        }
        this.setState({
            active:
                repository.isBetterOpinion == 1 ||
                repository.isBetterOpinion == true,
        });
    }

    onClick(e) {
        const { repository, acceptOpinion, unacceptOpinion } = this.props;

        this.state.active
            ? unacceptOpinion(repository)
            : acceptOpinion(repository);

        this.setState({
            active: !this.state.active,
        });
    }

    render() {
        const { repository, current_user, isShowAcceptButton } = this.props;

        const { active } = this.state;

        return (
            <SimpleButton
                active={active}
                onClick={this.onClick}
                color={'blue'}
                src={'upvote'}
                value={
                    active
                        ? tt('g.unacception_good_opinion')
                        : tt('g.acception_good_opinion')
                }
            />
        );
    }
}

export default connect(
    (state, props) => {
        const repository = contentActions.bind(props.repository, state);
        return {
            current_user: authActions.getCurrentUser(state),
            isShowAcceptButton: contentActions.isShowAcceptButton(
                repository,
                state
            ),
        };
    },

    dispatch => ({
        acceptOpinion: content => {
            if (!content) return;
            dispatch(transactionActions.acceptOpinion({ content }));
        },
        unacceptOpinion: content => {
            if (!content) return;
            dispatch(transactionActions.unacceptOpinion({ content }));
        },
    })
)(OpinionAcceptButton);
