/**
 * create 2018/1/22
 */


const express = require('express')
const app = express()
const router = require('./router/index.js')

//静态文件处理
app.use(express.static('./public'))
app.use(express.static('./uploads'))
//模板文件
app.set('view engine','ejs')
//主页
app.get('/',router.showIndex)
//管理员
app.get('/admin',router.showAdmin)
app.post('/admin',router.saveImage)
app.get('/delete/:dirName/:fileName',router.deleteFile)
//相册
app.get('/:albumName',router.showAlbum)
app.use(router.error)
app.listen(3000)
console.log('sever in on ')
