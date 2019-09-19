import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import StatsBar from '@modules/StatsBar';

class HomeLabelItem extends React.Component {
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
        return (
            <div className="home-label-item">
                <div className="home-label-item__text">
                    {repository.Label.title}
                </div>
                <div className="home-label-item__stats">
                    <StatsBar repository={repository} />
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
)(HomeLabelItem);
