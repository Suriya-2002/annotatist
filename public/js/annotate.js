const annotateImage = document.querySelector('.annotate__image');

const resizableBox = document.querySelector('.resizable-box');
const resizsers = document.querySelectorAll('.resizable-box__resizer');

const coordinatesContainer = document.querySelector('.coordinates');

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

const annotateForm = document.querySelector('.annotate-form');
const annotateFormCoordinates = [
    document.querySelector('.annotate-form__yMin'),
    document.querySelector('.annotate-form__xMin'),
    document.querySelector('.annotate-form__yMax'),
    document.querySelector('.annotate-form__xMax'),
];

const resetControlButton = document.querySelector('.control-buttons__reset');
const nextControlButton = document.querySelector('.control-buttons__next');

const updateErrorCoordinates = () => {
    if (
        modelCoordinates.modelB.yMin &&
        modelCoordinates.modelB.xMin &&
        modelCoordinates.modelB.yMax &&
        modelCoordinates.modelB.xMax
    ) {
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

                updateErrorCoordinates();
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

                updateErrorCoordinates();
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

                updateErrorCoordinates();
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

                updateErrorCoordinates();
            }
        };

        const stopResize = () => {
            window.removeEventListener('mousemove', startResize);
        };
    });
};

const drawYoloBox = (yMin, xMin, yMax, xMax) => {
    const yoloBox = document.querySelector('.resizable-box-yolo');
    yoloBox.style.borderWidth = '0.4rem';
    yoloBox.style.top = `${yMin}px`;
    yoloBox.style.left = `${xMin}px`;
    yoloBox.style.width = `${xMax - xMin}px`;
    yoloBox.style.height = `${yMax - yMin}px`;
};

const drawModelBBox = (yMin, xMin, yMax, xMax) => {
    const modelBBox = document.querySelector('.resizable-box-model-b');
    modelBBox.style.borderWidth = '0.4rem';
    modelBBox.style.top = `${yMin}px`;
    modelBBox.style.left = `${xMin}px`;
    modelBBox.style.width = `${xMax - xMin}px`;
    modelBBox.style.height = `${yMax - yMin}px`;
};

const drawInterpolationBox = (yMin, xMin, yMax, xMax) => {
    const interpolationBox = document.querySelector('.resizable-box-interpolation');
    interpolationBox.style.borderWidth = '0.4rem';
    interpolationBox.style.top = `${yMin}px`;
    interpolationBox.style.left = `${xMin}px`;
    interpolationBox.style.width = `${xMax - xMin}px`;
    interpolationBox.style.height = `${yMax - yMin}px`;
};

const drawBox = () => {
    drawYoloBox(
        modelCoordinates.yolo.yMin,
        modelCoordinates.yolo.xMin,
        modelCoordinates.yolo.yMax,
        modelCoordinates.yolo.xMax
    );

    drawModelBBox(
        modelCoordinates.modelB.yMin,
        modelCoordinates.modelB.xMin,
        modelCoordinates.modelB.yMax,
        modelCoordinates.modelB.xMax
    );

    drawInterpolationBox(
        modelCoordinates.interpolation.yMin,
        modelCoordinates.interpolation.xMin,
        modelCoordinates.interpolation.yMax,
        modelCoordinates.interpolation.xMax
    );

    if (
        modelCoordinates.modelB.yMin &&
        modelCoordinates.modelB.xMin &&
        modelCoordinates.modelB.yMax &&
        modelCoordinates.modelB.xMax
    ) {
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

document.querySelector('.navigation__lines').addEventListener('click', () => {
    document.querySelector('.navigation').classList.toggle('navigation--active');
    document.querySelector('.control-buttons').classList.toggle('control-buttons--shrink');
});

annotateImage.addEventListener(
    'click',
    event => {
        if (Number(annotateImage.dataset.frameNumber) === 0) {
            resizableBox.classList.remove('resizable-box--hidden');
            drawResizableBox(event.pageY - 50, event.pageX - 50, event.pageY + 50, event.pageX + 50);
        }
    },
    { once: true }
);

coordinatesContainer.addEventListener('click', event => {
    const coordinateBox = event.target.closest('.coordinates__box');
    const className = coordinateBox.classList[1];
    coordinateBox.classList.toggle(`${className}-disable`);

    if (className.includes('yolo')) {
        document.querySelector('.resizable-box-yolo').classList.toggle('resizable-box-yolo--disable');
    } else if (className.includes('model-b')) {
        document.querySelector('.resizable-box-model-b').classList.toggle('resizable-box-model-b--disable');
    } else if (className.includes('interpolation')) {
        document
            .querySelector('.resizable-box-interpolation')
            .classList.toggle('resizable-box-interpolation--disable');
    }
});

nextControlButton.addEventListener('click', () => {
    for (i = 0; i < 4; i++) annotateFormCoordinates[i].value = userCoordinates[i].innerHTML;
    annotateForm.submit();
});

resetControlButton.addEventListener('click', () => {
    if (
        resetControlButton.dataset.frameNumber > 0 &&
        modelCoordinates.modelB.yMin &&
        modelCoordinates.modelB.xMin &&
        modelCoordinates.modelB.yMax &&
        modelCoordinates.modelB.xMax
    )
        drawResizableBox(
            modelCoordinates.modelB.yMin,
            modelCoordinates.modelB.xMin,
            modelCoordinates.modelB.yMax,
            modelCoordinates.modelB.xMax
        );
});
