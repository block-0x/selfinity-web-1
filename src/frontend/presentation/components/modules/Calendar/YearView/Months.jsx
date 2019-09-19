import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TileGroup from '@modules/Calendar/TileGroup';
import Month from '@modules/Calendar/YearView/Month';

import { getYear } from '@modules/Calendar/shared/dates';
import { tileGroupProps } from '@modules/Calendar/shared/propTypes';

export default class Months extends PureComponent {
    start = 0;

    end = 11;

    get year() {
        const { activeStartDate } = this.props;
        return getYear(activeStartDate);
    }

    render() {
        return (
            <TileGroup
                {...this.props}
                className="react-calendar__year-view__months"
                dateTransform={monthIndex => new Date(this.year, monthIndex, 1)}
                dateType="month"
                end={this.end}
                start={this.start}
                tile={Month}
            />
        );
    }
}

Months.propTypes = {
    ...tileGroupProps,
    locale: PropTypes.string,
};
