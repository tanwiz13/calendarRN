import moment from 'moment';

export function newDate(date) {
    if (date === 'new') {
        return moment();
    }
    return moment(date);
};

export function stringFormat(date) {
    return date.format('YYYY-MM-DD');
};

export function changeDateFormat(date, format) {
    // console.log(moment(date).format(format))
    return moment(date).format(format);
};

export function isBefore(date1, date2) {
    return moment(date1).isBefore(date2);
};

export function isAfter(date1, date2) {
    return moment(date1).isAfter(date2);
};