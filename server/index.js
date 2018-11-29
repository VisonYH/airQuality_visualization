const express = require('express');
const historyRouter = require('./historyRouter');
const spaceRouter = require('./spaceMenuRouter');
const spaceMenuRouter = require('./getSpaceMenu');
var bodyParser = require('body-parser');
var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/history', historyRouter);
app.use('/space', spaceRouter);
app.use('/menu', spaceMenuRouter)
app.listen(3000, function(){
    console.log("正在监听3000端口")
})
