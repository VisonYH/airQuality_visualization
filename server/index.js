const express = require('express');
const historyRouter = require('./historyRouter');
const spaceRouter = require('./spaceMenuRouter');
const spaceMenuRouter = require('./getSpaceMenu');
const quhua = require('./quhua');
const realtimeRouter = require('./realtime');
const circleRouter = require('./circle');
const calender = require('./canlenderDataRouter')
var bodyParser = require('body-parser');
var app = new express();
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/history', historyRouter);
app.use('/space', spaceRouter);
app.use('/menu', spaceMenuRouter);
app.use('/quhua', quhua);
app.use('/realtime', realtimeRouter);
app.use('/circle', circleRouter);
app.use('/calender', calender);
app.listen(3000, function(){
    console.log("正在监听3000端口")
})
