import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import SimpleButton from '@elements/SimpleButton';
import models from '@network/client_models';
import { NOTFOUND_TYPE } from '@entity';

class NotFoundItem extends React.Component {
    static propTypes = {
        section: PropTypes.object,
    };

    static defaultProps = {
        section: NOTFOUND_TYPE,
    };

    render() {
        const { section } = this.props;

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case 'title':
                        return (
                            <div className="not-found-item__title" key={index}>
                                {'Not Found!'}
                            </div>
                        );
                    case 'border':
                        return (
                            <div
                                className="not-found-item__border"
                                key={index}
                            />
                        );
                    case 'body':
                        return (
                            <div className="not-found-item__body" key={index}>
                                {'まだコンテンツがありません'}
                            </div>
                        );
                    case 'content_new':
                        return (
                            <div className="not-found-item__button" key={index}>
                                <SimpleButton value="＋ 投稿する" />
                            </div>
                        );
                    default:
                        return <div key={index} />;
                }
            });
        return <div className="not-found-item">{renderItem(section)}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(NotFoundItem);
