import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Icon from '@elements/Icon';
import Ripple from '@elements/Ripple';
import Responsible from '@modules/Responsible';
import classNames from 'classnames';

class CollectionItem extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        title: PropTypes.string,
        value: PropTypes.string,
        link: PropTypes.string,
        onClick: PropTypes.func,
        fill: PropTypes.bool,
        sizeS: PropTypes.bool,
        id: PropTypes.string,
    };

    static defaultProps = {
        src: '',
        id: '',
        title: '',
        value: '',
        fill: true,
        sizeS: false,
    };

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'CollectionItem'
        );
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if (e) e.preventDefault();
        const { link, onClick } = this.props;

        link && browserHistory.push(link);
        onClick && onClick(e);
    }

    render() {
        const { title, src, id, value, link, fill, sizeS } = this.props;

        return (
            <Ripple>
                <div className="collection-item__link" onClick={this.onClick}>
                    <div className="collection-item" id={id}>
                        <h2
                            className={classNames('collection-item__title', {
                                S: sizeS,
                            })}
                        >
                            {title}
                        </h2>
                        <Responsible
                            className={fill ? 'collection-item__image' : ''}
                            defaultContent={<Icon src={src} size={'7x'} />}
                            breakingContent={<Icon src={src} size={'4x'} />}
                            breakMd={true}
                        />
                        <h3
                            className={classNames('collection-item__body', {
                                S: sizeS,
                            })}
                        >
                            {value}
                        </h3>
                    </div>
                </div>
            </Ripple>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(CollectionItem);
