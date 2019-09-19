import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class BlurBackground extends React.Component {
    static propTypes = {
        color: PropTypes.string,
        image: PropTypes.string,
    };

    static defaultProps = {
        color: '#13B4FC',
        image: '/images/sample.jpg',
    };

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const { color, image } = this.props;

        const color_style = {
            background: color,
        };
        return (
            <div className="blur-background">
                <img className="blur-background__image" src={image} />
                <div
                    className="blur-background__image-cover"
                    style={color_style}
                />
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(BlurBackground);
