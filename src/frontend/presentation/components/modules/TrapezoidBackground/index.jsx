import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '@elements/Icon';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import classNames from 'classnames';
import { COLOR } from '@entity/Color';

class TrapezoidBackground extends React.Component {
    static propTypes = {
        styleA: PropTypes.object,
        styleB: PropTypes.object,
        styleC: PropTypes.object,
        styleD: PropTypes.object,
        sub_color: PropTypes.string,
        children: PropTypes.node,
        height: PropTypes.number,
        boxWidth: PropTypes.number,
        boxHeight: PropTypes.number,
    };

    static defaultProps = {
        styleA: { fill: '#F57C00' },
        styleB: { fill: '#FFCA28' },
        styleC: { fill: '#FF8A65' },
        styleD: { fill: '#FFA000' },
        height: 0,
        width: 0,
    };

    static baseHeight = 3454;
    static baseWidth = 1440;

    state = {};

    static trapezoid_names = ['trapezoid-top', 'trapezoid', 'trapezoid-bottom'];

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TrapezoidBackground'
        );
    }

    render() {
        let {
            styleA,
            styleB,
            styleC,
            styleD,
            children,
            height,
            width,
            boxWidth,
            boxHeight,
        } = this.props;

        // const dived = Math.floor(height / TrapezoidBackground.baseHeight);
        // if (dived > 0) {
        //     // height += (dived * 10) - 20;
        //     // boxHeight += (dived * 10) - 20;
        // }

        //default 1440 3454
        const icon = key => (
            <svg
                key={key}
                width={width + 'px'}
                height={height % TrapezoidBackground.baseHeight + 'px'}
                viewBox={`0 0 ${width} ${height %
                    TrapezoidBackground.baseHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginTop: key > 0 ? '-5px' : '0px' }}
            >
                <defs>
                    <pattern
                        id="TrapezoidBackground"
                        x="0"
                        y="0"
                        width={boxWidth || 1440}
                        height={
                            boxHeight % TrapezoidBackground.baseHeight || 3454
                        }
                        patternUnits="userSpaceOnUse"
                    >
                        <path style={styleA} d="M1440 2139H0v1315h1440z" />
                        <path
                            style={styleB}
                            d="M0 2707.578V1143h1440v1143.498z"
                        />
                        <path
                            style={styleC}
                            d="M1440 2011.976L0 1402.131V0h1440z"
                        />
                        <path
                            style={styleD}
                            d="M1440 76.88L0 544.776V-829h1440V76.88z"
                        />
                    </pattern>
                </defs>
                <rect
                    width={width + 'px'}
                    height={height % TrapezoidBackground.baseHeight + 'px'}
                    fill="url(#TrapezoidBackground)"
                />
            </svg>
        );

        const mIcon = key => (
            <svg
                key={key}
                width={width + 'px'}
                height={TrapezoidBackground.baseHeight + 'px'}
                viewBox={`0 0 ${width} ${TrapezoidBackground.baseHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginTop: key > 0 ? '-5px' : '0px' }}
            >
                <defs>
                    <pattern
                        id="TrapezoidBackground"
                        x="0"
                        y="0"
                        width={boxWidth || 1440}
                        height={TrapezoidBackground.baseHeight}
                        patternUnits="userSpaceOnUse"
                    >
                        <path style={styleA} d="M1440 2139H0v1315h1440z" />
                        <path
                            style={styleB}
                            d="M0 2707.578V1143h1440v1143.498z"
                        />
                        <path
                            style={styleC}
                            d="M1440 2011.976L0 1402.131V0h1440z"
                        />
                        <path
                            style={styleD}
                            d="M1440 76.88L0 544.776V-829h1440V76.88z"
                        />
                    </pattern>
                </defs>
                <rect
                    width={width + 'px'}
                    height={TrapezoidBackground.baseHeight + 'px'}
                    fill="url(#TrapezoidBackground)"
                />
            </svg>
        );

        const renderIcon = () => {
            const divided = Math.floor(height / TrapezoidBackground.baseHeight);
            if (divided == 0) return icon(0);
            return [...Array(divided + 1).keys()].map(
                (i, key) => (key == divided ? icon(key) : mIcon(key))
            );
        };

        return <div className="trapezoid-background">{renderIcon()}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(TrapezoidBackground);
