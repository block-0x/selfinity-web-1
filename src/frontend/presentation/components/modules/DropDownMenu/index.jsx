import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import DropDownItem from '@elements/DropDownItem';

class DropDownMenu extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        query: PropTypes.string,
    };

    static defaultProps = {
        query: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'DropDownMenu'
        );
    }

    render() {
        const { children, query } = this.props;

        return (
            <div className="drop-down-menu">
                {React.Children.map(children, child => {
                    const {
                        children: itemChildren,
                        ...otherProps
                    } = child.props;
                    if (
                        !query ||
                        query == '' ||
                        child.props.query
                            .toLowerCase()
                            .includes(query.toLowerCase())
                    )
                        return (
                            <DropDownItem
                                key={child.key}
                                {...otherProps}
                                itemKey={child.key}
                                onClick={child.props.onClick}
                            >
                                {child.props.children}
                            </DropDownItem>
                        );
                })}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(DropDownMenu);
