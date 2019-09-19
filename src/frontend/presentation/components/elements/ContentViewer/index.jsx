import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ExhumeHtml } from '@network/html';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import LoadingIndicator from '@elements/LoadingIndicator';
import classNames from 'classnames';

class ContentViewer extends React.Component {
    static propTypes = {
        body: PropTypes.string,
        loading: PropTypes.bool,
        small: PropTypes.bool,
        isQuote: PropTypes.bool,
    };

    static defaultProps = {
        body: '',
        loading: false,
        small: false,
        isQuote: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ContentViewer'
        );
    }

    componentWillMount() {
        this.setState({
            mounted: false,
        });
    }

    componentDidMount() {
        this.setState({
            mounted: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mounted: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        this.setState({
            mounted: true,
        });
    }

    render() {
        const { body, loading, small, isQuote } = this.props;
        const { mounted } = this.state;
        if (loading || !mounted || body == '')
            return (
                <LoadingIndicator
                    type={'circle'}
                    style={{ marginLeft: '49%', marginRight: '49%' }}
                />
            );
        const sentences = ExhumeHtml(body, true);
        return (
            <div
                className={classNames('content-viewer', {
                    small,
                    grey: isQuote,
                })}
            >
                {sentences}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ContentViewer);
