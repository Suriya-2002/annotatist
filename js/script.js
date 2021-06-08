const annotateImage = document.querySelector('.annotate__image');

const resizableBox = document.querySelector('.resizable-box');
const resizsers = document.querySelectorAll('.resizable-box__resizer');

const userCoordinates = [
    document.querySelector('.coordinates__value--user-y-min'),
    document.querySelector('.coordinates__value--user-x-min'),
    document.querySelector('.coordinates__value--user-y-max'),
    document.querySelector('.coordinates__value--user-x-max'),
];

document.querySelector('.navigation__lines').addEventListener('click', () => {
    document.querySelector('.navigation').classList.toggle('navigation--active');
    document.querySelector('.control-buttons').classList.toggle('control-buttons--shrink');
});

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
        };

        const stopResize = () => {
            window.removeEventListener('mousemove', startResize);
        };
    });
};

annotateImage.addEventListener(
    'click',
    event => {
        resizableBox.classList.remove('resizable-box--hidden');
        drawResizableBox(event.pageY - 50, event.pageX - 50, event.pageY + 50, event.pageX + 50);
    },
    { once: true }
);
