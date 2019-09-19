import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';

class WaveBackground extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'WaveBackground'
        );
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        const icon = (
            <svg
                id="レイヤー_1"
                data-name="レイヤー 1"
                viewBox="0 0 1000 141.73"
            >
                <defs>
                    <linearGradient
                        id="wave-background__gradation1"
                        y1="70.87"
                        x2="999.95"
                        y2="70.87"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#fff21f" />
                        <stop offset="0.04" stopColor="#facc22" />
                        <stop offset="0.08" stopColor="#f4a225" />
                        <stop offset="0.13" stopColor="#ef8027" />
                        <stop offset="0.18" stopColor="#eb6529" />
                        <stop offset="0.23" stopColor="#e8522b" />
                        <stop offset="0.28" stopColor="#e7472c" />
                        <stop offset="0.34" stopColor="#e6432c" />
                        <stop offset="0.58" stopColor="#f1942e" />
                        <stop offset="0.89" stopColor="#ea652d" />
                        <stop offset="1" stopColor="#fccd00" />
                        <stop offset="1" stopColor="#e5352b" />
                    </linearGradient>
                    <linearGradient
                        id="wave-background__gradation2"
                        y1="70.87"
                        x2="1000"
                        y2="70.87"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#fff21f" />
                        <stop offset="0.01" stopColor="#ffef1c" />
                        <stop offset="0.1" stopColor="#fddc0d" />
                        <stop offset="0.19" stopColor="#fcd103" />
                        <stop offset="0.28" stopColor="#fccd00" />
                        <stop offset="0.67" stopColor="#f1942e" />
                        <stop offset="0.89" stopColor="#ea652d" />
                        <stop offset="1" stopColor="#e5352b" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,0V88.65c25,5.81,46.2,12.8,67.11,19.68,49.83,16.42,101.36,33.4,202.61,33.4s152.79-17,202.62-33.4c50.21-16.54,102.14-33.65,204.38-33.65S830.88,91.79,881.1,108.33c33.82,11.15,68.43,22.55,118.85,28.73V0Z"
                    transform="translate(0)"
                    style={{
                        opacity: 0.49,
                        fill: 'url(#wave-background__gradation1)',
                    }}
                />
                <path
                    d="M0,.75V140.9c89.14-1.23,136.2-17.53,181.76-33.32C229.52,91,278.9,73.93,376.13,73.93S522.74,91,570.5,107.58C617.89,124,666.9,141,763.2,141s145.3-17,192.7-33.4c14.15-4.9,28.45-9.86,44.1-14.4V.75Z"
                    transform="translate(0)"
                    style={{
                        opacity: 0.75,
                        fill: 'url(#wave-background__gradation2)',
                    }}
                />
            </svg>
        );

        return <div className="wave-background">{icon}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(WaveBackground);
