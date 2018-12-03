var express = require('express');
var router = express.Router();
const fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'air_quality'
});
connection.connect(function(err){
  if(err){
      console.log("链接失败");
      throw(err)
  } else {
      console.log("链接成功");
  }
})

let configData = [];
connection.query('SELECT DISTINCT province from station', function(err, provinces) {
  provinces.forEach(province => {
    let item = {};
    item.label = province.province;
    item.value = province.province;
    item.children = [];
    let sql = `SELECT DISTINCT city from station WHERE province="${province.province}"`;
    connection.query(sql, function(err, cities) {
      cities.forEach(city => {
        let temp = {};
        temp.label = city.city;
        temp.value = city.city;
        let sql = `SELECT DISTINCT stationName from station WHERE city="${city.city}"`;
        connection.query(sql, function(err, stations) {
          temp.children = []
          stations.forEach(station => {
            temp.children.push({label: station.stationName, value: station.stationName})
          })
          item.children.push(temp);
        })
      })
    })
    configData.push(item);
    // setTimeout(function() {
    //   fs.writeFile('config.json', JSON.stringify(configData), () => {})
    // }, 10000)
  })
})
router.get('/spaceMenu', function(req, res) {
  fs.readFile('./config.json', function(err, data) {
    res.json(JSON.parse(data.toString()));
  })
})

module.exports = router
