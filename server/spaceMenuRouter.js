var express = require('express');
var router = express.Router();
const fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'air'
});

connection.connect(function(err){
    if(err){
        console.log("链接失败");
        throw(err)
    } else {
        console.log("链接成功");
    }
})

router.get('/city/all', function(req, res) {
  let sql = "SELECT DISTINCT province, city FROM station";
  connection.query(sql, (err, result) => {
    res.json(result);
  })
})
router.get('/province', function(req, res) {
  let sql = "SELECT DISTINCT province FROM station";
  connection.query(sql, (err, result) => {
    let resData = [];
    result.forEach(item => {
      let i = {};
      i.label = item.province;
      i.cities = [];
      resData.push(i)
    })
    res.json(resData);
  })
})

router.get('/city/:province', function(req, res) {
  let sql = `SELECT DISTINCT city FROM station WHERE province='${req.params.province}'`;
  connection.query(sql, (err, result) => {
    let resData = [];
    console.log(result)
    result.forEach(item => {
      let i = {};
      i.label = item.city;
      i.cities = [];
      resData.push(i)
    })
    res.json(resData);
  })
})

router.get('/station/:city', function(req, res) {
  let sql = `SELECT DISTINCT stationName FROM station WHERE city='${req.params.city}'`;
  connection.query(sql, (err, result) => {
    let resData = [];
    console.log(result)
    result.forEach(item => {
      let i = {};
      i.label = item.stationName;
      resData.push(i)
    })
    res.json(resData);
  })
})

module.exports = router
