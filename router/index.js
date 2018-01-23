const file = require('../models/file.js')
const formidable = require('formidable')
const util = require('util')
const path = require('path')
const fs = require('fs')
const sd = require('silly-datetime')
exports.showIndex = (req, res) => {
    file.getDirs((err, albums) => {
        if (err) {
            res.send(err)
            return
        }
        res.render('index', {
            dirs: albums
        })
    })
}


exports.showAlbum = (req, res, next) => {
    let albumName = req.params.albumName
    file.getFilesByDirName(albumName, (err, files) => {
        if (err) {
            next()
            return
        }
        res.render('album', {
            albumName: albumName,
            files: files
        })
    })

}

exports.showAdmin = (req, res) => {
    file.getDirs((err, albums) => {
        if (err) {
            res.send(err)
            return
        }
        res.render('form', {
            dirs: albums
        })
    })
}

exports.saveImage = (req, res,next) => {
    let form = new formidable.IncomingForm();
    //临时文件夹
    form.uploadDir = path.normalize(__dirname+'/../tmp')
    form.parse(req, (err, fields, files) =>{      
        if(err){
            next()
            return
        }
        let ttt = sd.format(new Date(), 'YYYYMMDDHHmmss'),
        ran = parseInt(Math.random() * 89999 + 10000),
        extname = path.extname(files.picture.name),
        dirsName = fields.dir,
        oldPath = files.picture.path,
        newPath = path.normalize(__dirname+"/../uploads/"+dirsName+'/'+ttt+ran+extname),
        dirPath = path.normalize(__dirname+"/../uploads/"+dirsName);
        fs.readdir(dirPath,(err,files)=>{
            if(err){//没有文件夹，新建
                fs.mkdir(dirPath,(err)=>{
                    if(err){
                        console.log('新建文件夹失败')
                        res.send('fail')
                    }else{
                        fs.rename(oldPath,newPath,(err)=>{
                            if(err){
                                res.send('图片改名失败');
                                return
                            }
                            res.render('result',{
                                path:newPath
                            })                          
                        })
                    }
                })
            }else{//有文件夹，保存
                fs.rename(oldPath,newPath,(err)=>{
                    if(err){
                        res.send('图片改名失败');
                        return
                    }
                    res.render('result',{
                        path:newPath
                    })
                    // let size =  parseInt(files.picture.size)
                    // console.log(size,files.picture)
                    // if(size > 1024*2){
                    //     fs.unlink(files.picture.path,(err)=>{
                    //         // if(err){
                    //         //     res.send('删除失败')
                    //         // }else{
                    //         //     res.send('图片应该小于2M')
                    //         // }
                    //         console.log(err)
                    //         res.send('fail')
                    //     })
                    // }else{
                    //     res.render('result',{
                    //         path:newPath
                    //     })
                    // }            
                })
            }
        })       
        
    });
}


exports.deleteFile = (req,res) =>{
    let dirName = req.params.dirName,fileName = req.params.fileName;
    file.deleteFile(dirName,fileName,(err)=>{
        if(err){
            res.send('删除失败')
        }else{
            res.render('deleteresult',{
                albumName:dirName
            })
        }
    })
}


exports.error = (req, res) => {
    res.render('404')
}