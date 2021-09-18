const annotateForm = document.querySelector('.annotate-form');
const annotatePathsFile = document.querySelector('.annotate-form__paths-file');
const annotateButton = document.querySelector('.annotate-form__button');

annotateButton.addEventListener('click', event => {
    event.preventDefault();
    window.api.send('getPathsFile');
});

window.api.receive('pathsFile', ([pathsFile]) => {
    annotatePathsFile.value = pathsFile;
    annotateForm.submit();
});
