const fs = require('fs');
const path = require('path');

const { dataset } = require('./dataset');

module.exports = class Coordinates {
    constructor(objectName, yMin, xMin, yMax, xMax) {
        this.objectName = objectName;

        this.yMin = yMin;
        this.xMin = xMin;
        this.yMax = yMax;
        this.xMax = xMax;
    }

    async save(frameNumber, callBack) {
        try {
            const filePath = path.join(dataset.outputFolder, `${frameNumber}.txt`);
            const data = `${this.objectName} ${this.yMin} ${this.xMin} ${this.yMax} ${this.xMax}`;

            await fs.promises.writeFile(filePath, data);

            callBack();
        } catch (error) {
            console.log(error);
        }
    }

    static async fetchModelCoordinates(frameNumber, callBack) {
        const modelCoordinates = {
            yolo: {
                yMin: 0,
                xMin: 0,
                yMax: 0,
                xMax: 0,
            },
            modelB: {
                yMin: 0,
                xMin: 0,
                yMax: 0,
                xMax: 0,
            },
            interpolation: {
                yMin: 0,
                xMin: 0,
                yMax: 0,
                xMax: 0,
            },
        };

        const yoloFilePath = path.join(dataset.yolo.fullPath, dataset.yolo.files[frameNumber]);
        const modelBFilePath = path.join(dataset.modelB.fullPath, dataset.modelB.files[frameNumber]);
        const interpolationFilePath = path.join(
            dataset.interpolation.fullPath,
            dataset.interpolation.files[frameNumber]
        );

        try {
            const yoloData = await fs.promises.readFile(yoloFilePath);
            const modelBData = await fs.promises.readFile(modelBFilePath);
            const interpolationData = await fs.promises.readFile(interpolationFilePath);

            const yoloCoordinates = yoloData.toString().split(' ');
            modelCoordinates.yolo.yMin = yoloCoordinates[1];
            modelCoordinates.yolo.xMin = yoloCoordinates[2];
            modelCoordinates.yolo.yMax = yoloCoordinates[3];
            modelCoordinates.yolo.xMax = yoloCoordinates[4];

            const modelBCoordinates = modelBData.toString().split(' ');
            modelCoordinates.modelB.yMin = modelBCoordinates[1];
            modelCoordinates.modelB.xMin = modelBCoordinates[2];
            modelCoordinates.modelB.yMax = modelBCoordinates[3];
            modelCoordinates.modelB.xMax = modelBCoordinates[4];

            const interpolationCoordinates = interpolationData.toString().split(' ');
            modelCoordinates.interpolation.yMin = interpolationCoordinates[1];
            modelCoordinates.interpolation.xMin = interpolationCoordinates[2];
            modelCoordinates.interpolation.yMax = interpolationCoordinates[3];
            modelCoordinates.interpolation.xMax = interpolationCoordinates[4];

            callBack(modelCoordinates);
        } catch (error) {
            console.log(error);
        }
    }
};
