/**
 * Converts Object to Array
 *
 * input format: {title: {url, elem}}
 * output format: [{title, url, elem}]
 *
 * @param sourceObj
 * @param initArray
 */
const sourceObjToArray = (sourceObj, initArray = []) =>
    Object.keys(sourceObj).reduce(
        (sources, title) => {
            const source = Object.assign({ title }, sourceObj[title]);

            return sources.concat(source);
        },
        initArray
    );

export default sourceObjToArray;
