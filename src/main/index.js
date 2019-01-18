'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
// import { Server} from './server'
// const {spawn} = require("child_process");


const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow();

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

    // Server().then((url)=>{
        console.log('server');
        // console.log(url)
        window.loadURL(formatUrl({
            pathname: `www.google.com`,
            protocol: 'http',

            // pathname: path.join(__dirname, 'index.html'),
            // protocol: 'file',
            slashes: true
        }));
    // });

  window.on('closed', () => {
    mainWindow = null
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus()
    })
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
});
