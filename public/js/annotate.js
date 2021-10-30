const navigationLines = document.querySelector('.navigation__lines');
const navigationBar = document.querySelector('.navigation');

const coordinatesContainer = document.querySelector('.coordinates');

const annotateImage = document.querySelector('.annotate__image');
const annotateForm = document.querySelector('.annotate-form');

const yoloBox = document.querySelector('.resizable-box-yolo');
const modelBBox = document.querySelector('.resizable-box-model-b');
const interpolationBox = document.querySelector('.resizable-box-interpolation');

const controlButtons = document.querySelector('.control-buttons');
const resetControlButton = document.querySelector('.control-buttons__reset');
const nextControlButton = document.querySelector('.control-buttons__next');

const resizableBox = document.querySelector('.resizable-box');
const resizsers = document.querySelectorAll('.resizable-box__resizer');

const data = document.querySelector('.data');

const userCoordinates = [
    document.querySelector('.coordinates__value--user-y-min'),
    document.querySelector('.coordinates__value--user-x-min'),
    document.querySelector('.coordinates__value--user-y-max'),
    document.querySelector('.coordinates__value--user-x-max'),
];

const errorCoordinates = [
    document.querySelector('.coordinates__value--error-y-min'),
    document.querySelector('.coordinates__value--error-x-min'),
    document.querySelector('.coordinates__value--error-y-max'),
    document.querySelector('.coordinates__value--error-x-max'),
];

const annotateFormCoordinates = [
    document.querySelector('.annotate-form__yMin'),
    document.querySelector('.annotate-form__xMin'),
    document.querySelector('.annotate-form__yMax'),
    document.querySelector('.annotate-form__xMax'),
];

const modelCoordinates = {
    yolo: {
        yMin: Number(document.querySelector('.coordinates__value--yolo-y-min').innerHTML),
        xMin: Number(document.querySelector('.coordinates__value--yolo-x-min').innerHTML),
        yMax: Number(document.querySelector('.coordinates__value--yolo-y-max').innerHTML),
        xMax: Number(document.querySelector('.coordinates__value--yolo-x-max').innerHTML),
    },
    modelB: {
        yMin: Number(document.querySelector('.coordinates__value--model-b-y-min').innerHTML),
        xMin: Number(document.querySelector('.coordinates__value--model-b-x-min').innerHTML),
        yMax: Number(document.querySelector('.coordinates__value--model-b-y-max').innerHTML),
        xMax: Number(document.querySelector('.coordinates__value--model-b-x-max').innerHTML),
    },
    interpolation: {
        yMin: Number(document.querySelector('.coordinates__value--interpolation-y-min').innerHTML),
        xMin: Number(document.querySelector('.coordinates__value--interpolation-x-min').innerHTML),
        yMax: Number(document.querySelector('.coordinates__value--interpolation-y-max').innerHTML),
        xMax: Number(document.querySelector('.coordinates__value--interpolation-x-max').innerHTML),
    },
};

const modelCoordinatesExists =
    modelCoordinates.modelB.yMin &&
    modelCoordinates.modelB.xMin &&
    modelCoordinates.modelB.yMax &&
    modelCoordinates.modelB.xMax
        ? true
        : false;

const frameNumber = Number(data.dataset.frameNumber);
const fileExists = Boolean(data.dataset.fileExists);

const updateErrorCoordinates = () => {
    if (modelCoordinatesExists) {
        errorCoordinates[0].innerHTML = userCoordinates[0].innerHTML - modelCoordinates.modelB.yMin;
        errorCoordinates[1].innerHTML = userCoordinates[1].innerHTML - modelCoordinates.modelB.xMin;
        errorCoordinates[2].innerHTML = userCoordinates[2].innerHTML - modelCoordinates.modelB.yMax;
        errorCoordinates[3].innerHTML = userCoordinates[3].innerHTML - modelCoordinates.modelB.xMax;
    } else {
        errorCoordinates[0].innerHTML = userCoordinates[0].innerHTML;
        errorCoordinates[1].innerHTML = userCoordinates[1].innerHTML;
        errorCoordinates[2].innerHTML = userCoordinates[2].innerHTML;
        errorCoordinates[3].innerHTML = userCoordinates[3].innerHTML;
    }
};

