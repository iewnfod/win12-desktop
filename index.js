const { app, BrowserWindow, protocol, MenuItem, Menu } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(8).split('?');
        // console.log(url);
        // 如果是字体文件，也就是以 woff / woff2 结尾
        // 把问号后面的东西都去掉，也就是去掉参数
        if (url[0].endsWith('.woff') || url[0].endsWith('.woff2')) {
            // console.log(`file:///${url[0]}`);
            callback(decodeURI(url[0]));
        } else {
            // 否则返回正常的完整字符串
            // console.log(`file:///${url.join('?')}`);
            callback(decodeURI(url.join('?')));
        }
    }, (error) => {
        if (error) {
            console.log("Failed to register protocol. ");
        }
    });

    win.loadFile('./index.html');

    return win;
}

app.whenReady().then(() => {
    // 自定义菜单
    let menu = Menu.getApplicationMenu();
    menu.insert( 4,
        new MenuItem({
            label: 'Tools',
            submenu: [
                {
                    label: 'Developer Tools',
                    accelerator: 'f12',
                    click: function () {
                        win.webContents.openDevTools();
                    }
                }
            ]
        })
    );

    Menu.setApplicationMenu(menu);

    // 创建窗口
    let win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
