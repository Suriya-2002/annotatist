const fs = require('fs');

const dataset = {
    image: {
        fullPath: '',
        relativePath: '',
        files: [],
    },
    yolo: {
        fullPath: '',
        relativePath: '',
        files: [],
    },
    modelB: {
        fullPath: '',
        relativePath: '',
        files: [],
    },
    interpolation: {
        fullPath: '',
        relativePath: '',
        files: [],
    },
    outputFolder: '',
};

exports.updatePathsAndFiles = async (pathsFile, callBack) => {
    try {
        const fileContent = await fs.promises.readFile(pathsFile);

        const { imageFolder, yoloFolder, modelBFolder, interpolationFolder, outputFolder } =
            JSON.parse(fileContent);

        dataset.image.fullPath = imageFolder;
        dataset.yolo.fullPath = yoloFolder;
        dataset.modelB.fullPath = modelBFolder;
        dataset.interpolation.fullPath = interpolationFolder;

        dataset.image.relativePath = imageFolder.split('public')[1];
        dataset.yolo.relativePath = yoloFolder.split('public')[1];
        dataset.modelB.relativePath = modelBFolder.split('public')[1];
        dataset.interpolation.relativePath = interpolationFolder.split('public')[1];

        dataset.image.files = await fs.promises.readdir(imageFolder);
        dataset.yolo.files = await fs.promises.readdir(yoloFolder);
        dataset.modelB.files = await fs.promises.readdir(modelBFolder);
        dataset.interpolation.files = await fs.promises.readdir(interpolationFolder);

        dataset.outputFolder = outputFolder;

        callBack();
    } catch (error) {
        console.log(error);
    }
};

exports.dataset = dataset;
