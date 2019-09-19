import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import RenderImpl from '@modules/Render';
import models from '@network/client_models';
import ConditionalDetailHeader from '@modules/ConditionalDetailHeader';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class RenderDetail extends React.Component {
    static propTypes = {
        repository: PropTypes.object,
    };

    static defaultProps = {
        repository: null,
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { repository } = this.props;
        const n = nextProps;
        return (
            repository !== n.repository //||
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { repository, loadMore, loading, ...inputProps } = this.props;

        const renderingItem = items =>
            items.map((item, index) => (
                <RenderImpl
                    key={index}
                    keyIndex={index}
                    repository={item}
                    loadMore={loadMore}
                    count={index}
                />
            ));

        const header = model => (
            <div className="render-detail__header">
                <ConditionalDetailHeader repository={model.content} />
            </div>
        );

        return (
            <div className="render-detail">
                {repository && header(repository)}
                {repository.items.length > 0 && renderingItem(repository.items)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(RenderDetail);
