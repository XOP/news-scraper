import path from 'path';

const formatFilename = ((pathName, fileName, date, ext = 'html') => {
    let fullFileName = fileName;

    if (fullFileName !== '' && date !== '') {
        fullFileName += '--';
    }

    fullFileName += `${date}.${ext}`;

    return path.join(pathName, fullFileName);
});

export default formatFilename;
