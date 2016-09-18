import dateFormat from 'date-format';

export function getDate (date = new Date()) {
    if (date instanceof Date === false) {
        date = new Date(date);
    }

    return dateFormat('dd-MM-yyyy', date);
}

export function getTime (time = new Date()) {
    if (time instanceof Date === false) {
        time = new Date(time);
    }

    return dateFormat('hh:mm', time);
}
