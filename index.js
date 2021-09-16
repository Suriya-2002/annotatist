const { app, BrowserWindow } = require('electron');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
    });

    mainWindow.loadFile('index.html');

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
