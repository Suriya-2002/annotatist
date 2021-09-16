const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        const validChannels = ['getPathsFile'];
        if (validChannels.includes(channel)) ipcRenderer.send(channel, data);
    },

    receive: (channel, callBack) => {
        const validChannels = ['filePaths'];

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => callBack(...args));
        }
    },
});
