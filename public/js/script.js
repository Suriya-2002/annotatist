document.querySelector('.button--annotate').addEventListener('click', event => {
    event.preventDefault();

    window.api.send('getPathsFile');
});

window.api.receive('filePaths', filePath => {
    console.log(filePath);
    window.location = '/annotate';
});
