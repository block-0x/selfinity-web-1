import Calendar from '@modules/Calendar/Calendar';
import CenturyView from '@modules/Calendar/CenturyView';
import DecadeView from '@modules/Calendar/DecadeView';
import YearView from '@modules/Calendar/YearView';
import MonthView from '@modules/Calendar/MonthView';

// File is created during build phase and placed in dist directory
// eslint-disable-next-line import/no-unresolved
import '@modules/Calendar/Calendar.css';

export default Calendar;

export { Calendar, CenturyView, DecadeView, YearView, MonthView };
