import {isAfter, isBefore, stringFormat, changeDateFormat} from '../src/utility/CommonFunctions';
import moment from 'moment';

test('Tests whether the date1 occurs after date2', ()=>{
    expect(isAfter('2020-12-28', '2020-12-27')).toBe(true);
});

test('Tests whether the date1 occurs before date2', ()=>{
    expect(isBefore('2020-12-27', '2020-12-28')).toBe(true);
});

test('Tests whether the date is in format YYYY-MM-DD', ()=>{
    expect(stringFormat(moment('2020-12-24'))).toBe('2020-12-24');
});

test('Tests whether the date is in given format', ()=>{
    expect(changeDateFormat(moment('2020-12-24'), 'DD MMM YYYY')).toBe('24 Dec 2020');
});