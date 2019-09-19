import React from 'react';
import PropTypes from 'prop-types';

import Tile from '@modules/Calendar/Tile';

import { getBeginOfMonth, getEndOfMonth } from '@modules/Calendar/shared/dates';
import {
    formatMonth as defaultFormatMonth,
    formatMonthYear,
} from '@modules/Calendar/shared/dateFormatter';
import { tileProps } from '@modules/Calendar/shared/propTypes';

const className = 'react-calendar__year-view__months__month';

const Month = ({ classes, date, formatMonth, locale, ...otherProps }) => (
    <Tile
        {...otherProps}
        classes={[...classes, className]}
        date={date}
        formatAbbr={formatMonthYear}
        locale={locale}
        maxDateTransform={getEndOfMonth}
        minDateTransform={getBeginOfMonth}
        view="year"
    >
        {formatMonth(locale, date)}
    </Tile>
);

Month.defaultProps = {
    formatMonth: defaultFormatMonth,
};

Month.propTypes = {
    ...tileProps,
    formatMonth: PropTypes.func,
};

export default Month;
