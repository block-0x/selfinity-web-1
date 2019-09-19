import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import ope from '@extension/operator';
import HomeRow from '@elements/HomeRow';
import RequestRow from '@elements/RequestRow';
import HomeItem from '@elements/HomeItem';
import RequestItem from '@elements/RequestItem';
import AppPropTypes from '@extension/AppPropTypes';

class ReplyViewer extends React.Component {
    static propTypes = {
        repositories: PropTypes.arrayOf(
            PropTypes.oneOfType([AppPropTypes.Content, AppPropTypes.Request])
        ),
    };

    static defaultProps = {
        repositories: [],
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ReplyViewer');
    }

    render() {
        const { repositories } = this.props;

        const renderItem = items =>
            items.map((item, key) => (
                <div className="reply-viewer__item" key={key}>
                    {ope.isContent(item) ? (
                        <HomeItem repository={item} />
                    ) : (
                        <RequestItem repository={item} allowAnswer={false} />
                    )}
                </div>
            ));

        return (
            <div className="reply-viewer">
                {repositories.length > 0 && renderItem(repositories)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ReplyViewer);
