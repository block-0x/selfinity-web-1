import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import TutorialItem from '@elements/TutorialItem';

class TutorialMenu extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {};

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'TutorialMenu'
        );
    }

    render() {
        return (
            <div className="tutorial-menu">
                {React.Children.map(children, child => {
                    const {
                        children: itemChildren,
                        ...otherProps
                    } = child.props;
                    return (
                        <TutorialItemItem
                            key={child.key}
                            {...otherProps}
                            itemKey={child.key}
                        >
                            {child.props.children}
                        </TutorialItemItem>
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
)(TutorialMenu);
