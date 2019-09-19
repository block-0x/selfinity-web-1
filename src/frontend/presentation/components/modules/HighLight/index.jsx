import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ConditinalItem from '@modules/ConditionalItem';
import Img from 'react-image';
import tt from 'counterpart';

class HighLight extends React.Component {
    static propTypes = {
        repositories: PropTypes.array,
    };

    static defaultProps = {
        repositories: [],
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    render() {
        let { repositories } = this.props;

        if (repositories.length < 1) {
            return <div />;
        } else if (repositories.length > 2) {
            repositories = [repositories[0], repositories[1]];
        }

        const image_url = '/images/sample.jpg';
        return (
            <div className="high-light">
                <div className="high-light__background">
                    <Img
                        className="high-light__background-image"
                        style={{ backgroundImage: `url(${image_url})` }}
                        alt={tt('alts.default')}
                    />
                    <div className="high-light__background-image-cover" />
                </div>
                <div className="high-light__title">HighLight</div>
                <div className="high-light__items">
                    <div className="high-light__item">
                        <ConditinalItem repository={repositories[0]} />
                    </div>
                    <div className="high-light__item">
                        <ConditinalItem repository={repositories[1]} />
                    </div>
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
)(HighLight);
