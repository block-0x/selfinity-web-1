import React from 'react';
import PropTypes from 'prop-types';

import Tile from '@modules/Calendar/Tile';

import {
    getBeginOfDay,
    getDay,
    getEndOfDay,
    isWeekend,
} from '@modules/Calendar/shared/dates';
import { formatLongDate } from '@modules/Calendar/shared/dateFormatter';
import { tileProps } from '@modules/Calendar/shared/propTypes';

const className = 'react-calendar__month-view__days__day';

const Day = ({
    calendarType,
    classes,
    currentMonthIndex,
    date,
    ...otherProps
}) => (
    <Tile
        {...otherProps}
        classes={[
            ...classes,
            className,
            isWeekend(date, calendarType) ? `${className}--weekend` : null,
            date.getMonth() !== currentMonthIndex
                ? `${className}--neighboringMonth`
                : null,
        ]}
        date={date}
        formatAbbr={formatLongDate}
        maxDateTransform={getEndOfDay}
        minDateTransform={getBeginOfDay}
        view="month"
    >
        {getDay(date)}
    </Tile>
);

Day.propTypes = {
    ...tileProps,
    currentMonthIndex: PropTypes.number.isRequired,
};

export default Day;
