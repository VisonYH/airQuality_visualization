var express = require('express');
var historyRouter = require('./historyRouter');

var app = new express();

app.use('/', historyRouter);
app.listen(3000, function(){
    console.log("正在监听3000端口")
})