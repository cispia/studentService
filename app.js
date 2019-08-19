const userApi = require('./api/user');
const cover=require("./api/cover");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//登录注册
app.use('/', userApi);
//照片上传
app.use("/cover",cover);
app.use(express.static("./public"));
// 监听端口
app.listen(3000);
console.log('启动成功');