import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ConditionalHeader from '@modules/ConditionalHeader';
import BlurBackground from '@elements/BlurBackground';
import ope from '@extension/operator';
import WaveHeader from '@elements/WaveHeader';

class ConditionalDetailHeader extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: null,
    };

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { repository } = this.props;

        if (!repository) return <div />;

        return (
            <div className="conditional-detail-header">
                <WaveHeader />
                <div
                    className={
                        ope.isRequest(repository)
                            ? 'conditional-detail-header__content'
                            : 'conditional-detail-header__item'
                    }
                >
                    <ConditionalHeader repository={repository} />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ConditionalDetailHeader);
