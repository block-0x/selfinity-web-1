import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class CategoryItem extends React.Component {
    static propTypes = {
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { value } = this.props;
        return (
            <div className="category-item">
                <div className="category-item__string">{value}</div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },
    dispatch => ({})
)(CategoryItem);
