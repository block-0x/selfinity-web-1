import React, { PureComponent } from 'react';

import TileGroup from '@modules/Calendar/TileGroup';
import Decade from '@modules/Calendar/CenturyView/Decade';

import {
    getBeginOfDecade,
    getBeginOfCenturyYear,
} from '@modules/Calendar/shared/dates';
import { tileGroupProps } from '@modules/Calendar/shared/propTypes';

export default class Decades extends PureComponent {
    get start() {
        const { activeStartDate } = this.props;
        return getBeginOfCenturyYear(activeStartDate);
    }

    get end() {
        return this.start + 99;
    }

    render() {
        return (
            <TileGroup
                {...this.props}
                className="react-calendar__century-view__decades"
                dateTransform={getBeginOfDecade}
                dateType="decade"
                end={this.end}
                start={this.start}
                step={10}
                tile={Decade}
            />
        );
    }
}

Decades.propTypes = {
    ...tileGroupProps,
};