const drawResizableBox = (yMin, xMin, yMax, xMax) => {
    const minimumSize = 50;

    let originalWidth = 0;
    let originalHeight = 0;

    let originalX = 0;
    let originalY = 0;

    let originalMouseX = 0;
    let originalMouseY = 0;

    resizableBox.style.top = `${yMin}px`;
    resizableBox.style.left = `${xMin}px`;
    resizableBox.style.height = `${yMax - yMin}px`;
    resizableBox.style.width = `${xMax - xMin}px`;

    userCoordinates[0].innerHTML = yMin;
    userCoordinates[1].innerHTML = xMin;
    userCoordinates[2].innerHTML = yMax;
    userCoordinates[3].innerHTML = xMax;

    updateErrorCoordinates();

    resizsers.forEach(resizser => {
        resizser.addEventListener('mousedown', event => {
            event.preventDefault();

            originalWidth = Number(
                getComputedStyle(resizableBox, null).getPropertyValue('width').replace('px', '')
            );
            originalHeight = Number(
                getComputedStyle(resizableBox, null).getPropertyValue('height').replace('px', '')
            );

            originalX = resizableBox.getBoundingClientRect().left;
            originalY = resizableBox.getBoundingClientRect().top;

            originalMouseX = event.pageX;
            originalMouseY = event.pageY;

            window.addEventListener('mousemove', startResize);
            window.addEventListener('mouseup', stopResize);
        });

        const startResize = event => {
            if (resizser.classList.contains('resizable-box__resizer--bottom-right')) {
                const width = originalWidth + (event.pageX - originalMouseX);
                const height = originalHeight + (event.pageY - originalMouseY);

                if (width > minimumSize) resizableBox.style.width = width + 'px';
                if (height > minimumSize) resizableBox.style.height = height + 'px';

                userCoordinates[2].innerHTML = event.pageY;
                userCoordinates[3].innerHTML = event.pageX;
            } else if (resizser.classList.contains('resizable-box__resizer--bottom-left')) {
                const width = originalWidth - (event.pageX - originalMouseX);
                const height = originalHeight + (event.pageY - originalMouseY);

                if (width > minimumSize) {
                    resizableBox.style.width = width + 'px';
                    resizableBox.style.left = originalX + (event.pageX - originalMouseX) + 'px';
                }
                if (height > minimumSize) resizableBox.style.height = height + 'px';

                userCoordinates[1].innerHTML = event.pageX;
                userCoordinates[2].innerHTML = event.pageY;
            } else if (resizser.classList.contains('resizable-box__resizer--top-right')) {
                const width = originalWidth + (event.pageX - originalMouseX);
                const height = originalHeight - (event.pageY - originalMouseY);

                if (width > minimumSize) resizableBox.style.width = width + 'px';
                if (height > minimumSize) {
                    resizableBox.style.height = height + 'px';
                    resizableBox.style.top = originalY + (event.pageY - originalMouseY) + 'px';
                }

                userCoordinates[0].innerHTML = event.pageY;
                userCoordinates[3].innerHTML = event.pageX;
            } else if (resizser.classList.contains('resizable-box__resizer--top-left')) {
                const width = originalWidth - (event.pageX - originalMouseX);
                const height = originalHeight - (event.pageY - originalMouseY);

                if (width > minimumSize) {
                    resizableBox.style.width = width + 'px';
                    resizableBox.style.left = originalX + (event.pageX - originalMouseX) + 'px';
                }
                if (height > minimumSize) {
                    resizableBox.style.height = height + 'px';
                    resizableBox.style.top = originalY + (event.pageY - originalMouseY) + 'px';
                }

                userCoordinates[0].innerHTML = event.pageY;
                userCoordinates[1].innerHTML = event.pageX;
            }

            updateErrorCoordinates();
        };

        const stopResize = () => {
            window.removeEventListener('mousemove', startResize);
        };
    });
};

const drawModelBox = (modelBox, coordinates) => {
    modelBox.style.borderWidth = '0.4rem';
    modelBox.style.top = `${coordinates.yMin}px`;
    modelBox.style.left = `${coordinates.xMin}px`;
    modelBox.style.width = `${coordinates.xMax - coordinates.xMin}px`;
    modelBox.style.height = `${coordinates.yMax - coordinates.yMin}px`;
};

const drawBox = () => {
    drawModelBox(yoloBox, modelCoordinates.yolo);
    drawModelBox(modelBBox, modelCoordinates.modelB);
    drawModelBox(interpolationBox, modelCoordinates.interpolation);

    if (
        userCoordinates[0].innerHTML !== '--' &&
        userCoordinates[1].innerHTML !== '--' &&
        userCoordinates[2].innerHTML !== '--' &&
        userCoordinates[3].innerHTML !== '--'
    ) {
        drawResizableBox(
            Number(userCoordinates[0].innerHTML),
            Number(userCoordinates[1].innerHTML),
            Number(userCoordinates[2].innerHTML),
            Number(userCoordinates[3].innerHTML)
        );
    } else if (modelCoordinatesExists) {
        drawResizableBox(
            modelCoordinates.modelB.yMin,
            modelCoordinates.modelB.xMin,
            modelCoordinates.modelB.yMax,
            modelCoordinates.modelB.xMax
        );
    } else {
        drawResizableBox('--', '--', '--', '--');
    }
};
drawBox();

navigationLines.addEventListener('click', () => {
    navigationBar.classList.toggle('navigation--active');
    controlButtons.classList.toggle('control-buttons--shrink');
});

coordinatesContainer.addEventListener('click', event => {
    const coordinateBox = event.target.closest('.coordinates__box');
    const className = coordinateBox.classList[1];

    coordinateBox.classList.toggle(`${className}-disable`);

    if (className.includes('yolo')) {
        yoloBox.classList.toggle('resizable-box-yolo--disable');
    } else if (className.includes('model-b')) {
        modelBBox.classList.toggle('resizable-box-model-b--disable');
    } else if (className.includes('interpolation')) {
        interpolationBox.classList.toggle('resizable-box-interpolation--disable');
    }
});

if (!fileExists) {
    nextControlButton.addEventListener('click', () => {
        for (i = 0; i < 4; i++) annotateFormCoordinates[i].value = userCoordinates[i].innerHTML;
        annotateForm.submit();
    });

    if (frameNumber === 0) {
        annotateImage.addEventListener(
            'click',
            event => {
                resizableBox.classList.remove('resizable-box--hidden');
                drawResizableBox(event.pageY - 50, event.pageX - 50, event.pageY + 50, event.pageX + 50);
            },
            { once: true }
        );
    }

    if (frameNumber > 0 && modelCoordinatesExists) {
        resetControlButton.addEventListener('click', () => {
            drawResizableBox(
                modelCoordinates.modelB.yMin,
                modelCoordinates.modelB.xMin,
                modelCoordinates.modelB.yMax,
                modelCoordinates.modelB.xMax
            );
        });
    }
} else {
    resizableBox.style.pointerEvents = 'none';
}
