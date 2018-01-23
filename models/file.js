const fs = require('fs')
const path = require('path')
exports.getDirs = callback => {
    fs.readdir('./uploads', (err, dirs) => {
        if (err) {
            callback('uploads is not find', null)
            return
        }
        let albums = [];
        (function iterator(i) {
            if (i === dirs.length) {
                callback(null, albums)
                return;
            }
            fs.stat('./uploads/' + decodeURI(dirs[i]), (err, stats) => {
                if (stats.isDirectory()) {
                    albums.push(decodeURI(dirs[i]))
                }
                iterator(i + 1)
            })
        })(0);
    })
}


exports.getFilesByDirName = (albumName, callback) => {
    fs.readdir('./uploads/' + albumName, (err, files) => {
        if (err) {
            callback(albumName + 'is not find', null)
            return
        }
        let result = [];
        (function iterator(i) {
            if (i === files.length) {
                callback(null, result)
                return;
            }
            fs.stat('./uploads/' + albumName + '/' + files[i], (err, stats) => {
                if (stats.isFile()) {
                    result.push(files[i])
                }
                iterator(i + 1)
            })
        })(0);
    })
}


exports.deleteFile = (dirName, fileName, callback) => {
    let filePath = path.normalize(__dirname + '/../uploads/' + dirName + '/' + fileName)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err)
            callback('删除文件失败')
        } else {
            callback(null)
        }
    })
}