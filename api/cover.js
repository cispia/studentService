var express = require('express');
var fs = require("fs");
var multer = require("multer");
var path = require("path");
var router = express.Router();
router.use(multer({ dest: "./public/file/cover" }).any());
// 头像上传
router.post('/cover', (req, res)=>{
  var file = req.files[0];
  var oldname = file.filename;
  var newname = oldname + path.parse(file.originalname).ext;
  fs.renameSync('./public/file/cover/' + oldname, './public/file/cover/' + newname)
  res.send("/file/cover/" + newname);
});
//不就业凭据上传
router.post("/bjy",(req,res)=>{
  var file=req.files[0];
  var oldname=file.filename;
  var newname=oldname+path.parse(file.originalname).ext;
  fs.renameSync("./public/file/cover/"+oldname,"./public/file/cover/"+newname);
  res.send("/file/cover/"+newname);
})
module.exports = router;
