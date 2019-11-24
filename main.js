const { app, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('template/index.html')

  // Open the DevTools.
  win.webContents.closeDevTools()


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// ipcMain.on('open-primary-window', (e) => {
//   // let windowView = document.getElementById
//   createSubWindow('template/primary.html', 'window-is-open', e)
//   // e.sender.send(responseNotification)
// })

// let newWin

// function createSubWindow (htmlFile, responseNotification, e) {
//     // Create the browser window.
//     newWin = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {
//         nodeIntegration: true
//       },
//       parent: win,
//       modal: false
//     })
  
//     // and load the index.html of the app.
//     newWin.loadFile(htmlFile)
//     newWin.on('show', () => {
//       e.sender.send(responseNotification)
//       // axios.get('https://yammor.com/Masjed/app/show/services.php')
//       // .then(function (response) {
//       //   // handle success
        
//       //   Primarys = response.data

//       //   Primarys.forEach(Primary => {
//       //     // console.log(Primary["MasName"]);
//       //     console.log(PrimaryView.addItem(Primary));

//       //     // let PrimaryViews = newWin.w.getElementById('Primarys')
//       //     // PrimaryViews.appendChild(PrimaryView.addItem(Primary))
//       //   });
        
//       // })
//       // .catch(function (error) {
//       //   // handle error
//       //   console.log(error);
//       // })
//       // .finally(function () {
//       //   // always executed
//       // })
//     })
//     // Open the DevTools.
//     newWin.webContents.openDevTools()
  
//     // Emitted when the window is closed.
//     newWin.on('closed', () => {
//       // Dereference the window object, usually you would store windows
//       // in an array if your app supports multi windows, this is the time
//       // when you should delete the corresponding element.
//       newWin = null
//     })
//   }


const PDFWindow = require('electron-pdf-window')
let winPDF

ipcMain.on('open-pdf-window', (e, data) => {

  const win = new BrowserWindow({ width: 800, height: 600 , webPreferences: {
    nodeIntegration: true,
  }})
  win.webContents.closeDevTools()
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('store-data', data, 'entry report');
  });
  win.loadFile('template/entryReportView.html')

})