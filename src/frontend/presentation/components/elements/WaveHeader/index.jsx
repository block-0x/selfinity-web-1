import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import Responsible from '@modules/Responsible';
import Img from 'react-image';
import tt from 'counterpart';

class WaveHeade extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'WaveHeade');
    }

    render() {
        return (
            <div className="wave-header">
                <Responsible
                    defaultContent={
                        <Img
                            className="wave-header__image"
                            src="/images/wave-header.png"
                            alt={tt('alts.default')}
                        />
                    }
                    breakingContent={
                        <Img
                            className="wave-header__image"
                            src="/images/mini-wave-header.png"
                            alt={tt('alts.default')}
                        />
                    }
                    breakFm={true}
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
)(WaveHeade);
