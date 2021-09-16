const { app, BrowserWindow } = require('electron');

const server = require('./app');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
    });

    mainWindow.loadURL('http://localhost:2002');

    mainWindow.maximize();
    mainWindow.webContents.openDevTools();

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
