import React from 'react';
import PropTypes from 'prop-types';

import Tile from '@modules/Calendar/Tile';

import {
    getBeginOfDecade,
    getDecadeLabel,
    getEndOfDecade,
} from '@modules/Calendar/shared/dates';
import { tileProps } from '@modules/Calendar/shared/propTypes';

const className = 'react-calendar__century-view__decades__decade';

const Decade = ({ classes, point, ...otherProps }) => (
    <Tile
        {...otherProps}
        classes={[...classes, className]}
        maxDateTransform={getEndOfDecade}
        minDateTransform={getBeginOfDecade}
        view="century"
    >
        {getDecadeLabel(point)}
    </Tile>
);

Decade.propTypes = {
    ...tileProps,
    point: PropTypes.number.isRequired,
};

export default Decade;
