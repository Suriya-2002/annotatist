const { updatePathsAndFiles } = require('./../model/dataset');
const { getImageURL, getFileList } = require('./../model/fetch');
const Coordinates = require('./../model/coordinates');

exports.getAnnotate = (req, res, next) => {
    const frameNumber = Number(req.params.frameNumber);

    const imageURL = getImageURL(frameNumber);
    const fileList = getFileList(frameNumber);

    Coordinates.exists(frameNumber + 1, fileExists => {
        if (fileExists) {
            Coordinates.fetchModelCoordinates(frameNumber, modelCoordinates => {
                Coordinates.fetchUserCoordinates(frameNumber + 1, userCoordinates => {
                    res.render('annotate', {
                        imageURL,
                        fileList,
                        frameNumber,
                        modelCoordinates,
                        userCoordinates,
                        fileExists,
                    });
                });
            });
        } else if (frameNumber == 0) {
            res.render('annotate', { imageURL, fileList, frameNumber });
        } else {
            Coordinates.fetchModelCoordinates(frameNumber, modelCoordinates => {
                res.render('annotate', { imageURL, fileList, frameNumber, modelCoordinates });
            });
        }
    });
};

exports.postAnnotate = (req, res, next) => {
    const frameNumber = Number(req.params.frameNumber);
    const { yMin, xMin, yMax, xMax } = req.body;

    const userCoordinates = new Coordinates('car', yMin, xMin, yMax, xMax);

    userCoordinates.save(frameNumber, () => {
        res.redirect(`/annotate/${frameNumber}`);
    });
};

exports.postAnnotateOpen = (req, res, next) => {
    const { pathsFile } = req.body;

    updatePathsAndFiles(pathsFile, () => {
        res.redirect('/annotate/0');
    });
};
