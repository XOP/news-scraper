import path from 'path';

const formatFilename = ((pathName, fileName = '', date = '', ext = 'html') => {
    let fullFileName = fileName;

    if (fullFileName !== '' && date !== '') {
        fullFileName += '--';
    }

    if (date !== '') {
        fullFileName += `${date}`;
    }

    if (fileName !== '' || date !== '') {
        fullFileName += `.${ext}`;
    }

    return path.join(pathName, fullFileName);
});

export default formatFilename;
