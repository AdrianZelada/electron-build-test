var express = require('express');
var path = require('path');
let app = express();
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

const domain = '127.0.0.1';
const port = 4500;

function Server() {

    return new Promise((resolve)=>{
        app.use(express.static(path.join(__static), { maxAge: 31557600000 }));

        app.get('*', function (req, res) {
            const p =path.join(__static, "/index.html")
            if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                res.sendFile(path.resolve(`./app/${req.url}`));
            } else {
                res.sendFile(path.resolve(p));
            }
        });
        return app.listen([port], () => {
            const url= {
                path: domain,
                port: port
            };
            return resolve(url);
        });
    })

}

export {Server};