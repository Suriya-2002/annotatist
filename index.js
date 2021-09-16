const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

const server = require('./app');

let mainWindow;

const getPathFile = async event => {
    try {
        const path = await dialog.showOpenDialog(mainWindow, {
            buttonLabel: 'Select paths file',
            defaultPath: app.getAppPath(),
        });

        mainWindow.webContents.send('filePaths', path.filePaths);
    } catch (error) {
        console.log(error);
    }
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: { preload: path.join(app.getAppPath(), 'preload.js') },
    });

    mainWindow.loadURL('http://localhost:2002');

    mainWindow.maximize();

    ipcMain.on('getPathsFile', getPathFile);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
