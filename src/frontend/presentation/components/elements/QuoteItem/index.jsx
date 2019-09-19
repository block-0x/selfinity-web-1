import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as contentActions from '@redux/Content/ContentReducer';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Ripple from '@elements/Ripple';
import Icon from '@elements/Icon';
import ContentViewer from '@elements/ContentViewer';

class QuoteItem extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        isHTML: PropTypes.bool,
    };

    static defaultProps = {
        text: '',
        isHTML: false,
    };

    state = {
        isShow: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'QuoteItem');
        this.toggleShow = this.toggleShow.bind(this);
        this.getItemSize = this.getItemSize.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        this.handleResize();
        if (process.env.BROWSER)
            window.addEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.addEventListener('click', this.handleResize);
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.handleResize);
        if (process.env.BROWSER)
            window.removeEventListener('click', this.handleResize);
    }

    toggleShow(e) {
        if (e) e.stopPropagation();
        const { isShow } = this.state;

        this.setState({ isShow: !isShow });
        this.handleResize();
    }

    getItemSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByClassName('quote-item__text')[0],
            w = w.innerWidth || e.clientWidth || g.clientWidth,
            h = w.innerHeight || e.clientHeight || g.clientHeight;
        return {
            width: w,
            height: h,
        };
    }

    handleResize() {
        var size = this.getItemSize();
        this.setState({
            height: size.height,
            width: size.width,
        });
    }

    render() {
        let { text, isHTML } = this.props;

        const { isShow, height, width } = this.state;

        if (!text) return <div />;
        if (text == '') return <div />;

        if (!isShow) {
            text = isHTML
                ? ''.cleaning_tag(text).slice(0, 30)
                : text.slice(0, 30);
            text += '...';
        }

        return (
            <div className="quote-item">
                <div className="quote-item__text">
                    <div className="quote-item__text-raw">
                        {isHTML ? (
                            <ContentViewer
                                body={text}
                                small={true}
                                isQuote={true}
                            />
                        ) : (
                            ''.cleaning_tag(text)
                        )}
                    </div>
                </div>
                <div className="quote-item__more" onClick={this.toggleShow}>
                    <Icon
                        className="quote-item__more-raw"
                        src={'more'}
                        size={'2x'}
                    />
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
)(QuoteItem);
