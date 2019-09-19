import React, { PureComponent } from 'react';

import TileGroup from '@modules/Calendar/TileGroup';
import Year from '@modules/Calendar/DecadeView/Year';

import { getBeginOfDecadeYear } from '@modules/Calendar/shared/dates';
import { tileGroupProps } from '@modules/Calendar/shared/propTypes';

export default class Years extends PureComponent {
    get start() {
        const { activeStartDate } = this.props;
        return getBeginOfDecadeYear(activeStartDate);
    }

    get end() {
        return this.start + 9;
    }

    render() {
        return (
            <TileGroup
                {...this.props}
                className="react-calendar__decade-view__years"
                dateTransform={year => new Date(year, 0, 1)}
                dateType="year"
                end={this.end}
                start={this.start}
                tile={Year}
            />
        );
    }
}

Years.propTypes = {
    ...tileGroupProps,
};
