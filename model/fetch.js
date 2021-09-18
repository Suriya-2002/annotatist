const path = require('path');

const { dataset } = require('./dataset');

exports.getImageURL = frameNumber => {
    const { relativePath, files } = dataset.image;
    return path.join(relativePath, files[frameNumber]);
};

exports.getFileList = frameNumber => dataset.image.files.slice(0, frameNumber + 1);
