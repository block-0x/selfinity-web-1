import React from 'react';
import PropTypes from 'prop-types';

import Tile from '@modules/Calendar/Tile';

import { getBeginOfYear, getEndOfYear } from '@modules/Calendar/shared/dates';
import { tileProps } from '@modules/Calendar/shared/propTypes';

const className = 'react-calendar__decade-view__years__year';

const Year = ({ classes, point, ...otherProps }) => (
    <Tile
        {...otherProps}
        classes={[...classes, className]}
        maxDateTransform={getEndOfYear}
        minDateTransform={getBeginOfYear}
        view="decade"
    >
        {point}
    </Tile>
);

Year.propTypes = {
    ...tileProps,
    point: PropTypes.number.isRequired,
};

export default Year;
