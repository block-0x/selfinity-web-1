import StatsBar from '@modules/StatsBar';
import React from 'react';

class LabelStashBar extends React.Component {
    render() {
        return (
            <StatsBar
                {...this.props}
                showUpvote={false}
                showDownvote={false}
                showPoint={true}
            />
        );
    }
}

export default LabelStashBar;
