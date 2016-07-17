import path from 'path';

const extractFormat = name => path.extname(name).split('.')[1];

export default extractFormat;
