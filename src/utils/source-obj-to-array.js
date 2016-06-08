const sourceObjToArray = (sourceObj, initArray = []) =>
    Object.keys(sourceObj).reduce(
        (sources, url) => {
            const source = Object.assign({ url }, sourceObj[url]);

            return sources.concat(source);
        },
        initArray
    );

export default sourceObjToArray;
