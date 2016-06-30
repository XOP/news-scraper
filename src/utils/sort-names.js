/**
 * Sort filenames by postfix value if any
 *
 * First sort files that do not have postfix value
 * Second sort files that have postfix value over the ones that don't
 * Finally sort files with postfixes by postfix value
 * It is file creation date value here
 *
 * @param names
 * @param divider
 */
const sortNames = (names, divider = '@') =>
    names.sort((a, b) => {
        if (a.indexOf(divider) == -1 && b.indexOf(divider) == -1) {
            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            } else {
                return 0;
            }
        }

        if (a.indexOf(divider) == -1 && b.indexOf(divider) > -1) {
            return 1;
        }

        if (a.indexOf(divider) > -1 && b.indexOf(divider) > -1) {
            let aValue = a.split(divider)[1];
            aValue = aValue.split('.html')[0];

            let bValue = b.split(divider)[1];
            bValue = bValue.split('.html')[0];

            if (aValue < bValue) {
                return 1;
            } else if (aValue > bValue) {
                return -1;
            } else {
                return 0;
            }
        }
    });

export default sortNames;
