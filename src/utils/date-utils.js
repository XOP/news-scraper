import dateFormat from 'date-format';

export function getDate (date = new Date()) {
    return dateFormat('dd-MM-yyyy', date);
}

export function getTime (time = new Date()) {
    return dateFormat('hh:mm', time);
}

export function getDateMarker (fileName) {
    if (fileName) {
        let dateMarker;

        dateMarker = fileName.split('@')[1];
        dateMarker = dateMarker.split('.')[0];

        return dateMarker;
    } else {
        return new Date().getTime();
    }
}

export function getPreciseDate (date = new Date(), marker = date.getTime()) {
    return getDate(date) + '@' + marker;
}
